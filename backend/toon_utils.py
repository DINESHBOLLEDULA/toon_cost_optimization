import json
import os
import google.generativeai as genai

# Gemini 2.5 Flash Lite pricing (per million tokens)
INPUT_PRICE_PER_M = 0.075  # $0.075 per 1M input tokens
OUTPUT_PRICE_PER_M = 0.30  # $0.30 per 1M output tokens

# Try to import tiktoken, fall back to simple approximation if not available
try:
    import tiktoken
    tokenizer = tiktoken.get_encoding("cl100k_base")
    USE_TIKTOKEN = True
except ImportError:
    tokenizer = None
    USE_TIKTOKEN = False
    print("Warning: tiktoken not available, using character-based approximation")

# Import TOON library
try:
    from toon import encode as toon_encode, decode as toon_decode
    HAS_TOON = True
except ImportError:
    HAS_TOON = False
    print("Warning: python-toon not available, using manual TOON implementation")

# Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def get_json_data_text(jobs_data):
    """Convert jobs data to JSON string."""
    return json.dumps(jobs_data, indent=2)

def get_toon_data_text(jobs_data):
    """Convert jobs data to TOON format string using the official library."""
    if HAS_TOON:
        # Use the official TOON library
        return toon_encode(jobs_data)
    else:
        # Fallback: Manual TOON implementation
        # For array of uniform objects, use tabular format
        if not jobs_data:
            return ""
        
        # Get all keys from first object
        keys = list(jobs_data[0].keys())
        
        # Build TOON output
        lines = []
        lines.append(f"[{len(jobs_data)}]{{{'‚'.join(keys)}}}:")
        
        for job in jobs_data:
            values = [str(job.get(key, '')) for key in keys]
            lines.append("  " + ",".join(values))
        
        return '\n'.join(lines)

def count_tokens(text):
    """Count tokens in text using tiktoken or fallback approximation."""
    if USE_TIKTOKEN and tokenizer:
        return len(tokenizer.encode(text))
    else:
        # Fallback: Enhanced approximation
        # Average token length is ~4 characters for English text
        # Adjust for JSON/TOON structure
        char_count = len(text)
        
        # JSON has more overhead (brackets, quotes, commas)
        if '{' in text or '[' in text:
            # JSON format: slightly more tokens per character
            return int(char_count / 3.5)
        else:
            # TOON format: more efficient
            return int(char_count / 4)

def estimate_cost(input_tokens, output_tokens):
    """Calculate cost estimates based on token counts."""
    input_cost = (input_tokens / 1_000_000) * INPUT_PRICE_PER_M
    output_cost = (output_tokens / 1_000_000) * OUTPUT_PRICE_PER_M
    total_cost = input_cost + output_cost
    
    return {
        'inputCost': round(input_cost, 6),
        'outputCost': round(output_cost, 6),
        'totalCost': round(total_cost, 6)
    }

def build_prompt(input_data_text, user_query, output_format):
    """Build prompt for LLM based on output format.
    Returns: (full_prompt, data_only_prompt) tuple
    - full_prompt: Complete prompt with instructions for LLM
    - data_only_prompt: Just the query + data for cost calculation
    """
    
    if output_format == 'json':
        example = '''
Example JSON response:
{
  "results": [
    {"id": 1, "title": "Software Engineer", "company": "TechCorp"},
    {"id": 12, "title": "Data Scientist", "company": "DataFlow"},
    {"id": 25, "title": "Frontend Engineer", "company": "NimbusCorp"}
  ],
  "count": 3
}'''
        instruction = "Analyze the data and Respond with VALID JSON ONLY. No markdown code blocks, no explanation, just raw JSON.only give correct answers"
    else:
        example = '''
Example TOON response:
results[3]{id,title,company}:
  1,Software Engineer,TechCorp
  12,Data Scientist,DataFlow
  25,Frontend Engineer,NimbusCorp
count: 3'''
        instruction = "Analyze the data and Respond with VALID TOON FORMAT ONLY. Use the tabular format [N]{fields}: for arrays of uniform objects. No markdown, no explanation, just raw TOON.only give correct answers"
    
    # Full prompt for LLM
    full_prompt = f"""You are analyzing job posting data.

Dataset:
{input_data_text}

User Query: {user_query}

{example}

{instruction}"""
    
    # Data-only prompt for cost calculation (just query + data)
    data_only_prompt = f"""Dataset:
{input_data_text}

Query: {user_query}"""
    
    return full_prompt, data_only_prompt

def run_gemini(prompt):
    """Call Gemini 2.5 Flash Lite API with the prompt."""
    
    if not GEMINI_API_KEY:
        # Mock response for demo purposes
        raise Exception("No API key - using mock response")
    
    try:
        # Use the newer API structure (compatible with 0.8.0+)
        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        response = model.generate_content(
            prompt,
            generation_config={
                'temperature': 0.7,
                'max_output_tokens': 2048,
            }
        )
        return response.text
    except Exception as e:
        print(f"Gemini API error: {e}")
        raise