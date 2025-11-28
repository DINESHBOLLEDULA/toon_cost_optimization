import React from 'react';

function ResultsGrid({ results, darkMode }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Comparison Results
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {results.map((result, idx) => {
          const isJson = result.outputFormat === 'json';
          
          return (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg overflow-hidden ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              } ${isJson ? 'border-2 border-blue-300' : 'border-2 border-emerald-300'}`}
            >
              {/* Header */}
              <div className={`p-4 ${
                isJson 
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100' 
                  : 'bg-gradient-to-r from-emerald-50 to-emerald-100'
              }`}>
                <h3 className={`font-bold text-lg mb-2 ${
                  isJson ? 'text-blue-900' : 'text-emerald-900'
                }`}>
                  {result.label}
                </h3>
                <div className={`text-xs space-x-3 ${
                  isJson ? 'text-blue-700' : 'text-emerald-700'
                }`}>
                  <span>Input: <strong>{result.inputTokens.toLocaleString()}</strong> tokens</span>
                  <span>•</span>
                  <span>Output: <strong>{result.outputTokens.toLocaleString()}</strong> tokens</span>
                  <span>•</span>
                  <span>Total: <strong>${result.totalCost.toFixed(6)}</strong></span>
                </div>
                <div className={`text-xs mt-1 italic ${
                  isJson ? 'text-blue-600' : 'text-emerald-600'
                }`}>
                  * Input tokens = data + query only (excludes system instructions)
                </div>
              </div>

              {/* Response Content */}
              <div className={`p-4 ${
                darkMode ? 'bg-slate-900' : 'bg-slate-50'
              }`}>
                <pre className={`text-xs font-mono overflow-auto max-h-96 p-4 rounded-lg ${
                  darkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700'
                }`}>
                  {result.responseText}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className={`p-4 border-t flex gap-2 ${
                darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'
              }`}>
                
                <button
                  onClick={() => copyToClipboard(result.responseText)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isJson
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  Copy Response
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultsGrid;