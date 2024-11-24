import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import LikeButton from './LikeButton';

import './Comment.css';

export default function Comment({ commentId, commentAuthor={} }) {

    const [comment, setComment] = useState({});
    const [author, setAuthor] = useState(commentAuthor);
    const [commentUpdate, setCommentUpdate] = useState(true);

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
        const requestURL = `${apiUrl}/users/${authorId}`
    
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
        if (!commentAuthor && comment.authorId) {
            const fetchAuthor = async () => {
                if (!commentAuthor && comment) {
                    const author = await getAuthor(comment.authorId);
                    setAuthor(author);
                }
            }
            fetchAuthor();
        }
    }, [comment])

    return (
        Object.keys(comment).length > 0 && Object.keys(author).length > 0 ? (
            <div key={comment.id} className={user.id === author ? "comment user-comment" : "comment"}>
                <div className="comment-author">
                    {comment.author.username}
                </div>
                <div className="comment-date subtext">
                    {comment.date}
                </div>
                <div className="comment-content">
                    {comment.content}
                </div>
                <LikeButton comment={comment.comment} updateLikes={setCommentUpdate}/>
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
    commentAuthor: PropTypes.string,
};