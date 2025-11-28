import React from 'react';

function Header({ darkMode, setDarkMode }) {
  return (
    <div className={`flex items-center justify-between mb-8 p-4 rounded-2xl ${
      darkMode ? 'bg-slate-800' : 'bg-white'
    } shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          TOON vs JSON Demo
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-900'}`}>
            Light
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
              darkMode ? 'bg-slate-700' : 'bg-blue-500'
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${
              darkMode ? 'translate-x-8 bg-slate-900' : 'translate-x-0 bg-white'
            }`}>
              {darkMode ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-100" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute bottom-1.5 right-2 w-0.5 h-0.5 bg-white rounded-full"></div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="absolute top-1.5 right-1 w-1 h-1 bg-slate-200 rounded-full"></div>
                </div>
              )}
            </div>
          </button>
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-400'}`}>
            Dark
          </span>
        </div>
      </div>
    </div>

    
    
  );
}

export default Header;