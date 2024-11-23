import PropTypes from 'prop-types';

import './Message.css';

export default function Message({ message, userId }) {

    return (
        <div key={message.id} className={userId === message.authorId ? "message user-message" : "message"}>
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
}

Message.propTypes = {
    message: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
};