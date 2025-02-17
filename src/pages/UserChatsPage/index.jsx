import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLoggedInUser } from './../../hooks/useLoggedInUser';
import UserChats from './../../components/UserChats';
import { useAuth } from './../../hooks/AuthContext';

import './index.css';

export default function UserChatsPage() {

    const [resetUser, setResetUser] = useState(true);

    const { isAuthenticated } = useAuth();
    const { username } = useParams();
    const [user, setUser] = useState({});
    const [chats, setChats] = useState({});
    const loggedInUser = useLoggedInUser();

    let isUser;

    if (isAuthenticated && loggedInUser) {
        isUser = loggedInUser.username === username;
    } else {
        isUser = false;
    }
    
    async function getUserData() {
        const apiUrl = import.meta.env.VITE_API_URL;
        const requestURL = `${apiUrl}/users/${username}`;

        try {
            const response = await fetch(requestURL);
            const currentUser = await response.json();
            return currentUser;
        } catch (error) {
            return { error }
        } 
    }
    
    useEffect(() => {
        if (resetUser) {
            const fetchUser = async () => {
                const currentUser = await getUserData();
                setUser(prev => ({ ...prev, ...currentUser }));
                setChats(currentUser.chats);
                setResetUser(false);      
            }
            fetchUser();
        }
    }, [resetUser]);

    if (Object.keys(user).length > 0) {
        return (
            <main className="chats-page-container">
                {isAuthenticated && (
                <UserChats 
                    updateUser={setResetUser} 
                    chats={chats} 
                    isUser={isUser} 
                    loggedInUserId={loggedInUser.id}
                />
                )}
            </main>
        )
    } else {
        return (
            <main className="chats-page-container">
                Loading...
            </main>
        )
    }

}