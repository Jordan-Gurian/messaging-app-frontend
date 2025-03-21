import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import ChatWindowHeader from './ChatWindowHeader';
import TextInputBox from './TextInputBox';
import Message from './Message';

import './ChatWindow.css';

export default function ChatWindow({ chatId=null, updateUser, deleteChat }) {
    const [chat, setChat] = useState({ users: [], messages: [] })
    
    const chatContainerRef = useRef(null);

    const token = localStorage.token;
    const decoded = jwtDecode(token);
    const user = decoded.user; 

    async function getChat() {
        const apiUrl = import.meta.env.VITE_API_URL;
        const requestURL = `${apiUrl}/chats/${chatId}`;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        try {
            const response = await fetch(requestURL, requestOptions);
            if (chatId !== null) {
                const chat = await response.json();
                setChat(chat);
            }
        } catch (error) {
            return { error }        
        }  
    }
      
    async function sendMessageToChat(event, text, isSystemMessage=false) {
        if (event) event.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/messages`
        
        const body = {
            content:  text,
            authorId: user.id,
            chatId:   chatId,
            isSystemMessage: isSystemMessage,
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
            await fetch(requestURL, requestOptions);
            getChat();
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    useEffect(() => {
        getChat();
    }, [chatId]);

    useEffect(() => {
        if (chatId !== null) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat.messages])

    if (chatId == null) {
        return (
            <div>No chats open</div>
        )
    } else {
    return (
        <div className="chat-window"> 
            <div className="chat-window-header-container">
                <ChatWindowHeader chat={chat} updateUser={updateUser} sendLeaveMessage={sendMessageToChat} deleteChat={deleteChat} setChat={setChat}/>
            </div>
            <div className="message-container default-scrollbar" ref={chatContainerRef}>
                {chat.messages.map((message) => {
                    return (
                        <Message key={message.id} message={message} userId={user.id}/>
                    )
                })}
            </div>
            <TextInputBox sendText={sendMessageToChat}/>
        </div>
        )
    }
}

ChatWindow.propTypes = {
    chatId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf([null])
    ]),
    updateUser: PropTypes.func.isRequired,
    deleteChat: PropTypes.func.isRequired,
};