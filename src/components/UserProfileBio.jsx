import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './IconImage';
import EditIcon from '../assets/edit.png'
import EditButton from './EditButton';

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

    async function updateUserProfileBio(event, username) {
        event.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/users/${username}`

        const token = localStorage.token;
        const decoded = jwtDecode(token);
        
        if (decoded.user.username !== username) {
            return new Error(`Cannot change another user's profile`);
        }

        const body = {
            profile_bio: event.target.bio.value,
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
                {!isActiveEdit && isHover && (
                    <EditButton handleClick={() => changeEditStatus()} width={"28px"}/>
                )}
            </div>
            { !isActiveEdit && (
                <div className='user-profile-bio'>
                    {profile_bio}
                </div>
            )}
            {isUser && isAuthenticated && isActiveEdit && (
                <form className="user-profile-bio-form active-edit" id="form" onSubmit={(event) => updateUserProfileBio(event, username) }>
                    <textarea 
                        id="bio"
                        rows="4"
                        cols="50"
                        placeholder="Enter your bio here..."
                        defaultValue={profile_bio}
                    />
                    <button className="edit-button edit-bio" type="submit">
                        <IconImage className="icon-image" icon={EditIcon} width="28px" />
                    </button>
                    <button className="close-button edit-bio" onClick={() => changeEditStatus()}>
                        X
                    </button>
                </form>
            )}
        </div>
    )
}

UserProfileBio.propTypes = {
    profile_bio: PropTypes.string,
    updateUser: PropTypes.func.isRequired,
    isUser: PropTypes.bool.isRequired,
};