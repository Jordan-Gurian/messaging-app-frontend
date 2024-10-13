import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserProfileImage from './../../components/UserProfileImage';
import UserProfileBio from './../../components/UserProfileBio';
import UserFollowing from './../../components/UserFollowing';
import UserFollowedBy from './../../components/UserFollowedBy';
import UserChats from './../../components/UserChats';
import FollowButton from './../../components/FollowButton';
import { jwtDecode } from 'jwt-decode';
import { createS3Client, getUserPresignedUrl } from './../../utils/s3Utils';

export default function UserProfilePage() {

    const { username } = useParams();
    const [user, setUser] = useState({});
    const [presignedUrl, setPresignedUrl] = useState('');

    const token = localStorage.token;
    const decoded = jwtDecode(token);
    const isUser = decoded.user.username === username;

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

    function handleFormSubmit(newUser) {
        setUser(newUser);
        // This will trigger a rerender
    };
      
    useEffect(() => {
        getUserData();
    }, []);


    useEffect(() => {
        if (user.profile_url) {
            getPresignedUrl();
        }
    }, [user])

    if (Object.keys(user).length > 0 && presignedUrl) {
        return (
            <main>
                <UserProfileImage onFormSubmit={handleFormSubmit} presignedUrl={presignedUrl} isUser={isUser} />
                <FollowButton onClick={handleFormSubmit} followedBy={user.followedBy} isUser={isUser} />
                <UserProfileBio onFormSubmit={handleFormSubmit} profile_bio={user.profile_bio} isUser={isUser} />
                <UserFollowing following={user.following} />
                <UserFollowedBy followedBy={user.followedBy} />
                <UserChats chats={user.chats} />
            </main>
        )
    } else {
        return (
            <main>
                Loading...
            </main>
        )
    }

}