import { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import './ChatPreview.css';

export default function ChatPreview({ chat, onClickChatId }) {

    function handleChatClick() {
        onClickChatId(chat.id)
    }
    
    if (Object.keys(chat).length > 0) {
        return (
            <div key={uuidv4()} className='chat-preview' onClick={handleChatClick}>
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
};