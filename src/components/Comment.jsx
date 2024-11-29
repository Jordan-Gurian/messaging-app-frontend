import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLoggedInUser } from './../hooks/useLoggedInUser';
import CommentContent from './CommentContent';
import CommentBottom from './CommentBottom';
import EditForm from './EditForm';
import EditButton from './EditButton';
import DeleteIcon from './../assets/delete.png';
import { useAuth } from './../hooks/AuthContext';
import './Comment.css';

export default function Comment({ commentId, setUpdateBox }) {

    const [comment, setComment] = useState({});
    const [author, setAuthor] = useState({});
    const [isActiveReply, setIsActiveReply] = useState(false);
    const [commentUpdate, setCommentUpdate] = useState(true);
    const [isActiveEdit, setIsActiveEdit] = useState(false);
    const { isAuthenticated } = useAuth();
    const loggedInUser = useLoggedInUser();

    const replyPlaceholder = 'Reply to comment...';

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

    async function createComment(content) {
        const token = localStorage.token;
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/comments/`;

        try {
            const body = {
                content: content,
                authorId: loggedInUser.id,
                postId: comment.postId,
                parentCommentId: commentId
            };

            const bodyString = JSON.stringify(body);

            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            };

            const requestOptions = {
                body: bodyString,
                method: "POST",
                headers: headers,
            }

            const response = await fetch(requestURL, requestOptions);
            if (response.ok) {
                setIsActiveReply(false);
                setUpdateBox(true);
            } else {
                throw Error("Comment must be between 1 and 250 characters")
            }
        } catch (error) {
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
            await fetch(requestURL, requestOptions);
            setIsActiveEdit(false);
            setCommentUpdate(true);       
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    function changeEditStatus() {
        setIsActiveEdit(!isActiveEdit);
    }

    function changeReplyStatus() {
        setIsActiveReply(!isActiveReply);
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
            <div key={comment.id} className={loggedInUser.id === author.id ? "comment user-comment" : "comment"} style={{ marginLeft: `${comment.level * 16}px` }}>
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
                    changeReplyStatus={changeReplyStatus}
                    deleteComment={deleteComment}
                />
                {isAuthenticated && isActiveReply && (
                <EditForm
                    onSubmit={createComment}
                    placeholder={replyPlaceholder}
                    textAreaStyle={{height: "4em"}}
                >
                    <EditButton type='submit' width='16px'/>
                    <EditButton icon={DeleteIcon} onClick={() => changeReplyStatus()} width='16px'/>
                </EditForm>
            )}
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
    setUpdateBox: PropTypes.func.isRequired,
};