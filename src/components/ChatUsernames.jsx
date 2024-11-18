import PropTypes from 'prop-types';

export default function ChatUsernames({ chat }) {

    const emptyStr = '';
    let chatName;

    function usernameConcat(accumulator, currentValue) {
        const CHARACTER_LIMIT = 35;
        const ELLIPSES = '...';
        const CSV = ', ';
        const BUFFER = 1; // need 1 char buffer to prevent charsAllowed from potentially reading negative values

        if (accumulator.slice(-3) === ELLIPSES) {
            return accumulator
        } else if (accumulator.length + CSV.length + ELLIPSES.length + BUFFER + currentValue.username.length >= CHARACTER_LIMIT) {
            const charsAllowed = CHARACTER_LIMIT - accumulator.length - CSV.length - ELLIPSES.length;
            return accumulator + CSV + currentValue.username.slice(0, charsAllowed) + ELLIPSES
        } else if (accumulator.length > 0) {
            return accumulator + CSV + currentValue.username 
        } else {
            return accumulator + currentValue.username
        }
    }

    if (chat.name) {
        chatName = chat.name;
    } else {
        chatName = chat.users.reduce(usernameConcat,  
            emptyStr,
        );
    }
     

    return (
        <div className="chat-usernames">
            {chatName}
        </div>
    )
}

ChatUsernames.propTypes = {
    chat: PropTypes.object.isRequired,
};