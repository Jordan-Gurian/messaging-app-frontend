import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './../hooks/AuthContext'

export default function LikeButton({ post, updateLikes }) {
    
    const [username, setUsername] = useState('');
    const [postIsLiked, setPostIsLiked] = useState(false);
    const token = localStorage.token;
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    async function likePost() { 
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/posts/${post.id}`
        let body;

        if (postIsLiked) {
            body = {
                usersThatLikedToRemove: username,
            };
        } else {
            body = {
                usersThatLikedToAdd: username,
            };
        }
    
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
            const responseDetails = await response.json();
            if (responseDetails.error === 'token invalid') {
                localStorage.removeItem("token");
                navigate('/login', { state: { successMessage: 'You have been logged out' } });
            }
            updateLikes(true);
            setPostIsLiked(!postIsLiked);
        } catch (error) {
            return { error }        
        }  
    }

    useEffect(() => {
        if (isAuthenticated) {
            const decoded = jwtDecode(token);
            const username = decoded.user.username;
            setUsername(username);
        }
    }, [])

    useEffect(() => {
        setPostIsLiked(post.usersThatLiked.some((user) => user.username === username))
    }, [username])

    const buttonText = postIsLiked ? 'Unlike' : 'Like';
    
    return (
        <button className="post like-button submit-button" onClick={likePost}>
            {buttonText}
        </button>
    )
}
 

LikeButton.propTypes = {
    post: PropTypes.object.isRequired,
    updateLikes: PropTypes.func.isRequired,
}