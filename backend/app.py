from flask import Flask, jsonify, request, send_file, render_template_string
from flask_cors import CORS
import csv
import json
import os
from toon_utils import (
    get_json_data_text,
    get_toon_data_text,
    count_tokens,
    estimate_cost,
    build_prompt,
    run_gemini
)

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://your-app.vercel.app"   # replace with your real Vercel URL
        ],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

# Load job postings data
JOBS_DATA = []
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', '60_Job_Records.csv')



def load_data():
    global JOBS_DATA
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        JOBS_DATA = list(reader)

load_data()

@app.route('/')
def home():
    return jsonify({"message": "Flask API is running", "status": "ok"})

@app.route('/api/dataset-info', methods=['GET'])
def dataset_info():
    columns = list(JOBS_DATA[0].keys()) if JOBS_DATA else []
    return jsonify({
        'filename': '60_Job_Records.csv',
        'rows': len(JOBS_DATA),
        'columns': columns
    })

@app.route('/api/dataset-format', methods=['GET'])
def dataset_format():
    format_type = request.args.get('format', 'json')
    
    if format_type == 'json':
        data_text = get_json_data_text(JOBS_DATA)
    else:
        data_text = get_toon_data_text(JOBS_DATA)
    
    tokens = count_tokens(data_text)
    cost_info = estimate_cost(tokens, 0)
    
    return jsonify({
        'format': format_type,
        'dataText': data_text,
        'tokens': tokens,
        'estimatedInputCost': cost_info['inputCost']
    })

@app.route('/api/table-preview', methods=['GET'])
def table_preview():
    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Job Postings Preview</title>
        <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #f8fafc; }
            h1 { color: #1e293b; }
            table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f1f5f9; font-weight: 600; color: #475569; position: sticky; top: 0; }
            tr:hover { background: #f8fafc; }
        </style>
    </head>
    <body>
        <h1>Job Postings - All 60 Rows</h1>
        <table>
            <thead>
                <tr>
    '''
    
    if JOBS_DATA:
        for col in JOBS_DATA[0].keys():
            html += f'<th>{col}</th>'
        html += '</tr></thead><tbody>'
        
        for job in JOBS_DATA:
            html += '<tr>'
            for value in job.values():
                html += f'<td>{value}</td>'
            html += '</tr>'
    
    html += '</tbody></table></body></html>'
    return html

@app.route('/download', methods=['GET'])
def download():
    return send_file(DATA_PATH, as_attachment=True, download_name='60_Job_Records.csv')

@app.route('/api/compare', methods=['POST'])
def compare():
    data = request.json
    query = data.get('query', '')
    selected_format = data.get('selectedFormat', 'json')
    
    if not query:
        return jsonify({'error': 'Query is required'}), 400
    
    # Get input data text
    if selected_format == 'json':
        input_data_text = get_json_data_text(JOBS_DATA)
    else:
        input_data_text = get_toon_data_text(JOBS_DATA)
    
    results = []
    
    # Run comparison for JSON output
    full_prompt_json, data_prompt_json = build_prompt(input_data_text, query, 'json')
    
    # Count tokens for cost calculation (data + query only, excluding instructions)
    input_tokens_json = count_tokens(data_prompt_json)
    
    try:
        response_json = run_gemini(full_prompt_json)  # Send full prompt to LLM
        output_tokens_json = count_tokens(response_json)
    except Exception as e:
        # Fallback with mock response
        response_json = json.dumps({'results': 'Mock JSON response', 'query': query}, indent=2)
        output_tokens_json = count_tokens(response_json)
    
    cost_json = estimate_cost(input_tokens_json, output_tokens_json)
    
    results.append({
        'label': f'{selected_format.upper()} → JSON',
        'outputFormat': 'json',
        'inputTokens': input_tokens_json,
        'outputTokens': output_tokens_json,
        'inputCost': cost_json['inputCost'],
        'outputCost': cost_json['outputCost'],
        'totalCost': cost_json['totalCost'],
        'responseText': response_json
    })
    
    # Run comparison for TOON output
    full_prompt_toon, data_prompt_toon = build_prompt(input_data_text, query, 'toon')
    
    # Count tokens for cost calculation (data + query only, excluding instructions)
    input_tokens_toon = count_tokens(data_prompt_toon)
    
    try:
        response_toon = run_gemini(full_prompt_toon)  # Send full prompt to LLM
        output_tokens_toon = count_tokens(response_toon)
    except Exception as e:
        # Fallback with mock response
        response_toon = "results[1]{mock}:\n  Mock TOON response\nquery: " + query
        output_tokens_toon = count_tokens(response_toon)
    
    cost_toon = estimate_cost(input_tokens_toon, output_tokens_toon)
    
    results.append({
        'label': f'{selected_format.upper()} → TOON',
        'outputFormat': 'toon',
        'inputTokens': input_tokens_toon,
        'outputTokens': output_tokens_toon,
        'inputCost': cost_toon['inputCost'],
        'outputCost': cost_toon['outputCost'],
        'totalCost': cost_toon['totalCost'],
        'responseText': response_toon
    })
    
    # Calculate comparison metrics
    output_savings = (output_tokens_json - output_tokens_toon) / output_tokens_json if output_tokens_json > 0 else 0
    cost_savings = (cost_json['totalCost'] - cost_toon['totalCost']) / cost_json['totalCost'] if cost_json['totalCost'] > 0 else 0
    
    return jsonify({
        'inputFormat': selected_format,
        'results': results,
        'comparison': {
            'outputTokensSavingsPct': round(output_savings, 2),
            'totalCostSavingsPct': round(cost_savings, 2)
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)