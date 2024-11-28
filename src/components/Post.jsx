import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import LikeButton from './LikeButton';
import PostMetrics from './PostMetrics';
import PostCommentBox from './PostCommentBox';
import { useLoggedInUser } from './../hooks/useLoggedInUser';


import './Post.css'

export default function Post({ postId, updateUser }) {
      
    const [post, setPost] = useState({});
    const [author, setAuthor] = useState({});
    const [postUpdate, setPostUpdate] = useState(true);
    const [isActiveEdit, setIsActiveEdit] = useState(false);
    const loggedInUser = useLoggedInUser();

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
                    <PostMetrics
                        likes={post.usersThatLiked.length}
                        comments={post.comments.length}
                    />
                </div>
                
                <PostCommentBox post={post}/>
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