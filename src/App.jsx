import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './hooks/AuthContext';

import './index.css';

function App() {
  return (
    <AuthProvider>
        <Navbar />
        <Outlet />
    </AuthProvider>
  )
}

export default App