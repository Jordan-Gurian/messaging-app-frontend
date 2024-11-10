import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './../../hooks/AuthContext';

import './RegisterForm.css'

export default function RegisterForm({ setCurrentError }) {

    const { checkAuth } = useAuth();
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL
    const requestURL = `${apiUrl}/users`

    async function registerUser(event) {

        event.preventDefault();
        
        const body = {
            username: event.target.username.value,
            password: event.target.password.value
        };
    
        const bodyString = JSON.stringify(body);
    
        const headers = {
            "Content-Type": "application/json",
        };
    
        const requestOptions = {
            body: bodyString,
            method: "POST",
            headers: headers,
        }

        try {
            const response = await fetch(requestURL, requestOptions);
            const responseDetails = await response.json();
            if (response.ok) {
                localStorage.setItem("token", responseDetails.token);
                checkAuth();
                navigate('/', { state: { successMessage: 'You have successfully registered and logged in' } });
            } else {
                if (responseDetails.errors) {
                    setCurrentError(responseDetails.errors);
                } else {
                    setCurrentError(responseDetails.message);
                }
            }  
        } catch {
            setCurrentError("Register request was not received")
        }        
    }

    return (
        <form className="register-form" onSubmit={registerUser}>
            <input 
                type='text'
                id='username'
                className="default-input-format"
                name='username'
                placeholder="Username"
            />
            <input 
                type='password'
                id='password'
                className="default-input-format"
                name='password'
                placeholder="Password"
            />
            <button type='submit' className="submit-button register-button">Register</button>
        </form>
    )
}

RegisterForm.propTypes = {
    setCurrentError: PropTypes.func.isRequired
};