import PropTypes from 'prop-types';

import './Message.css';

export default function Message({ message, userId }) {

    function getClassNames(message) {
        let classNames;
        if (message.isSystemMessage) {
            classNames = "message system-message";
        } else if (userId === message.authorId) {
            classNames = "message user-message"; 
        } else {
            classNames = "message"
        }
        return classNames
    }
    
    const messageClassNames = getClassNames(message);

    return (
        <div key={message.id} className={messageClassNames}>
            <div className="message-content">
                {message.content}
            </div>
            {!message.isSystemMessage && (
                <div className="message subtext">   
                    <div className="message-author">
                        {message.author.username}
                    </div>
                    <div className="message-date">
                        {message.date}
                    </div>
                </div>
            )}
        </div>
    )
}

Message.propTypes = {
    message: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
};