'use client';

import { useState } from 'react';

export function ApiTest() {
  const [testResult, setTestResult] = useState<string>('Not tested');

  const testApi = async () => {
    try {
      setTestResult('Testing...');
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setTestResult(`Success: ${data.length} products found`);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
      <h3 className="font-semibold mb-2">API Direct Test:</h3>
      <button 
        onClick={testApi}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
      >
        Test API
      </button>
      <span>Result: {testResult}</span>
    </div>
  );
}
