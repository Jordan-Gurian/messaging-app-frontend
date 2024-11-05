import PropTypes from 'prop-types';

export default function ChatUsernames({ chat }) {

    return (
        <div className="chat-usernames">
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
}

ChatUsernames.propTypes = {
    chat: PropTypes.object.isRequired,
};