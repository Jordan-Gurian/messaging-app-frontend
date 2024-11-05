import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import './ChatPreview.css';

export default function ChatPreview({ chat, onClickChatId, updateUser }) {

    function handleChatClick() {
        onClickChatId(chat.id)
    }

    async function deleteChat() {
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
    
    if (Object.keys(chat).length > 0) {
        return (
            <div key={uuidv4()} 
                className='chat-preview' 
                // onMouseEnter={()=> setHoveredChatId(chat.id)}
            >
                <div className='chat-preview-name' onClick={handleChatClick}> 
                    {chat.name ? (chat.name) : (
                        chat.users.map((user, index) => {
                            if (index !== chat.users.length - 1) {
                                return (
                                    `${user.username}, `
                                )
                            } else {
                                return (
                                    user.username
                                )
                            }
                        })
                    )}
                </div>
                {/* {hoveredChatId===chat.id && ( */}
                <button className="delete-chat-button" onClick={deleteChat}>
                    Delete
                </button>
                {/* )} */}
            </div>
        )
    } else {
        return (
            <div className='chat-preview-container'>
                No active chats
            </div>
        )
    }
} 

ChatPreview.propTypes = {
    chat: PropTypes.object.isRequired,
    onClickChatId: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
};