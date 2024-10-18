import React, { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <LoginPage />
  );
}

export default App;
