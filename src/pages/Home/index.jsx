import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './../../hooks/AuthContext';

export default function HomePage() {

    const { isAuthenticated, checkAuth } = useAuth();
    
    useEffect(() => {
        checkAuth();
    },[])

    if (isAuthenticated) {
        return (
            <main>
                Home screen, but you're logged in!
            </main>
        )
    } else {
        return (
            <main>
                Home screen
            </main>
        )
    }

}