import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DatasetStrip from './components/DatasetStrip';
import FormatSection from './components/FormatSection';
import QueryBar from './components/QueryBar';
import ResultsGrid from './components/ResultsGrid';
import MetricsSection from './components/MetricsSection';
import Footer from './components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [datasetPreview, setDatasetPreview] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loadingDataset, setLoadingDataset] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  

  useEffect(() => {
    fetchDatasetInfo();
    fetchDatasetFormat('json');
  }, []);

  const fetchDatasetInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dataset-info`);
      const data = await response.json();
      setDatasetInfo(data);
    } catch (err) {
      setError('Failed to load dataset info');
    }
  };

  const fetchDatasetFormat = async (format) => {
    setLoadingDataset(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dataset-format?format=${format}`);
      const data = await response.json();
      setDatasetPreview({
        dataText: data.dataText,
        tokens: data.tokens,
        cost: data.estimatedInputCost
      });
    } catch (err) {
      setError('Failed to load dataset format');
    } finally {
      setLoadingDataset(false);
    }
  };

  const handleFormatChange = (newFormat) => {
    setSelectedFormat(newFormat);
    fetchDatasetFormat(newFormat);
  };

  const handleRunComparison = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoadingCompare(true);
    setError(null);
    setResults(null);
    setComparison(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          selectedFormat
        })
      });

      const data = await response.json();
      setResults(data.results);
      setComparison(data.comparison);

      // Increment comparison counter in localStorage
      const count = parseInt(localStorage.getItem('comparisonCount') || '0');
      localStorage.setItem('comparisonCount', (count + 1).toString());

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);
    } catch (err) {
      setError('Failed to run comparison');
    } finally {
      setLoadingCompare(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        {datasetInfo && (
          <DatasetStrip 
            datasetInfo={datasetInfo} 
            apiBaseUrl={API_BASE_URL}
            darkMode={darkMode}
          />
        )}

        {datasetPreview && (
          <FormatSection
            selectedFormat={selectedFormat}
            onFormatChange={handleFormatChange}
            datasetPreview={datasetPreview}
            datasetInfo={datasetInfo}
            loadingDataset={loadingDataset}
            darkMode={darkMode}
          />
        )}

        <QueryBar
          query={query}
          setQuery={setQuery}
          onRunComparison={handleRunComparison}
          loadingCompare={loadingCompare}
          darkMode={darkMode}
        />

        {error && (
          <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {results && (
          <div id="results-section">
            <ResultsGrid results={results} darkMode={darkMode} />
            {comparison && (
              <MetricsSection 
                results={results} 
                comparison={comparison}
                darkMode={darkMode}
              />
            )}
          </div>
        )}

        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;