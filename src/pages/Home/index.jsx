import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './../../hooks/AuthContext';

export default function HomePage() {

    const { isAuthenticated, checkAuth } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        checkAuth();
    },[])


    function logout() {
        localStorage.removeItem("token");
        checkAuth();
        navigate('/', { state: { successMessage: 'You have successfully logged out' } });
    }

    if (isAuthenticated) {
        const token = localStorage.token;
        const decoded = jwtDecode(token);
        const username = decoded.user.username;
        return (
            <main>
                Home - You are logged in!
                <Link to='/' onClick={logout}>Log out</Link>
                <Link to={`/user/${username}`}>Profile</Link>
            </main>
        )
    } else {
        return (
            <main>
                Home
                <Link to='/login'>Log in</Link>
                <Link to='/register'>Register</Link>
            </main>
        )
    }

}