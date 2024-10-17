import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>React with TypeScript</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
