import { useState } from 'react';
import LoginForm from './LoginForm';
import ErrorMessage from './../../components/ErrorMessage';

export default function LoginPage() {

    const [currentError, setCurrentError] = useState("");

    return (
        <main>
            <LoginForm setCurrentError={setCurrentError}/>
            <ErrorMessage currentError={currentError}/>
        </main>
    )
}