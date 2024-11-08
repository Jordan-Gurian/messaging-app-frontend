import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';

import './CreateChat.css';

export default function CreateChat({ updateUser, isUser=false, isHover=false, hasChatWithLoggedInUser=true}) {

    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [usernameInputVal, setUsernameInputVal] = useState("");
    const [usersInChat, setUsersInChat] = useState([]);
    const [currentError, setCurrentError] = useState("")
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const pageUserName = useParams();

    const token = localStorage.token;

    async function getUser(username) {
        const apiUrl = import.meta.env.VITE_API_URL;
        const requestURL = `${apiUrl}/users/${username}`;
        try {
            const response = await fetch(requestURL);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            return await response.json()
        } catch (error) {
            console.log(error)
            if (error.message === 'token invalid') {
                localStorage.removeItem("token");
                navigate('/', { state: { successMessage: 'You have been logged out' } });
            }   
            console.log(error.message)
            setCurrentError(error.message);
            return { error };
        }
    }
    

    async function createNewChat(event) {
        event.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/chats`

        const body = {
            users: usersInChat,
        };

        const bodyString = JSON.stringify(body);
    
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            body: bodyString,
            method: "POST",
            headers: headers,
        }
        try {
            const response = await fetch(requestURL, requestOptions);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            setUsersInChat([usersInChat[0]]); // reset to just include loggedInUser
            updateUser(true);
        } catch (error) {
            if (error.message === 'token invalid') {
                localStorage.removeItem("token");
                navigate('/', { state: { successMessage: 'You have been logged out' } });
            }
            console.log(error.message)
            setCurrentError(error.message);
            return { error }        
        }  
    }

    async function handleAddUser() {
        try {
            const user = await getUser(usernameInputVal);
            if (usersInChat.filter((chatUser) => user.username === chatUser.username).length > 0) {
                throw new Error("Cannot add a user more than once");
            }

            if (user.error) {
                throw new Error(user.error.message)
            }

            setUsersInChat((usersInChat) => [...usersInChat, user]);
        } catch (error) {
            console.log("Error fetching users:", error.message);
            setCurrentError(error.message);
        }
        setUsernameInputVal("");

    }

    function handleInputChange(event) {
        setUsernameInputVal(event.target.value);
        setCurrentError("");
    }

    useEffect(() => {
        const decoded = jwtDecode(token);
        const loggedInUsername = decoded.user.username;
        let usernames;

        if (loggedInUsername === pageUserName.username) {
            usernames = [loggedInUsername]
        } else {
            usernames = [loggedInUsername, pageUserName.username]
        }

        const fetchUsers = async () => {
            try {
                const users = await Promise.all(usernames.map((username) => getUser(username)));
                setUsersInChat([...users]);
            } catch (error) {
                console.log("Error fetching users:", error.message);
                setCurrentError(error.message);
            }
        };
    
        fetchUsers();
    }, [])

    return (
        <div className="create-chat-container">
        {!isUser && isAuthenticated && !isCreatingChat && !hasChatWithLoggedInUser && (
            <form className="create-chat-form" id="form" onSubmit={(event) => createNewChat(event)}>
                <button className="create-chat-button" type="submit">
                    Create Chat
                </button>
            </form> 
        )}
        {isUser && isHover && isAuthenticated && !isCreatingChat && (
            <form className="create-chat-form" id="form" onSubmit={(event) => {event.preventDefault(); setIsCreatingChat(true)}}>
                <button className="search-button" type="submit">
                    <IconImage className="icon-image" icon={EditIcon} width="15px" />
                </button>
            </form> 
        )}
        {isCreatingChat && (
            <form className="create-chat-form" id="form" onSubmit={(event) => createNewChat(event)}>
                <input 
                    id="chatUsers"
                    onChange={handleInputChange}
                    value={usernameInputVal}
                />
                {currentError && <p className="error-text">{currentError}</p>}
                <div className="create-chat-form-button-container">
                    <button className="search-button" type="button" onClick={handleAddUser}>
                        Add User
                    </button>
                    <button className="search-button" type="submit">
                        Create Chat
                    </button>
                </div>
            </form> 
        )}
        <div>
            {usersInChat.map((user) => user.username)}
        </div>
        </div>
    )
} 

CreateChat.propTypes = {
    updateUser: PropTypes.func.isRequired,
    isUser: PropTypes.bool,
    isHover: PropTypes.bool,
    hasChatWithLoggedInUser: PropTypes.bool,
};