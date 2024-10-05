import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        navigate('/', { state: { successMessage: 'You have successfully logged out' } });
    }

    if (localStorage.token) {
        return (
            <main>
                Home - You are logged in!
                <Link to='/' onClick={logout}>Log out</Link>
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