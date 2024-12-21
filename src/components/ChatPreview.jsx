import PropTypes from 'prop-types';
import { useState, useEffect } from 'react'; 
import { v4 as uuidv4 } from 'uuid';
import ChatUsernames from './ChatUsernames';
import EditButton from './EditButton';
import DeleteIcon from './../assets/delete.png'


import './ChatPreview.css';

export default function ChatPreview({ chat, onClickChatId, updateUser }) {

    const [chatIsOpen, setChatIsOpen] = useState(false);

    function handleChatClick() {
        setChatIsOpen(!chatIsOpen);
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

    useEffect(() => {
        if (chatIsOpen) {
            onClickChatId(chat.id);
        } else {
            onClickChatId(null);
        }
    }, [chatIsOpen])

    
    if (Object.keys(chat).length > 0) {
        return (
            <div key={uuidv4()} className='chat-preview'>
                <div className='chat-preview-name' onClick={handleChatClick}> 
                    <ChatUsernames chat={chat}/>
                </div>
                    <EditButton icon={DeleteIcon} onClick={deleteChat} width='18px' hoverToggle={true} title="Delete chat"/>
           </div>
        )
    } else {
        return (
            <div className='chat-preview'>
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