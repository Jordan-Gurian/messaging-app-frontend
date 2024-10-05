import { useState } from 'react';
import { useParams } from 'react-router-dom';
// import LoginForm from './LoginForm';
// import ErrorMessage from './../../components/ErrorMessage';

export default async function UserProfilePage() {

    const { username } = useParams();

    const apiUrl = import.meta.env.VITE_API_URL;
    const requestURL = `${apiUrl}/user/${username}`;
    let responseDetails;

    try {
        const response = await fetch(requestURL);
        responseDetails = await response.json();
    } catch {
        //props.setCurrentError("Login request was not received")
    }       
    
    // probably need to handle null values in each components asopposed to this components
    const { profile_url, profile_bio, following, followedBy, chats } = responseDetails;

    return (
        <main>
            <UserProfileImage profile_url={profile_url} /> // component will probably be used elsewhere
            <UserProfileBio profile_bio={profile_bio}/> // might want this as separate component for editing
            <UserFollowing following={following}/> // maybe let it also be it's own page?
            <UserFollowedBy followedBy={followedBy}/> // maybe let it also be it's own page?
            <UserChats chats={chats}/> // Probably want this to be a snippet of full list of chats?
        </main>
    )
}