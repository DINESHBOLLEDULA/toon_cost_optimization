import React from 'react';

function FormatSection({ selectedFormat, onFormatChange, datasetPreview, datasetInfo, loadingDataset, darkMode }) {
  const isJson = selectedFormat === 'json';
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        

        <div className={`inline-flex rounded-full p-1 ${
          darkMode ? 'bg-slate-800' : 'bg-slate-100'
        }`}>
          <button
            onClick={() => onFormatChange('json')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              isJson
                ? 'bg-blue-500 text-white shadow-md'
                : darkMode 
                ? 'text-slate-400 hover:text-slate-200' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => onFormatChange('toon')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              !isJson
                ? 'bg-emerald-500 text-white shadow-md'
                : darkMode 
                ? 'text-slate-400 hover:text-slate-200' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TOON
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Data Preview Card */}
        <div className={`rounded-2xl p-6 shadow-md relative ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        } ${isJson ? 'border-2 border-blue-200' : 'border-2 border-emerald-200'}`}>
          <div className="flex items-start justify-between mb-4">
            <h3 className={`text-sm font-semibold ${
              isJson ? 'text-blue-600' : 'text-emerald-600'
            }`}>
              {isJson ? 'JSON Format' : 'TOON Format'}
            </h3>
            
            <div className={`text-xs space-y-1 text-right ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <div>
                <span className="font-medium">Tokens:</span>{' '}
                <span className={isJson ? 'text-blue-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {datasetPreview.tokens.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Cost:</span>{' '}
                <span className={isJson ? 'text-blue-600 font-bold' : 'text-emerald-600 font-bold'}>
                  ${datasetPreview.cost.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          <div className={`relative rounded-xl overflow-hidden ${
            darkMode ? 'bg-slate-900' : 'bg-slate-50'
          }`}>
            {loadingDataset ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <pre className={`p-4 text-xs overflow-auto max-h-96 font-mono ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {datasetPreview.dataText.substring(0, 2000)}
                {datasetPreview.dataText.length > 2000 && '\n... (truncated)'}
              </pre>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default FormatSection;