import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import EditIcon from './../assets/edit.png';

function Navbar() {

    const token = localStorage.token;
    let decoded;
    let username;

    if (token) {
        decoded = jwtDecode(token);
        username = decoded.user.username;
    }
     
    const navigate = useNavigate();

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
            navigate(`./../user/${searchVal}`);
            window.location.reload();
        } else {
            console.log('noooo') // DEBUG This should redirect to a list of all users, but for now this is ok
        }
    };

    if (token) {
        return (
            <header>
                <nav>
                    <div className="nav-text"></div>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to={`/user/${username}`} reloadDocument>Profile</Link>
                    </div>
                    <form id="form" onSubmit={handleSubmit}>
                        <input 
                            type="text"
                            id="searchVal"
                        />
                        <button type="submit">
                            <img 
                                src={EditIcon}
                                height='20px'
                                width='20px'
                                alt="404 not found"
                            />
                        </button>
                    </form>
                </nav>
            </header>
        )
    } else {
        <header>Nothing</header>
    }
    
}

export default Navbar