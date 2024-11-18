import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import ChatUsernames from './ChatUsernames';

import './ChatWindowHeader.css'

export default function ChatWindowHeader({ chat, updateUser, setChat }) {
    
    const [isActiveEdit, setIsActiveEdit] = useState(false);

    const token = localStorage.token;
    const decoded = jwtDecode(token);
    const user = decoded.user; 
      
    async function updateUserChat(event) {
        event.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/chats/${chat.id}`
        
        const newChatName = event.target.chatName.value

        const body = {
            name:  newChatName,
        };
    
        const bodyString = JSON.stringify(body);
    
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            body: bodyString,
            method: "PUT",
            headers: headers,
        }

        try {
            const response = await fetch(requestURL, requestOptions);
            const chat = await response.json();
            setChat(chat);
            updateUser(true);
            setIsActiveEdit(false);
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    return (
        <div className="chat-window-header" onClick={() => setIsActiveEdit(true)}>
            {isActiveEdit ? (
            <form className="new-chat-name-form" id="form" onSubmit={(event) => updateUserChat(event) }>
                <input 
                    id="chatName"
                    className="default-input-format"
                    placeholder="Enter chat name here..."
                    defaultValue={chat.name}
                    autoFocus
                />
            </form>
            ) : (
                <ChatUsernames chat={chat}/>
            )}
        </div>
    )
}

ChatWindowHeader.propTypes = {
    chat: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    setChat: PropTypes.func.isRequired,
};