import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import ChatPreview from './ChatPreview';

export default function UserChats({ chats }) {

    if (chats.length > 0) {
        return (
            <div className='chats-container user-profile-chats-container'>
                Chats:
                {chats.map((chat) => {
                    return (
                        <ChatPreview key={uuidv4()} chat={chat} />
                    )
                })}
            </div>
        )
    } else {
        return (
            <div className='chats-container user-profile-chats-container'>
                Chats:
                No active chats
            </div>
        )
    }
} 

UserChats.propTypes = {
    chats: PropTypes.array
};