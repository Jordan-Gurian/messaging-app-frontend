import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import CreateChat from './CreateChat';
import ChatPreview from './ChatPreview';
import ChatWindow from './ChatWindow';

import './UserChats.css'

export default function UserChats({ updateUser, chats, isUser = false, loggedInUserId, chatsLabel = 'Chats' }) {

    const [chatId, setChatId] = useState(null);
    const [isHover, setIsHover] = useState(false);

    async function deleteChat(chat) {
        const token = localStorage.token;
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/chats/${chat.id}`
    
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            method: "DELETE",
            headers: headers,
        }

        try {
            const response = await fetch(requestURL, requestOptions);
            const responseDetails = await response.json();
            if (responseDetails.error === 'token invalid') {
                localStorage.removeItem("token");
            }
            updateUser(true);
        } catch (error) {
            console.log(error);
            return { error }        
        }  
    }

    const handleMouseEnter = () => {
        setIsHover(true); // Update state on mouse enter
    };

    const handleMouseLeave = () => {
        setIsHover(false); // Update state on mouse leave
    };

    const hasChatWithLoggedInUser = chats.filter((chat) => {
        return chat.users.some((user) => user.id === loggedInUserId) && chat.users.length === 2;
    }).length > 0 || isUser;

    return (
        <div className='chats-container user-profile-chats-container'>
            <div className="user-profile-chats-header-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <header className="profile-page-section-label">{chatsLabel}</header>
                <CreateChat 
                    updateUser={updateUser} 
                    isUser={isUser} 
                    isHover={isHover}
                    hasChatWithLoggedInUser={hasChatWithLoggedInUser}
                />
            </div>
            <div className="chat-preview-container">
                {isUser ? (
                    chats.length > 0 && (
                        chats.map((chat) => {
                            return (
                                <div className="chat-preview-item"key={chat.id}>
                                    <ChatPreview 
                                        chat={chat} 
                                        onClickChatId={setChatId}
                                        updateUser={updateUser}
                                    />
                                    {chatId===chat.id && (
                                    <ChatWindow 
                                        chatId={chat.id}
                                        updateUser={updateUser}
                                        deleteChat={deleteChat}
                                    />
                                    )}
                                </div>
                            )
                        })
                    )
                ) : (
                    chats.length > 0 && (
                        chats.map((chat) => {
                            let resultArray = chat.users.filter((user) => user.id === loggedInUserId);
                            if (resultArray.length > 0) {
                                return (
                                    <div key={chat.id}>
                                        <ChatPreview 
                                            key={chat.id} 
                                            chat={chat} 
                                            onClickChatId={setChatId}
                                            updateUser={updateUser}
                                        />
                                        {chatId===chat.id && (
                                        <ChatWindow 
                                            key={chat.id}
                                            chatId={chat.id}
                                            updateUser={updateUser}
                                            deleteChat={deleteChat}
                                        />
                                        )}
                                    </div>
                                )
                            }
                        })
                    )
                )}
            </div>
        </div>
    )
} 

UserChats.propTypes = {
    updateUser: PropTypes.func.isRequired,
    chats: PropTypes.array,
    isUser: PropTypes.bool,
    loggedInUserId: PropTypes.string,
    chatsLabel: PropTypes.string,
};