import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './../../hooks/AuthContext';
import './LoginForm.css';

export default function LoginForm(props) {

    const { checkAuth } = useAuth();
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL
    const requestURL = `${apiUrl}/login`

    async function useLogin(event) {

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
                navigate('/', { state: { successMessage: 'You have successfully logged in' } });
            } else {
                props.setCurrentError(responseDetails.message)
            }  
        } catch {
            props.setCurrentError("Login request was not received")
        }        
    }

    return (
        <form className="login-form" onSubmit={useLogin}>   
            <div className="form-input-container">
                <input 
                    type='text'
                    id='username' 
                    name='username'
                    aria-label='Username'
                    placeholder='Username'
                />
                <input 
                    type='password'
                    id='password'
                    name='password'
                    aria-label='Password'
                    placeholder='Password'
                />
                <button type='submit'>Log In</button>
            </div>
        </form>
    )
}

LoginForm.propTypes = {
    setCurrentError: PropTypes.func.isRequired
};