import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './hooks/AuthContext';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import DefaultSpinner from './components/DefaultSpinner';

import './index.css';

function App({ hideLoader }) {

  useEffect(() => {
    setTimeout(() => {
      hideLoader()
    }, 2500);
  }, []);

  return (
    <>
        <AuthProvider>
            <Navbar />
            <Outlet />
        </AuthProvider>
        <div className="loader">
            <DefaultSpinner/>
        </div>
    </>
    

    
  )
}

export default App

App.propTypes = {
  hideLoader: PropTypes.func.isRequired,
};