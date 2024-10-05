import { useState } from 'react';
import RegisterForm from './RegisterForm';
import ErrorMessage from './../../components/ErrorMessage';

export default function RegisterPage() {

    const [currentError, setCurrentError] = useState("");

    return (
        <main>
            <RegisterForm setCurrentError={setCurrentError}/>
            <ErrorMessage currentError={currentError}/>
        </main>
    )
}