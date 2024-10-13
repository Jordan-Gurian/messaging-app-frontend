import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Navbar() {

    const token = localStorage.token;
    const decoded = jwtDecode(token);
    const username = decoded.user.username;

    return (
        <header>
            <nav>
                <div className="nav-text"></div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to={`/user/${username}`} reloadDocument>Profile</Link>
                </div>
            </nav>
        </header>
    )
}

export default Navbar