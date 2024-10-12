import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserProfileImage from './../../components/UserProfileImage';
import UserProfileBio from './../../components/UserProfileBio';
import UserFollowing from './../../components/UserFollowing';
import UserFollowedBy from './../../components/UserFollowedBy';
import UserChats from './../../components/UserChats';
import { createS3Client, getUserPresignedUrl } from './../../utils/s3Utils';

export default function UserProfilePage() {

    const { username } = useParams();
    const [user, setUser] = useState({});
    const [presignedUrl, setPresignedUrl] = useState('');

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

    if (Object.keys(user).length > 0 && presignedUrl !== '') {
        return (
            <main>
                <UserProfileImage onFormSubmit={handleFormSubmit} presignedUrl={presignedUrl} />
                <UserProfileBio profile_bio={user.profile_bio} />
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