import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="App">
      <h1>React + Flask App</h1>
      <p>{message || 'Loading...'}</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter some text"
        />
        <button type="submit">Send to Flask</button>
      </form>
      
      {response && (
        <div>
          <h3>Response from Flask:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
