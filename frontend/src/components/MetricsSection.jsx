import React from 'react';

function MetricsSection({ results, comparison, darkMode }) {
  const [jsonResult, toonResult] = results;
  
  const minTotalCost = Math.min(jsonResult.totalCost, toonResult.totalCost);
  const costPer1kRuns = (minTotalCost * 1000).toFixed(2);
  const costPer10kRuns = (minTotalCost * 10000).toFixed(2);

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Performance Metrics
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Metrics Table */}
        <div className={`rounded-2xl p-6 shadow-md ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Token & Cost Comparison
            </h3>
            
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                  <th className={`text-left py-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Metric
                  </th>
                  <th className={`text-right py-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    JSON
                  </th>
                  <th className={`text-right py-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    TOON
                  </th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'text-slate-200' : 'text-slate-700'}>
                <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-slate-100'}>
                  <td className="py-2">Input Tokens</td>
                  <td className="text-right font-mono">{jsonResult.inputTokens.toLocaleString()}</td>
                  <td className="text-right font-mono">{toonResult.inputTokens.toLocaleString()}</td>
                </tr>
                <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-slate-100'}>
                  <td className="py-2">Output Tokens</td>
                  <td className="text-right font-mono">{jsonResult.outputTokens.toLocaleString()}</td>
                  <td className="text-right font-mono text-emerald-600 font-bold">
                    {toonResult.outputTokens.toLocaleString()}
                  </td>
                </tr>
                <tr className={darkMode ? 'border-b border-slate-700' : 'border-b border-slate-100'}>
                  <td className="py-2">Total Cost</td>
                  <td className="text-right font-mono">${jsonResult.totalCost.toFixed(6)}</td>
                  <td className="text-right font-mono text-emerald-600 font-bold">
                    ${toonResult.totalCost.toFixed(6)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Savings</td>
                  <td className="text-right">-</td>
                  <td className="text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="text-emerald-600 font-bold">
                        {(comparison.outputTokensSavingsPct * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-emerald-600">
                        tokens
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Scaling */}
        <div className={`rounded-2xl p-6 shadow-md ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <h3 className={`font-semibold mb-4 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            Cost at Scale
          </h3>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-slate-700' : 'bg-blue-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  1,000 API Calls
                </span>
                <span className={`text-lg font-bold ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  ${costPer1kRuns}
                </span>
              </div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Using TOON format (minimum cost path)
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-slate-700' : 'bg-emerald-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  10,000 API Calls
                </span>
                <span className={`text-lg font-bold ${
                  darkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  ${costPer10kRuns}
                </span>
              </div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Potential monthly savings with TOON
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              darkMode 
                ? 'bg-slate-900 border-emerald-500' 
                : 'bg-emerald-50 border-emerald-300'
            }`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {(comparison.totalCostSavingsPct * 100).toFixed(1)}%
                </div>
                <div className={`text-sm font-medium ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Total Cost Savings with TOON
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsSection;