import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import ChatWindowHeader from './ChatWindowHeader';
import TextInputBox from './TextInputBox';

import './ChatWindow.css';

export default function ChatWindow({ chatId, updateUser }) {
    const [chat, setChat] = useState({ users: [], messages: [] })
    
    // const [text, setText] = useState("");
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
            const chat = await response.json();
            setChat(chat);
        } catch (error) {
            return { error }        
        }  
    }
      
    async function updateUserChat(event, text) {
        event.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/messages`
        
        const body = {
            content:  text,
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
            getChat();
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    useEffect(() => {
        getChat();
    }, []);

    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [chat.messages])

    return (
        <div className="chat-window"> 
            <div className="chat-window-header-container">
                <ChatWindowHeader chat={chat} updateUser={updateUser} setChat={setChat}/>
            </div>
            <div className="message-container" ref={chatContainerRef}>
                {chat.messages.map((message) => {
                    return (
                        <div key={message.id} className={user.id === message.authorId ? "message user-message" : "message"}>
                            <div className="message-content">
                                {message.content}
                            </div>
                            <div className="message subtext">   
                                <div className="message-author">
                                    {message.author.username}
                                </div>
                                <div className="message-date">
                                    {message.date}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <TextInputBox sendText={updateUserChat}/>
            {/* <form className="new-message-form" id="form" ref={formContainerRef} onSubmit={(event) => updateUserChat(event)}>
                <textarea 
                    ref={textareaRef}
                    id="message"
                    className="default-input-format" 
                    rows={rows}
                    cols="30"
                    value={text}
                    onChange={handleChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            updateUserChat(event); // Submit form
                        }
                    }}
                    placeholder="Enter your message here..."
                    style={{
                        overflowY: "hidden",
                        lineHeight: "1.5",
                    }}
                /> */}
                {/* <button className="search-button send-button" type="submit">
                    <IconImage className="icon-image" icon={SendIcon} width="28px" />
                </button>
            </form> */}
        </div>
    )
}

ChatWindow.propTypes = {
    chatId: PropTypes.string,
    updateUser: PropTypes.func.isRequired,
};