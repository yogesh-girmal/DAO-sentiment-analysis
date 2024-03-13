import React, { useState, useEffect } from 'react';
import Auth from './components/Auth.tsx'
import axios from 'axios';
import Loading from 'react-loading';  // Optional, for loading indicator

const SentimentAnalysis = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);  // Track analysis status
  const [results, setResults] = useState(null);  // Store results (both full and partial)

  const handleSubmit = async () => {
    setLoading(true);
    setIsAnalyzing(true);  // Indicate analysis start
    setResults(null);  // Clear previous results

    try {
      const response = await axios.post('http://localhost:5000/analyze', { text });
      setResults(response.data);
    } catch (error) {
      console.error(error); // Handle errors gracefully
    } finally {
      setLoading(false);
      setIsAnalyzing(false);  // Indicate analysis completion
    }
  };

  const displayResults = () => {
    if (!results) {
      return null;
    }
    return (
      <div>
        <p>Number of Positive Sentences: {results.num_positive}</p>
        <p>Number of Negative Sentences: {results.num_negative}</p>
        <p>Aggregated Sentiment: {results.aggregated_sentiment}</p>
        {/* You can add additional visualizations here, e.g., charts */}
      </div>
    );
  };

  return (
    <div>
      <Auth/>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
      />
      <button onClick={handleSubmit} disabled={isAnalyzing}>Analyze</button>
      {loading && <Loading type="spinning-bubbles" color="#000" />}
      {isAnalyzing && <p>Analyzing...</p>}
      {displayResults()}
    </div>
  );
};

export default SentimentAnalysis;
