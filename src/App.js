import React, { useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import './App.css';

const App = () => {
  const [userQuestion, setUserQuestion] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [result, setResult] = useState(null);
  const [humanResponse, setHumanResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/ask', {
        userQuestion,
        datasetName
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResult(response.data.rows);
        setHumanResponse(response.data.humanResponse);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = () => {
    if (!result || result.length === 0) return null;

    return (
      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(result[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderPlotlyBarChart = () => {
    if (!result || result.length === 0 || Object.keys(result[0]).length < 2) return null;

    const labels = result.map(row => row[Object.keys(row)[0]]);
    const data = result.map(row => row[Object.keys(row)[1]]);

    return (
      <div>
        <h2>Bar Chart Visualization</h2>
        <Plot
          data={[
            {
              x: labels,
              y: data,
              type: 'bar'
            }
          ]}
          layout={{ title: 'Bar Chart', xaxis: { title: Object.keys(result[0])[0] }, yaxis: { title: Object.keys(result[0])[1] } }}
        />
      </div>
    );
  };

  const renderPlotlyLineChart = () => {
    if (!result || result.length === 0 || Object.keys(result[0]).length < 2) return null;

    const labels = result.map(row => row[Object.keys(row)[0]]);
    const data = result.map(row => row[Object.keys(row)[1]]);

    return (
      <div>
        <h2>Line Chart Visualization</h2>
        <Plot
          data={[
            {
              x: labels,
              y: data,
              type: 'scatter',
              mode: 'lines+markers'
            }
          ]}
          layout={{ title: 'Line Chart', xaxis: { title: Object.keys(result[0])[0] }, yaxis: { title: Object.keys(result[0])[1] } }}
        />
      </div>
    );
  };

  const renderPlotlyPieChart = () => {
    if (!result || result.length === 0 || Object.keys(result[0]).length < 2) return null;

    const labels = result.map(row => row[Object.keys(row)[0]]);
    const data = result.map(row => row[Object.keys(row)[1]]);

    return (
      <div>
        <h2>Pie Chart Visualization</h2>
        <Plot
          data={[
            {
              labels: labels,
              values: data,
              type: 'pie'
            }
          ]}
          layout={{ title: 'Pie Chart' }}
        />
      </div>
    );
  };

  const renderPlotlyScatterPlot = () => {
    if (!result || result.length === 0 || Object.keys(result[0]).length < 2) return null;

    const data = result.map(row => ({ x: row[Object.keys(row)[0]], y: row[Object.keys(row)[1]] }));

    return (
      <div>
        <h2>Scatter Plot Visualization</h2>
        <Plot
          data={[
            {
              x: data.map(d => d.x),
              y: data.map(d => d.y),
              mode: 'markers',
              type: 'scatter'
            }
          ]}
          layout={{ title: 'Scatter Plot', xaxis: { title: Object.keys(result[0])[0] }, yaxis: { title: Object.keys(result[0])[1] } }}
        />
      </div>
    );
  };

  const formatHumanResponse = (response) => {
    return response.split('\n').map((line, index) => {
      if (line.trim().startsWith('- ')) {
        return <li key={index}>{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">
          <h1>Kedet</h1>
        </div>
        <nav className="menu">
          <ul>
            <li>Dashboard</li>
            <li>Ad Campaign</li>
            <li>Clients</li>
            <li>Users</li>
            <li>Config Management</li>
            <li>Spreadsheet Config</li>
            <li>Settings</li>
            <li>Looker Studio Config</li>
            <li>Feedbacks</li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <header>
          <h1>Good afternoon, Aman</h1>
          <p>Here's what you missed:</p>
          <div className="updates">
            <div className="update">
              <h3>September 19th 2023</h3>
              <ul>
                <li>v12.1 update</li>
                <li>Implemented a minimized sidebar.</li>
                <li>Frontend modifications</li>
                <li><a href="#">Read more...</a></li>
              </ul>
            </div>
            <div className="update">
              <h3>September 15th 2023</h3>
              <ul>
                <li>v12.0 update</li>
                <li>Looker Studio is integrated with the Kedet</li>
                <li><a href="#">Read more...</a></li>
              </ul>
            </div>
          </div>
        </header>
        <div className="content">
          <h1>Kedet AI Data Analyst Chatbot</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ask your question about the Skibig3:</label>
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Enter your BigQuery dataset name:</label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
              />
            </div>
            <button type="submit">Get Answer</button>
          </form>
          {isLoading && (
            <div className="loading">
              <p>Processing...</p>
            </div>
          )}
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          {humanResponse && (
            <div className="response">
              <h2>Kedet AI Response:</h2>
              <div>{formatHumanResponse(humanResponse)}</div>
            </div>
          )}
          {result && (
            <div className="results">
              <h2>Data Table:</h2>
              {renderTable()}
              {renderPlotlyBarChart()}
              {renderPlotlyLineChart()}
              {renderPlotlyPieChart()}
              {renderPlotlyScatterPlot()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
