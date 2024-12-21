import { useState } from 'react';
import PropTypes from 'prop-types';
import ChatUsernames from './ChatUsernames';
import EditButton from './EditButton';
import ProfileIcon from './../assets/profile-default.png'
import CloseIcon from './CloseIcon';
import FollowBlock from './FollowBlock';
import LeaveIcon from './../assets/leave.png';
import { useLoggedInUser } from '../hooks/useLoggedInUser';

import './ChatWindowHeader.css'

export default function ChatWindowHeader({ chat, updateUser, sendLeaveMessage, deleteChat, setChat }) {
    
    const [isActiveEdit, setIsActiveEdit] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const token = localStorage.token;
    const loggedInUser = useLoggedInUser();

    const modalContent = document.querySelector('.modal-content');
    const rect = modalContent?.getBoundingClientRect();
    let height;

    if (rect) {
        height = rect.height;
    } else {
        height = 'auto';
    }
      
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

    async function leaveChat() {

        // If leaving a chat would mean there are less than 2 users, just delete the chat
        if (chat.users.length <= 2) {
            deleteChat(chat);
            updateUser(true);
        } else {
            const leaveMessageText = `${loggedInUser.username} has left the chat`;
            const isSystemMessage = true;
            await sendLeaveMessage(null, leaveMessageText, isSystemMessage);
                
            const apiUrl = import.meta.env.VITE_API_URL
            const requestURL = `${apiUrl}/chats/${chat.id}`
            
            const body = {
                usersToRemove:  loggedInUser.username,
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
            } catch (error) {
                console.log(error)
                return { error }        
            } 
        }  
    }
    

    return (
        <>
        {modalOpen && (
            <div role="dialog">
                <div className="modal-overlay"></div>
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="close-profile-image"
                                onClick={() => setModalOpen(false)}
                            >
                                <span>Close menu</span>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="users-that-liked-block default-scrollbar" style={{ maxHeight: height }}>
                            <FollowBlock followUsers={chat.users}/>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        
            <div className="chat-window-header" onClick={() => setIsActiveEdit(true)}>
                <div className="see-members-button">
                    <EditButton icon={ProfileIcon} onClick={() => setModalOpen(true)} width="30px" title="View chat members"/>
                </div>
                <div className="chat-name" title="Edit chat name">
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
                <div className="delete-button">
                    <EditButton icon={LeaveIcon} onClick={() => leaveChat()} width="36px" title="Leave Chat"/>
                </div>
            </div>
        </>
    )
}

ChatWindowHeader.propTypes = {
    chat: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    sendLeaveMessage: PropTypes.func.isRequired,
    deleteChat: PropTypes.func.isRequired,
    setChat: PropTypes.func.isRequired,
};