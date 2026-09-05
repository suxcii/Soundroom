import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error contacting server'));
  }, []);

  return (
    <div>
      <h1>Soundroom</h1>
      <p>Backend says: {status}</p>
    </div>
  );
}

export default App;