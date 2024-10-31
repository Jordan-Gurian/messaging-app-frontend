import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './../../hooks/AuthContext';

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
        <form onSubmit={registerUser}>
            <label htmlFor='username'>Username
                <input 
                    type='text'
                    id='username' 
                    name='username'
                />
            </label>
            <label htmlFor='password'>Password
                <input 
                    type='password'
                    id='password'
                    name='password'
                />
            </label>
            <button type='submit'>Register</button>
        </form>
    )
}

RegisterForm.propTypes = {
    setCurrentError: PropTypes.func.isRequired
};