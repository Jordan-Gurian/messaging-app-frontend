import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfileImage from './../../components/UserProfileImage';
import UserProfileBio from './../../components/UserProfileBio';
import UserFollowBlock from './../../components/UserFollowBlock';
import UserChats from './../../components/UserChats';
import FollowButton from './../../components/FollowButton';
import { jwtDecode } from 'jwt-decode';
import { createS3Client, getUserPresignedUrl } from './../../utils/s3Utils';
import { useAuth } from './../../hooks/AuthContext';
import EditUserProfileImage from './EditUserProfileImage'

import './index.css';

export default function UserProfilePage() {

    const [resetUser, setResetUser] = useState(true);

    const { isAuthenticated } = useAuth();
    const { username } = useParams();
    const [user, setUser] = useState({});
    const [presignedUrl, setPresignedUrl] = useState('');
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
            setUser(await response.json());
        } catch (error) {
            return { error }
        } 
    }

    async function getPresignedUrl() {
        try {
            const s3 = createS3Client();
            setPresignedUrl(await getUserPresignedUrl(s3, user.profile_url));
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


    useEffect(() => {
        if (user.profile_url) {
            getPresignedUrl();
        }
    }, [user])

    if (Object.keys(user).length > 0 && presignedUrl) {
        return (
            <main className="profile-page-container">
                <div className="profile-page-left-container">
                    <UserProfileImage 
                        presignedUrl={presignedUrl} 
                        isUser={isUser} 
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
                        chats={user.chats} 
                        isUser={isUser} 
                        userId={decoded.user.id}
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