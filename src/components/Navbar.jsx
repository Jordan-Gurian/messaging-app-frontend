import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import SearchIcon from './../assets/search.png';
import IconImage from './IconImage';
import { useAuth } from './../hooks/AuthContext';
import './Navbar.css';

export default function Navbar() {

    const { isAuthenticated, checkAuth } = useAuth();
    const [hoveredItem, setHoveredItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    },[])

    const handleMouseEnter = (item) => setHoveredItem(item);
    const handleMouseLeave = () => setHoveredItem(null);

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
                    <div
                        className={`nav-links-item ${hoveredItem === 'messageXpress' ? 'item-hovered' : ''}`}
                        onMouseEnter={() => handleMouseEnter('messageXpress')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link className="link-text" to="/">MessageXpress</Link>
                    </div>
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
                        <div
                            className={`nav-links-item ${hoveredItem === 'home' ? 'item-hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter('home')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link className="link-text" to="/">Home</Link>
                        </div>
                        <div
                            className={`nav-links-item ${hoveredItem === 'profile' ? 'item-hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter('profile')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link className="link-text" to={`/user/${username}`} reloadDocument>Profile</Link>
                        </div>
                        <div
                            className={`nav-links-item ${hoveredItem === 'logout' ? 'item-hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter('logout')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link className="link-text" to="/" onClick={logout}>Logout</Link>
                        </div>
                    </div>
                    
                    ) : (
                        <div className="nav-links">
                            <div
                                className={`nav-links-item ${hoveredItem === 'login' ? 'item-hovered' : ''}`}
                                onMouseEnter={() => handleMouseEnter('login')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link className="link-text" to="/login">Login</Link>
                            </div>
                            <div
                                className={`nav-links-item ${hoveredItem === 'register' ? 'item-hovered' : ''}`}
                                onMouseEnter={() => handleMouseEnter('register')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link className="link-text" to="/register">Register</Link>
                            </div>
                        </div>
                    )} 
                </nav>
            </header>
        )
}