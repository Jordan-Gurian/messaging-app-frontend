import { useState } from 'react';
import LoginForm from './LoginForm';
import LoginError from './LoginError';

export default function LoginPage() {

    const [currentError, setCurrentError] = useState("");

    return (
        <main>
            <LoginForm setCurrentError={setCurrentError}/>
            <LoginError currentError={currentError}/>
        </main>
    )
}