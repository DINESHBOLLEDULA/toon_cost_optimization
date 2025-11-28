import React from 'react';

function DatasetStrip({ datasetInfo, apiBaseUrl, darkMode }) {
  return (
    <div className={`mb-6 p-4 rounded-2xl ${
      darkMode ? 'bg-slate-800' : 'bg-white'
    } shadow-sm`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
          Sample Dataset
        </span>

        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
        }`}>
          {datasetInfo.filename} 
        </span>

        

        <a
          href={`${apiBaseUrl}/download`}
          className="ml-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors"
        >
          Download 
        </a>

        <a
          href={`${apiBaseUrl}/api/table-preview`}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Preview 
        </a>
      </div>
    </div>
  );
}

export default DatasetStrip;