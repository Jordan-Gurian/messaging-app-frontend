import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import LikeButton from './LikeButton';
import EditForm from './EditForm';
import EditButton from './EditButton';
import DeleteIcon from './../assets/delete.png';
import ReplyIcon from './../assets/reply.png' 
import PostMetrics from './PostMetrics';
import PostCommentBox from './PostCommentBox';
import { useAuth } from './../hooks/AuthContext';
import { useLoggedInUser } from './../hooks/useLoggedInUser';


import './Post.css'

export default function Post({ postId, updateUser }) {
      
    const [post, setPost] = useState({});
    const [author, setAuthor] = useState({});
    const [isActiveReply, setIsActiveReply] = useState(false);
    const [postUpdate, setPostUpdate] = useState(true);
    const [isActiveEdit, setIsActiveEdit] = useState(false);
    const { isAuthenticated } = useAuth();
    const loggedInUser = useLoggedInUser();

    const replyPlaceholder = 'Reply to post...';

    async function getPost() {
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/posts/${postId}`
    
        try {
            const response = await fetch(requestURL);
            const post = await response.json();
            return post;
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

    async function createComment(content) {
        const token = localStorage.token;
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/comments/`;

        try {
            const body = {
                content: content,
                authorId: loggedInUser.id,
                postId: postId,
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
                setPostUpdate(true);
            } else {
                throw Error("Comment must be between 1 and 250 characters")
            }
        } catch (error) {
            return { error }        
        }  
    }

    async function updatePost(newPostContent) {
        
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/posts/${postId}`
        
        const token = localStorage.token;

        const body = {
            content: newPostContent,
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
            setPostUpdate(true);
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    async function deletePost() {
        
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/posts/${postId}`
        
        const token = localStorage.token;
    
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            method: "DELETE",
            headers: headers,
        }

        try {
            if (loggedInUser.username !== author.username) {
                return new Error(`Cannot change another user's profile`);
            }
            const response = await fetch(requestURL, requestOptions);
            await response.json();
            updateUser(true);
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
        if (postUpdate) {
            const fetchPost = async () => {
                const currentPost = await getPost();
                setPost(currentPost);
            }
            fetchPost();
            setPostUpdate(false);
        }  
    }, [postUpdate])

    useEffect(() => {
        const fetchAuthor = async () => {
            if (post.authorId) {
                const author = await getAuthor(post.authorId);
                setAuthor(author);
            }
        }
        fetchAuthor();
    }, [post])

    return (
        Object.keys(post).length > 0 && Object.keys(author).length > 0 ? (
            <div className='post-container'>
                <PostHeader
                    author={author}
                    post={post}
                    onClickEdit={changeEditStatus}
                    onClickDelete={deletePost}
                    loggedInUser={loggedInUser}
                    isActiveEdit={isActiveEdit}
                />
                <PostContent
                    onEditFormSubmit={updatePost}
                    post={post}
                    closeButtonOnClick={changeEditStatus}
                    isActiveEdit={isActiveEdit}
                />
                <div className="post-bottom">
                    <LikeButton objToLike={post} updateLikes={setPostUpdate}/>
                    <EditButton icon={ReplyIcon} onClick={() => changeReplyStatus()} width='16px'/>
                    <PostMetrics
                        likes={post.usersThatLiked.length}
                        comments={post.comments.length}
                    />
                </div>
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
                
                <PostCommentBox post={post} updateUser={updateUser}/>
            </div>
        ) : (
            <div>
                Loading...
            </div> 
        )
    );

} 

Post.propTypes = {
    postId: PropTypes.string.isRequired,
    updateUser: PropTypes.func.isRequired,
};