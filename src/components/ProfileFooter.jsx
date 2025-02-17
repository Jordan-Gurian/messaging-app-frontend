import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import SearchIcon from './../assets/search.png';
import IconImage from './IconImage';
import { useAuth } from './../hooks/AuthContext';
import './Navbar.css';

export default function ProfileFooter() {

    const { isAuthenticated, checkAuth } = useAuth();
    const [hoveredItem, setHoveredItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    },[])

    const handleMouseEnter = (item) => setHoveredItem(item);
    const handleMouseLeave = () => setHoveredItem(null);
     

    let token;
    let decoded;
    let username;

    if (isAuthenticated) {
        token = localStorage.token;
        decoded = jwtDecode(token);
        username = decoded.user.username;
    }
        return (
            <footer>
                <div className="nav-links">
                    <div
                        className={`nav-links-item ${hoveredItem === 'home' ? 'item-hovered' : ''}`}
                        onMouseEnter={() => handleMouseEnter('home')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link className="link-text" to={`/user/${username}/following`}>Following</Link>
                    </div>
                    <div
                        className={`nav-links-item ${hoveredItem === 'profile' ? 'item-hovered' : ''}`}
                        onMouseEnter={() => handleMouseEnter('profile')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link className="link-text" to={`/user/${username}/followers`} reloadDocument>Followers</Link>
                    </div>
                    <div
                        className={`nav-links-item ${hoveredItem === 'chats' ? 'item-hovered' : ''}`}
                        onMouseEnter={() => handleMouseEnter('chats')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link className="link-text" to={`/user/${username}/chats`} reloadDocument>Chats</Link>
                    </div>
                </div>
            </footer>
        )
}