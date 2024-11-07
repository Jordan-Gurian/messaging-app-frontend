import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';

import './CreateChat.css';

export default function CreateChat({ updateUser, isUser=false, isHover=false, hasChatWithLoggedInUser=true}) {

    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const pageUserName = useParams();

    const token = localStorage.token;

    async function getUsers(usernames) {
        const apiUrl = import.meta.env.VITE_API_URL;
        const users = await Promise.all(
            usernames.map(async (username) => {
                const requestURL = `${apiUrl}/users/${username}`;
    
                try {
                    const response = await fetch(requestURL);
                    const responseDetails = await response.json();
                    
                    if (responseDetails.error === 'token invalid') {
                        localStorage.removeItem("token");
                        navigate('/', { state: { successMessage: 'You have been logged out' } });
                    }
    
                    return responseDetails;
                } catch (error) {
                    return { error };
                }
            })
        );
    
        return users;
    }
    

    async function createNewChat(event) {
        event.preventDefault();

        const decoded = jwtDecode(token);
        const username = decoded.user.username;
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/chats`

        let users;
        if (event.target.chatUsers) {
            users = await getUsers([username, event.target.chatUsers.value])
        } else {
            users = await getUsers([username, pageUserName.username])
        }
        const body = {
            users: users,
        };
    
        const bodyString = JSON.stringify(body);
    
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            body: bodyString,
            method: "POST",
            headers: headers,
        }

        try {
            const response = await fetch(requestURL, requestOptions);
            const responseDetails = await response.json();
            if (responseDetails.error === 'token invalid') {
                localStorage.removeItem("token");
                navigate('/', { state: { successMessage: 'You have been logged out' } });
            }
            updateUser(true);
        } catch (error) {
            console.log(error);
            return { error }        
        }  
    }

    return (
        <div className="create-chat-container">
        {!isUser && isAuthenticated && !isCreatingChat && !hasChatWithLoggedInUser && (
            <form className="create-chat-form" id="form" onSubmit={(event) => createNewChat(event)}>
                <button className="create-chat-button" type="submit">
                    Create Chat
                </button>
            </form> 
        )}
        {isUser && isHover && isAuthenticated && !isCreatingChat && (
            <form className="create-chat-form" id="form" onSubmit={(event) => {event.preventDefault(); setIsCreatingChat(true)}}>
                <button className="search-button" type="submit">
                    <IconImage className="icon-image" icon={EditIcon} width="15px" />
                </button>
            </form> 
        )}
        {isCreatingChat && (
            <form className="create-chat-form" id="form" onSubmit={(event) => createNewChat(event)}>
                <input 
                    id="chatUsers"
                />
                <button className="search-button" type="submit">
                    <IconImage className="icon-image" icon={EditIcon} width="15px" />
                </button>
            </form> 
        )}
        </div>
    )
} 

CreateChat.propTypes = {
    updateUser: PropTypes.func.isRequired,
    isUser: PropTypes.bool,
    isHover: PropTypes.bool,
    hasChatWithLoggedInUser: PropTypes.bool,
};