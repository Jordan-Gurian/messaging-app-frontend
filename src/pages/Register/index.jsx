import { useState } from 'react';
import RegisterForm from './RegisterForm';
import ErrorMessage from './../../components/ErrorMessage';

import './index.css'

export default function RegisterPage() {

    const [currentError, setCurrentError] = useState("");

    return (
        <main className="register-page-container">
            <RegisterForm setCurrentError={setCurrentError}/>
            <ErrorMessage currentError={currentError}/>
        </main>
    )
}