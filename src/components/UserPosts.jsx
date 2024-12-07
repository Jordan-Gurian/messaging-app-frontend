import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Post from './Post';
import EditButton from './EditButton';
import EditForm from './EditForm';
import DeleteIcon from './../assets/delete.png'
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { useAuth } from './../hooks/AuthContext'
import DefaultSpinner from './DefaultSpinner';

import './UserPosts.css';

export default function UserPosts({ posts, postsLabel = 'Posts', updateUser }) {

    const usernameObj = useParams()
    const username = usernameObj.username;
    const [isHover, setIsHover] = useState(false);
    const [isActiveEdit, setIsActiveEdit] = useState(false);
    const loggedInUser = useLoggedInUser();
    const { isAuthenticated } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const loadingKey = useRef(uuidv4());
    const [postsLoadedCount, setPostsLoadedCount] = useState(0);
    const [isPostsLoaded, setIsPostsLoaded] = useState(false);

    function updatePostsLoadedCount() {
        setPostsLoadedCount((prevCount) => prevCount + 1);
    }

    let isUser;
    const placeholder = `Tell your followers what's on your mind...`;
    
    if (loggedInUser) {
        isUser = loggedInUser.username === username;
    }

    function changeEditStatus() {
        setIsActiveEdit(!isActiveEdit);
        setErrorMessage('');
    }

    const handleMouseEnter = () => {
        setIsHover(true); // Update state on mouse enter
    };

    const handleMouseLeave = () => {
        setIsHover(false); // Update state on mouse leave
    };

    async function createPost(postContent) {

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/posts`

        const token = localStorage.token;
        
        if (loggedInUser && loggedInUser.username !== username) {
            return new Error(`Cannot change another user's profile`);
        }

        const body = {
            content: postContent,
            authorId: loggedInUser.id,
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

        try {
            const response = await fetch(requestURL, requestOptions);
            await response.json();
            if (response.ok) {
                setIsActiveEdit(false);
                updateUser(true);
            } else {
                throw Error("Post must be between 1 and 500 characters")
            }
            
        } catch (error) {
            console.log(error)
            setErrorMessage(error.message);
            return { error }        
        }  
    }

    const hideLoader = () => {
        const loader = document.getElementById(loadingKey.current);
        loader.classList.add("loader--hide");
    };
    
    useEffect(() => {
        if (postsLoadedCount === posts.length) {
            setIsPostsLoaded(true);
        }
    }, [postsLoadedCount, posts.length]);

    useEffect(() => {
        if (isPostsLoaded) {
            setTimeout(() => {
                hideLoader()
              }, 1000);
        }
      }, [isPostsLoaded]);

    return (
        <div className='posts-section-container'>
            <div className="user-posts-header-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <header className='profile-page-section-label'>{postsLabel}</header>
                {!isActiveEdit && isHover && isUser && isAuthenticated && (
                        <EditButton onClick={() => changeEditStatus()} width={"28px"}/>
                )}
            </div>
            {isUser && isAuthenticated && isActiveEdit && (
                <EditForm
                    onSubmit={createPost}
                    placeholder={placeholder}
                    textAreaStyle={{height: "4em"}}
                >
                    <EditButton type='submit' width='28px'/>
                    <EditButton icon={DeleteIcon} onClick={() => changeEditStatus()} width='28px'/>
                </EditForm>
            )}
            
            <div className='posts-content-container'>
                <span className='error-text'>{errorMessage}</span>
                {posts.map((post) => {
                    return (
                        <Post 
                            key={post.id}
                            postId={post.id}
                            updateUser={updateUser}
                            updateLoadCount={updatePostsLoadedCount}
                        />
                    )
                })}
                <div id={loadingKey.current} className="loader">
                    <DefaultSpinner/>
                </div>
            </div>
        </div>
    )
} 

UserPosts.propTypes = {
    posts: PropTypes.array,
    postsLabel: PropTypes.string,
    updateUser: PropTypes.func.isRequired,
};