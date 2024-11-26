import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import LikeButton from './LikeButton';
import { useLoggedInUser } from './../hooks/useLoggedInUser';
import PostMetrics from './PostMetrics';

import './Comment.css';

export default function Comment({ commentId }) {

    const [comment, setComment] = useState({});
    const [author, setAuthor] = useState({});
    const [commentUpdate, setCommentUpdate] = useState(true);
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
                    <span className="comment-content">
                        {comment.content}
                    </span>
                </div>
                <div className="comment-bottom">
                    <LikeButton objToLike={comment} updateLikes={setCommentUpdate}/>
                    <PostMetrics
                        likes={comment.usersThatLiked.length}
                        comments={comment.comments.length}
                    />
                    <div className="comment-date subtext">
                        {comment.date}
                    </div>
                </div>
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