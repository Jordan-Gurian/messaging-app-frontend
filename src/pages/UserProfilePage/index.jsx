import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfileImage from './../../components/UserProfileImage';
import UserProfileBio from './../../components/UserProfileBio';
import UserFollowBlock from './../../components/UserFollowBlock';
import UserChats from './../../components/UserChats';
import FollowButton from './../../components/FollowButton';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './../../hooks/AuthContext';
import EditUserProfileImage from './EditUserProfileImage'

import './index.css';

export default function UserProfilePage() {

    const [resetUser, setResetUser] = useState(true);

    const { isAuthenticated } = useAuth();
    const { username } = useParams();
    const [user, setUser] = useState({});
    const [chats, setChats] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    
    const token = localStorage.token;
    let decoded;
    let isUser;

    if (isAuthenticated) {
        decoded = jwtDecode(token);
        isUser = decoded.user.username === username;
    } else {
        isUser = false;
    }
    
    const apiUrl = import.meta.env.VITE_API_URL;
    const requestURL = `${apiUrl}/users/${username}`;

    async function getUserData() {
        try {
            const response = await fetch(requestURL);
            const currentUser = await response.json();
            return currentUser;
        } catch (error) {
            return { error }
        } 
    }

    useEffect(() => {
        if (resetUser) {
            getUserData();
            setResetUser(false);          
        }
    }, [resetUser]);

    if (Object.keys(user).length > 0) {
        return (
            <main className="profile-page-container">
                <div className="profile-page-left-container">
                    <UserProfileImage 
                        profileUrl={user.profile_url} 
                        allowEdit={isUser} 
                        modalSetter={setModalOpen} 
                        height="300px" 
                        width="300px"
                    />
                    <div className="user-profile-name-container">
                        {`${username}`}
                    </div>
                    <FollowButton 
                        updateUser={setResetUser} 
                        followedBy={user.followedBy} 
                        isUser={isUser} 
                    />
                    <UserProfileBio 
                        updateUser={setResetUser} 
                        profile_bio={user.profile_bio} 
                        isUser={isUser} 
                    />
                    {isAuthenticated && (
                    <UserChats 
                        updateUser={setResetUser} 
                        chats={chats} 
                        isUser={isUser} 
                        loggedInUserId={decoded.user.id}
                    />
                    )}
                </div>
                <div className="profile-page-right-container">
                    <UserFollowBlock 
                        followLabel='Following'
                        followBlockContent={user.following} 
                    />
                    <UserFollowBlock 
                        followLabel='Followers' 
                        followBlockContent={user.followedBy} 
                    />
                </div>
                {modalOpen && isAuthenticated && (
                    <EditUserProfileImage
                        updateAvatar={setResetUser}
                        closeModal={() => setModalOpen(false)}
                    />
                )}
            </main>
        )
    } else {
        return (
            <main className="profile-page-container">
                Loading...
            </main>
        )
    }

}