import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import LikeButton from './LikeButton';
import EditButton from './EditButton';
import DeleteIcon from '../assets/delete.png';
import { useLoggedInUser } from './../hooks/useLoggedInUser';
import CommentContent from './CommentContent';
import CommentBottom from './CommentBottom';
import PostMetrics from './PostMetrics';

import './Comment.css';

export default function Comment({ commentId }) {

    const [comment, setComment] = useState({});
    const [author, setAuthor] = useState({});
    const [commentUpdate, setCommentUpdate] = useState(true);
    const [isActiveEdit, setIsActiveEdit] = useState(false);
    const loggedInUser = useLoggedInUser();

    async function getComment() {
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/comments/${commentId}`
    
        try {
            const response = await fetch(requestURL);
            const comment = await response.json();
            return comment;
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    async function getAuthor(authorId) {
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/users/${authorId}`;
    
        try {
            const response = await fetch(requestURL);
            const author = await response.json();
            return author;
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    async function updateComment(newCommentContent) {
        
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/comments/${commentId}`
        
        const token = localStorage.token;

        const body = {
            content: newCommentContent,
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
            if (loggedInUser.username !== author.username) {
                return new Error(`Cannot change another user's profile`);
            }
            const response = await fetch(requestURL, requestOptions);
            await response.json();
            setIsActiveEdit(false);
            setCommentUpdate(true);
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    async function deleteComment() {
        
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/comments/${commentId}/delete`
        
        const token = localStorage.token;
    
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            method: "PUT",
            headers: headers,
        }

        try {
            if (loggedInUser.username !== author.username) {
                return new Error(`Cannot change another user's profile`);
            }
            const response = await fetch(requestURL, requestOptions);
            await response.json();
            // updateUser(true);
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    function changeEditStatus() {
        setIsActiveEdit(!isActiveEdit);
    }

    useEffect(() => {
        if (commentUpdate) {
            const fetchComment = async () => {
                const currentComment = await getComment();
                setComment(currentComment);
            }
            fetchComment();
            setCommentUpdate(false);
        }  
    }, [commentUpdate])

    useEffect(() => {
        const fetchAuthor = async () => {
            if (comment.authorId) {
                const author = await getAuthor(comment.authorId);
                setAuthor(author);
            }
        }
        fetchAuthor();
    }, [comment])

    return (
        Object.keys(comment).length > 0 && Object.keys(author).length > 0 ? (
            <div key={comment.id} className={loggedInUser.id === author.id ? "comment user-comment" : "comment"}>
                <div className="comment-main-text">
                    <span className="comment-author">
                        {`${author.username} `}
                    </span>
                    <CommentContent 
                        onEditFormSubmit={updateComment}
                        comment={comment}
                        closeButtonOnClick={changeEditStatus}
                        isActiveEdit={isActiveEdit}
                    />
                </div>
                <CommentBottom 
                    comment={comment}
                    isUser={loggedInUser.id === author.id}
                    setCommentUpdate={setCommentUpdate}
                    changeEditStatus={changeEditStatus}
                    deleteComment={deleteComment}
                />
            </div>
        ) : (
            <div>
                Loading...
            </div> 
        )
    )
}

Comment.propTypes = {
    commentId: PropTypes.string.isRequired,
};