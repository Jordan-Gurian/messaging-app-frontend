import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ChatPreview from './ChatPreview';
import ChatWindow from './ChatWindow';

export default function UserChats({ chats, isUser=false, userId }) {

    const [chatId, setChatId] = useState(null);

    return (
        <div className='chats-container user-profile-chats-container'>
            Chats:
            <div className="chat-preview-container">
                {isUser ? (
                    chats.length > 0 && (
                        chats.map((chat) => {
                            return (
                                <ChatPreview key={chat.id} chat={chat} onClickChatId={setChatId}/>
                            )
                        })
                    )
                ) : (
                    chats.length > 0 && (
                        chats.map((chat) => {
                            let resultArray = chat.users.filter((user) => user.id === userId);
                            if (resultArray.length > 0) {
                                return (
                                    <ChatPreview key={chat.id} chat={chat} onClickChatId={setChatId}/>
                                )
                            }
                        })
                    )
                )}
            </div>
            {chatId && (
            <ChatWindow key={chatId} chatId={chatId} isUser={isUser} userId={userId}/>
            )}
        </div>
    )
} 

UserChats.propTypes = {
    chats: PropTypes.array,
    isUser: PropTypes.bool,
    userId: PropTypes.string,
};