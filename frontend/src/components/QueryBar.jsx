import React from 'react';

function QueryBar({ query, setQuery, onRunComparison, loadingCompare, darkMode }) {
  const sampleQueries = [
    'List all the postings in Bengaluru',
  ];

  return (
    <div className="mb-8">
      <div className={`p-6 rounded-2xl shadow-md ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onRunComparison()}
            placeholder="Enter your query... "
            className={`flex-1 px-6 py-3 rounded-full text-sm focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-slate-700 text-white placeholder-slate-400 focus:ring-blue-500' 
                : 'bg-slate-50 text-slate-900 placeholder-slate-500 focus:ring-blue-400'
            }`}
          />
          
          <button
            onClick={onRunComparison}
            disabled={loadingCompare || !query.trim()}
            className={`px-8 py-3 rounded-full font-medium text-white text-sm transition-all ${
              loadingCompare || !query.trim()
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {loadingCompare ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running...
              </span>
            ) : (
              'Run Comparison'
            )}
          </button>
        </div>

        {/* Sample Query Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Try:
          </span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(sq)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                darkMode
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sq}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QueryBar;