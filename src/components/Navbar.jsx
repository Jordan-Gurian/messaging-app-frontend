import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import EditIcon from './../assets/edit.png';
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

    if (isAuthenticated) {
        const token = localStorage.token;
        const decoded = jwtDecode(token);
        const username = decoded.user.username;
        return (
            <header>
                <nav>
                    <div className="nav-text">MessageXpress</div>
                    <form id="form" onSubmit={handleSubmit}>
                        <input 
                            type="text"
                            id="searchVal"
                        />
                        <button className="search-button" type="submit">
                            <IconImage className="icon-image" icon={EditIcon} width="15px" />
                        </button>
                    </form>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to={`/user/${username}`} reloadDocument>Profile</Link>
                        <Link to='/' onClick={logout}>Log out</Link>
                    </div>
                </nav>
            </header>
        )
    } else {
        return (
        <header>
            <nav>
                <div className="nav-text">MessageXpress</div>
                <form id="form" onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        id="searchVal"
                    />
                    <button className="search-button" type="submit">
                        <IconImage className="icon-image" icon={EditIcon} width="15px" />
                    </button>
                </form>
                <div className="nav-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </nav>
        </header>
        )
    }
}