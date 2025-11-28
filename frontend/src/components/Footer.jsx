import React, { useState, useEffect } from 'react';

function Footer({ darkMode }) {
  const [comparisonCount, setComparisonCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const count = parseInt(localStorage.getItem('comparisonCount') || '0');
      setComparisonCount(count);
    };

    updateCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCount);
    
    // Also update on interval to catch same-tab changes
    const interval = setInterval(updateCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`mt-12 p-6 rounded-2xl ${
      darkMode ? 'bg-slate-800' : 'bg-white'
    } shadow-sm`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Powered by <strong>Gemini 2.5 Flash Lite</strong>
            </span>
          </div>

          <div className={`px-4 py-2 rounded-full text-xs ${
            darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            API latency: ~1.2s
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          darkMode ? 'bg-slate-700' : 'bg-blue-50'
        }`}>
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Comparisons run: <strong>{comparisonCount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Footer;