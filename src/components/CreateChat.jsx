import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './../hooks/AuthContext'
import UserToAdd from './UserToAdd';
import EditButton from './EditButton';
import DeleteIcon from './../assets/delete.png'

import './CreateChat.css';

export default function CreateChat({ updateUser, isUser=false, isHover=false, hasChatWithLoggedInUser=true}) {

    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [usernameInputVal, setUsernameInputVal] = useState("");
    const [usersToAdd, setUsersToAdd] = useState([]);
    const [currentError, setCurrentError] = useState("")
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const pageUserName = useParams();

    const token = localStorage.token;
    const decoded = jwtDecode(token);
    const loggedInUsername = decoded.user.username;

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
            users: usersToAdd,
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
            if (usersToAdd.length < 2) {
                throw new Error("Must add users to create a chat")
            }
            const response = await fetch(requestURL, requestOptions);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            setUsersToAdd([usersToAdd[0]]); // reset to just include loggedInUser
            setIsCreatingChat(false);
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
        if (usernameInputVal) {
            try {
                const user = await getUser(usernameInputVal);
                if (usersToAdd.filter((chatUser) => user.username === chatUser.username).length > 0) {
                    throw new Error("Cannot add a user more than once");
                }
    
                if (user.error) {
                    throw new Error(user.error.message)
                }
    
                setUsersToAdd((usersToAdd) => [...usersToAdd, user]);
                setUsernameInputVal("");
            } catch (error) {
                console.log("Error fetching users:", error.message);
                setCurrentError(error.message);
            }
        } else {
            setCurrentError("Must input a username");
        }
    }

    function handleInputChange(event) {
        setUsernameInputVal(event.target.value);
        setCurrentError("");
    }

    useEffect(() => {
        
        let usernames;

        if (loggedInUsername === pageUserName.username) {
            usernames = [loggedInUsername]
        } else {
            usernames = [loggedInUsername, pageUserName.username]
        }

        const fetchUsers = async () => {
            try {
                const users = await Promise.all(usernames.map((username) => getUser(username)));
                setUsersToAdd([...users]);
            } catch (error) {
                console.log("Error fetching users:", error.message);
                setCurrentError(error.message);
            }
        };
    
        fetchUsers();
    }, [])

    return (
        <div className="create-chat-container" style={isCreatingChat ? {paddingLeft: "30px"} : {}}>
        {!isUser && isAuthenticated && !isCreatingChat && !hasChatWithLoggedInUser && (
            <button className="other-user-chat submit-button " type="submit" onClick={(event) => createNewChat(event)}>
                Create Chat
            </button>
        )}
        {isUser && isHover && isAuthenticated && !isCreatingChat && (
            <EditButton onClick={() => setIsCreatingChat(true)} width={"28px"} title="Create chat"/>
        )}
        {isCreatingChat && (
            <form className="create-chat-form" id="form" onSubmit={(event) => createNewChat(event)}>
                <input 
                    id="chatUsers"
                    onChange={handleInputChange}
                    placeholder="Enter username here..."
                    value={usernameInputVal}
                />
                {currentError && <span className="error-text">{currentError}</span>}
                <div className="create-chat-form-button-container">
                    <button className="submit-button" type="button" onClick={handleAddUser}>
                        Add User
                    </button>
                    <button className="submit-button" type="submit">
                        Create Chat
                    </button>
                    <EditButton icon={DeleteIcon} onClick={() => { setUsersToAdd([usersToAdd[0]]); setIsCreatingChat(false)}} width='28px' title="Exit"/>
                </div>
            </form> 
        )}
        {isUser && (
            <div className="users-to-add">
                {usersToAdd.map((user) => {
                    return (user.username !== loggedInUsername && 
                        <UserToAdd 
                            key={user.id} 
                            username={user.username} 
                            usersToAdd={usersToAdd}
                            setUsersToAdd={setUsersToAdd}/>
                    )
                })}
            </div>
        )}
        </div>
    )
} 

CreateChat.propTypes = {
    updateUser: PropTypes.func.isRequired,
    isUser: PropTypes.bool,
    isHover: PropTypes.bool,
    hasChatWithLoggedInUser: PropTypes.bool,
};