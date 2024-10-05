import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserProfileImage from './../../components/UserProfileImage';
import UserProfileBio from './../../components/UserProfileBio';
import UserFollowing from './../../components/UserFollowing';
import UserFollowedBy from './../../components/UserFollowedBy';
import UserChats from './../../components/UserChats';

export default function UserProfilePage() {

    const { username } = useParams();
    const [user, setUser] = useState({});

    const apiUrl = import.meta.env.VITE_API_URL;
    const requestURL = `${apiUrl}/users/${username}`;

    async function getUser() {
        try {
            const response = await fetch(requestURL);
            setUser(await response.json());
        } catch {
            //props.setCurrentError("Login request was not received")
        } 
    }
      
    useEffect(() => {
        getUser();
    }, []);

    if (Object.keys(user).length > 0) {
        return (
            <main>
                <UserProfileImage profile_url={`${apiUrl}/${user.profile_url}`} />
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