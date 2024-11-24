import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import UserProfileImage from './UserProfileImage';
import LikeButton from './LikeButton';
import EditForm from './EditForm';
import EditButton from './EditButton';
import { useLoggedInUser } from './../hooks/useLoggedInUser';


import './Post.css'

export default function Post({ postId, postAuthor = {} }) {
      
    const [post, setPost] = useState({});
    const [author, setAuthor] = useState(postAuthor);
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
        if (!postAuthor && post.authorId) {
            const fetchAuthor = async () => {
                if (!postAuthor && post) {
                    const author = await getAuthor(post.authorId);
                    setAuthor(author);
                }
            }
            fetchAuthor();
        }
    }, [post])

    return (
        Object.keys(post).length > 0 && Object.keys(author).length > 0 ? (
            <div className='post-container'>
                <div className='post-header'>
                    <UserProfileImage
                        profileUrl={author.profile_url}
                        allowEdit={false}
                        presignedUrl={author.profile_url}
                        height='50px'
                        width='50px'
                    />
                    <div className='post-header user-info'>
                        <div className='post top-line'>
                            <div className='post author'>{author.username}</div>
                            {loggedInUser.id === author.id && !isActiveEdit && (
                                <EditButton onClick={() => changeEditStatus()} width='18px'/>
                            )}
                        </div>
                        <div className='post date subtext'>{post.date}</div>
                    </div>
                </div>
                {isActiveEdit ? (
                    <EditForm
                        onSubmit={updatePost}
                        content={post.content}
                        textAreaStyle={{height: "4em"}}
                    >
                        <EditButton type='submit' width='28px'/>
                        <button className="close-button" onClick={() => changeEditStatus()}>
                            X
                        </button>
                    </EditForm>
                ) : (
                    <div className='post content'>{post.content}</div>
                )}
                
                <div className='post metrics subtext'>
                    <div className='post likes'>{post.usersThatLiked.length} Likes</div>
                    <div className='post comments'>{post.comments.length} Comments</div>
                </div>
                <div className='post buttons'>
                    <LikeButton post={post} updateLikes={setPostUpdate}/>
                </div>
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
    postAuthor: PropTypes.object,
};