import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';
import { v4 as uuidv4 } from 'uuid';

import './ChatWindow.css';

export default function ChatWindow({ chatId }) {
    // const { username } = useParams();
    // const [user, setUser] = useState({});
    const [messages, setMessages] = useState([])
    const [formWidth, setFormWidth] = useState(0);
    const chatContainerRef = useRef(null);
    const formContainerRef = useRef(null);

    const token = localStorage.token;
    const decoded = jwtDecode(token);
    const user = decoded.user;
    // let decoded;
    // let isUser;

    // if (isAuthenticated) {
    //     decoded = jwtDecode(token);
    //     // isUser = decoded.user.username === username;
    // } else {
    //     // isUser = false;
    // }
    
    

    async function getChatMessages() {
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
            const chat = (await response.json());
            setMessages(chat.messages);
        } catch (error) {
            return { error }        
        }  
    }
      
    async function updateUserChat(event) {
        event.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/messages`
        
        console.log(1)
        const messageContent = event.target.message.value;

        // if (decoded.user.username !== username) {
        //     return new Error(`Cannot change another user's profile`);
        // }

        const body = {
            content:  messageContent,
            authorId: user.id,
            chatId:   chatId,
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
            getChatMessages();
            event.target.message.value = '';
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    useEffect(() => {
        if (formContainerRef.current) {
            setFormWidth(formContainerRef.current.offsetWidth);
        }
        getChatMessages();
    }, []);

    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages])

    return (
        <div className="chat-window"> 
            <div className="message-container" ref={chatContainerRef}>
                {messages.map((message) => {
                    return (
                        <div key={message.id} className={user.id === message.authorId ? "message user-message" : "message"}>
                            <div className="message-content">
                                {message.content}
                            </div>
                            <div className="message-author">
                                {message.author.username}
                            </div>
                            <div className="message-date">
                                {message.date}
                            </div>
                        </div>
                    )
                })}
            </div>
            <form className="new-message-form" id="form" ref={formContainerRef} onSubmit={(event) => updateUserChat(event) }>
                    <textarea 
                        id="message"
                        rows="4"
                        placeholder="Enter your message here..."
                        style = {{width: `${formWidth * 0.95}px`}}
                    />
                    <button className="search-button" type="submit">
                        <IconImage className="icon-image" icon={EditIcon} width="15px" />
                    </button>
                </form>
        </div>
    )
}

ChatWindow.propTypes = {
    chatId: PropTypes.string,
};