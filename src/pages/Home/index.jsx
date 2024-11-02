import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './../../hooks/AuthContext';

import './index.css'

export default function HomePage() {

    const { isAuthenticated, checkAuth } = useAuth();
    
    useEffect(() => {
        checkAuth();
    },[])

    const homePageMessage = isAuthenticated ? `Home screen, but you're logged in!` : `Home screen, but you're not logged in :(`

    return (
        <main className="home-page-container">
            {homePageMessage}
        </main>
    )
}