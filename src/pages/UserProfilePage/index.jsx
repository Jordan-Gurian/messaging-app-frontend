import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLoggedInUser } from './../../hooks/useLoggedInUser';
import UserProfileImage from './../../components/UserProfileImage';
import UserProfileBio from './../../components/UserProfileBio';
import UserFollowBlock from './../../components/UserFollowBlock';
import UserPosts from './../../components/UserPosts';
import UserChats from './../../components/UserChats';
import FollowButton from './../../components/FollowButton';
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
    const loggedInUser = useLoggedInUser();

    let isUser;

    if (isAuthenticated) {
        isUser = loggedInUser.username === username;
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
            const fetchUser = async () => {
                const currentUser = await getUserData();
                setUser(currentUser);
                setChats(currentUser.chats);
                setResetUser(false);      
            }
            fetchUser();
                
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
                    <div className="user-profile-name-container profile-page-section-label">
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
                    <UserPosts
                        posts={user.posts}
                        postsLabel={'Posts'}
                    
                    />
                    
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
                    {isAuthenticated && (
                    <UserChats 
                        updateUser={setResetUser} 
                        chats={chats} 
                        isUser={isUser} 
                        loggedInUserId={loggedInUser.id}
                    />
                    )}
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