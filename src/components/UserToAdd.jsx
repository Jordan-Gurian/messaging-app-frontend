import PropTypes from 'prop-types';

import './UserToAdd.css';

export default function UserToAdd({ username, usersToAdd, setUsersToAdd }) {

    function removeUserFromAddList() {
        const usersToKeep = usersToAdd.filter((user) => user.username !== username);
        setUsersToAdd(usersToKeep);
    }

    return (
       <div className="user-to-add-container">
            <div className="user-to-add-username">{username}</div>
            <button className="close-button" onClick={removeUserFromAddList}>X</button>
       </div>
    )
} 

UserToAdd.propTypes = {
    username: PropTypes.string.isRequired,
    usersToAdd: PropTypes.array,
    setUsersToAdd: PropTypes.func.isRequired,
};