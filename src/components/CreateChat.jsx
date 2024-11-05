import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';

export default function CreateChat({ onFormSubmit, isUser=false, isHover=false }) {

    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

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

        const users = await getUsers([username, event.target.chatUsers.value])
        console.log(users);
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
            const updatedUser = await getUsers([responseDetails.users[0].username]);
            console.log(updatedUser)
            onFormSubmit(updatedUser[0]);
        } catch (error) {
            console.log(error);
            return { error }        
        }  
    }

    return (
        <div >
        {isUser && isHover && isAuthenticated && !isCreatingChat && (
            <form id="form" onSubmit={(event) => {event.preventDefault(); setIsCreatingChat(true)}}>
                <input 
                    id="chatName"
                    placeholder="Enter user to chat with..."
                    hidden
                />
                <button className="search-button" type="submit">
                    <IconImage className="icon-image" icon={EditIcon} width="15px" />
                </button>
            </form> 
        )}
        {isCreatingChat && (
            <form id="form" onSubmit={(event) => createNewChat(event)}>
                <input 
                    id="chatUsers"
                    placeholder="Enter user to chat with..."
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
    onFormSubmit: PropTypes.func.isRequired,
    isUser: PropTypes.bool,
    isHover: PropTypes.bool,
};