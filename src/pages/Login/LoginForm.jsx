import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './../../hooks/AuthContext';

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
        <form onSubmit={useLogin}>
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
            <button type='submit'>Log In</button>
        </form>
    )
}

LoginForm.propTypes = {
    setCurrentError: PropTypes.func.isRequired
};