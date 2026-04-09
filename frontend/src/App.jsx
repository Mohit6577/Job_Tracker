import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isRegister, setIsRegister] = useState(false);

  if (token) return <Dashboard setToken={setToken} />;

  return isRegister ? (
    <>
      <Register />
      <p onClick={() => setIsRegister(false)}>Already have account? Login</p>
    </>
  ) : (
    <>
      <Login setToken={setToken} />
      <p onClick={() => setIsRegister(true)}>No account?Register</p>
    </>
  );
}

export default App;
