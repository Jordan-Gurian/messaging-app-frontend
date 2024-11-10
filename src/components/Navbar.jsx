import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import SearchIcon from './../assets/search.png';
import IconImage from './IconImage';
import { useAuth } from './../hooks/AuthContext';
import './Navbar.css';

export default function Navbar() {

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
     
    async function isUserExists(searchVal) {
        const apiUrl = import.meta.env.VITE_API_URL;
        const requestURL = `${apiUrl}/users`;
        try {
            const response = await fetch(requestURL);
            const allUsers = await response.json();
            return await allUsers.some(user => user.username === searchVal)
        } catch (error) {
            return { error }
        } 
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const searchVal = event.target.searchVal.value;
        if (await isUserExists(searchVal)) {
            navigate(`/user/${searchVal}`);
            window.location.reload();
        } else {
            navigate(`/users`);
        }
    };

    let token;
    let decoded;
    let username;

    if (isAuthenticated) {
        token = localStorage.token;
        decoded = jwtDecode(token);
        username = decoded.user.username;
    }
        return (
            <header>
                <nav>
                    <div className="nav-text">MessageXpress</div>
                    <form className="navbar-form" id="form" onSubmit={handleSubmit}>
                        <input 
                            type="text"
                            id="searchVal"
                            className="default-input-format"
                            placeholder="Search for other users..."
                        />
                        <button className="search-button nav-search" type="submit">
                            <IconImage className="icon-image" icon={SearchIcon} width="15px" height="15px"/>
                        </button>
                    </form>
                    { isAuthenticated ? (

                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to={`/user/${username}`} reloadDocument>Profile</Link>
                        <Link to='/' onClick={logout}>Log out</Link>
                    </div>
                    
                    ) : (
                        <div className="nav-links">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    )} 
                </nav>
            </header>
        )
}