import { useState } from 'react';
import LoginForm from './LoginForm';
import ErrorMessage from './../../components/ErrorMessage';
import './index.css'

export default function LoginPage() {

    const [currentError, setCurrentError] = useState("");

    return (
        <main className="login-content">
            <LoginForm setCurrentError={setCurrentError}/>
            <ErrorMessage currentError={currentError}/>
        </main>
    )
}