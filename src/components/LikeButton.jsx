import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoggedInUser } from './../hooks/useLoggedInUser';
import LikeIconDark from './../assets/heart.png';
import LikeIconColor from './../assets/heartColor.png'
import IconImage from './IconImage';

import './LikeButton.css'

export default function LikeButton({ objToLike, updateLikes, title=null }) {
    
    const [isLiked, setIsLiked] = useState(false);
    const token = localStorage.token;
    const loggedInUser = useLoggedInUser();
    const navigate = useNavigate();

    async function likeObjToLike() { 
        const apiUrl = import.meta.env.VITE_API_URL

        let requestIdentifier;
        
        if (objToLike.postId) {
            requestIdentifier = 'comments';
        } else {
            requestIdentifier = 'posts';
        }

        const requestURL = `${apiUrl}/${requestIdentifier}/${objToLike.id}`;

        let body;

        if (isLiked) {
            body = {
                usersThatLikedToRemove: loggedInUser.username,
            };
        } else {
            body = {
                usersThatLikedToAdd: loggedInUser.username,
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
            setIsLiked(!isLiked);
        } catch (error) {
            return { error }        
        }  
    }

    useEffect(() => {
        if (loggedInUser) {
            setIsLiked(objToLike.usersThatLiked.some((user) => user.username === loggedInUser.username))
        }
    }, [loggedInUser])

    const likeIcon = isLiked ? LikeIconColor : LikeIconDark;
    
    return (
        <button className="like-button" onClick={likeObjToLike} title={title}>
            <IconImage icon={likeIcon} height='18px'/>
        </button>
    )
}
 

LikeButton.propTypes = {
    objToLike: PropTypes.object.isRequired,
    updateLikes: PropTypes.func.isRequired,
    title: PropTypes.string,
}