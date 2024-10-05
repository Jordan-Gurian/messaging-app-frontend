import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export default function ChatPreview(props) {

    if (Object.keys(props.chat).length > 0) {
        if (props.chat.name) {
            return (
                <div className='chat-preview-container'>
                    {props.chat.name}
                </div>
            )
        } else {
            return (
                <div className='chat-preview-container'>
                    {props.chat.users.map((user) => {
                        return (
                            <div key={uuidv4()} className='chat-member'>
                                {user.username}
                            </div>
                        )
                    })}
                </div>
            )
        }
    } else {
        return (
            <div className='chat-preview-container'>
                No active chat
            </div>
        )
    }
} 

ChatPreview.propTypes = {
    chat: PropTypes.object
};