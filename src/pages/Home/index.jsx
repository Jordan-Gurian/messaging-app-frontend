import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function HomePage() {

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        navigate('/', { state: { successMessage: 'You have successfully logged out' } });
    }

    function decodeToken() {
        const token = localStorage.token;
        return jwtDecode(token);
    }


    if (localStorage.token) {
        const decoded = decodeToken();
        return (
            <main>
                Home - You are logged in!
                <Link to='/' onClick={logout}>Log out</Link>
                <Link to={`/user/${decoded.user.username}`}>Profile</Link>
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