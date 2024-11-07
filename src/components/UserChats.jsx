import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import CreateChat from './CreateChat';
import ChatPreview from './ChatPreview';
import ChatWindow from './ChatWindow';

import './UserChats.css'

export default function UserChats({ updateUser, chats, isUser=false, loggedInUserId }) {

    const [chatId, setChatId] = useState(null);
    const [isHover, setIsHover] = useState(false);

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
                <header className="user-profile-chats-header">Chats</header>
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
                                <ChatPreview 
                                    key={chat.id} 
                                    chat={chat} 
                                    onClickChatId={setChatId} 
                                    updateUser={updateUser}
                                />
                            )
                        })
                    )
                ) : (
                    chats.length > 0 && (
                        chats.map((chat) => {
                            let resultArray = chat.users.filter((user) => user.id === loggedInUserId);
                            if (resultArray.length > 0) {
                                return (
                                    <ChatPreview 
                                        key={chat.id} 
                                        chat={chat} 
                                        onClickChatId={setChatId}
                                        updateUser={updateUser}
                                    />
                                )
                            }
                        })
                    )
                )}
            </div>
            {chatId && (
            <ChatWindow 
                key={chatId}
                chatId={chatId}
                isUser={isUser}
                loggedInUserId={loggedInUserId}
                updateUser={updateUser}
            />
            )}
        </div>
    )
} 

UserChats.propTypes = {
    updateUser: PropTypes.func.isRequired,
    chats: PropTypes.array,
    isUser: PropTypes.bool,
    loggedInUserId: PropTypes.string,
};