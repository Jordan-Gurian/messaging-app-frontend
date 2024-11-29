import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import EditForm from './EditForm';
import EditButton from './EditButton';
import DeleteIcon from './../assets/delete.png'

import './UserProfileBio.css';

export default function UserProfileBio({ profile_bio, updateUser, isUser }) {

    const [isActiveEdit, setIsActiveEdit] = useState(false);
    const usernameObj = useParams()
    const username = usernameObj.username;
    const [isHover, setIsHover] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleMouseEnter = () => {
        setIsHover(true); // Update state on mouse enter
    };

    const handleMouseLeave = () => {
        setIsHover(false); // Update state on mouse leave
    };

    function changeEditStatus() {
        setIsActiveEdit(!isActiveEdit);
    }

    async function updateUserProfileBio(newBio) {

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/users/${username}`

        const token = localStorage.token;
        const decoded = jwtDecode(token);
        
        if (decoded.user.username !== username) {
            return new Error(`Cannot change another user's profile`);
        }

        const body = {
            profile_bio: newBio,
        };
    
        const bodyString = JSON.stringify(body);
    
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            body: bodyString,
            method: "PUT",
            headers: headers,
        }

        try {
            const response = await fetch(requestURL, requestOptions);
            const user = await response.json();
            updateUser(true)
            setIsActiveEdit(false);
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    return (
        <div className='user-profile-bio-container'>
            <div className="user-profile-bio-header-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <header className="profile-page-section-label">About Me</header>
                {!isActiveEdit && isHover && isUser && isAuthenticated && (
                    <EditButton onClick={() => changeEditStatus()} width={"28px"}/>
                )}
            </div>
            { !isActiveEdit && (
                <div className='user-profile-bio'>
                    {profile_bio}
                </div>
            )}
            {isUser && isAuthenticated && isActiveEdit && (
                <EditForm
                    onSubmit={updateUserProfileBio}
                    content={profile_bio}
                    placeholder='Enter your bio here...'
                    textAreaStyle={{height: "4em"}}
                >
                    <EditButton type='submit' width='28px'/>
                    <EditButton icon={DeleteIcon} onClick={() => changeEditStatus()} width='28px'/>
                </EditForm>
            )}
        </div>
    )
}

UserProfileBio.propTypes = {
    profile_bio: PropTypes.string,
    updateUser: PropTypes.func.isRequired,
    isUser: PropTypes.bool.isRequired,
};