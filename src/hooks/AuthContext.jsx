import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            const { exp } = jwtDecode(token)
            const expirationTime = (exp * 1000) - 60000
            console.log(expirationTime)
            if (Date.now() >= expirationTime) {
                setIsAuthenticated(false) 
            } else {
                setIsAuthenticated(true) 
            }
        } else {
            setIsAuthenticated(false)
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
} 


AuthProvider.propTypes = {
    children: PropTypes.array,
}