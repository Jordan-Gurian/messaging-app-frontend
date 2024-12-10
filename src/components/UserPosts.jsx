import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import EditButton from './EditButton';
import EditForm from './EditForm';
import DeleteIcon from './../assets/delete.png'
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { useAuth } from './../hooks/AuthContext'
import DefaultSpinner from './DefaultSpinner';

import './UserPosts.css';

const Post = lazy(() => import('./Post'));

export default function UserPosts({ posts, postsLabel = 'Posts', updateUser, numPostsPerLoad=5 }) {

    const usernameObj = useParams()
    const username = usernameObj.username;
    const [isHover, setIsHover] = useState(false);
    const [isActiveEdit, setIsActiveEdit] = useState(false);
    const [visiblePosts, setVisiblePosts] = useState(numPostsPerLoad);
    const [isLoading, setIsLoading] = useState(false);
    const loggedInUser = useLoggedInUser();
    const { isAuthenticated } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const loadingKey = useRef(uuidv4());
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    
    const isUser = loggedInUser?.username === username;
    const placeholder = `Tell your followers what's on your mind...`;

    function changeEditStatus() {
        setIsActiveEdit(!isActiveEdit);
        setErrorMessage('');
    }

    const handleMouseEnter = () => setIsHover(true);
    const handleMouseLeave = () => setIsHover(false);

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

    function loadMorePosts() {
        if (visiblePosts < posts.length) {
            setIsLoading(true);
            setTimeout(() => {
                setVisiblePosts((prev) => Math.min(prev + numPostsPerLoad, posts.length)); // Load 10 more posts
                setIsLoading(false);
            }, 500);
        }
    };

    const hideLoader = () => {
        const loader = document.getElementById(loadingKey.current);
        loader?.classList.add("loader--hide");
    };

    const showLoader = () => {
        const loader = document.getElementById(loadingKey.current);
        loader?.classList.remove("loader--hide");
    }
    
    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => {
                hideLoader()
                if (isFirstLoad) setIsFirstLoad(false);
              }, 1000);
        } else {
            showLoader();
        }
      }, [isLoading]);

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
                {posts.slice(0, visiblePosts).map((post) => (
                    <Suspense key={post.id}>
                        <Post 
                            postId={post.id}
                            updateUser={updateUser}
                        />
                    </Suspense>  
                ))}
                {visiblePosts < posts.length ? (
                    <button className='edit-button load-more-button' onClick={loadMorePosts}>
                        Load more posts...
                        {!isFirstLoad && (
                            <div id={loadingKey.current} className="loader">
                                <DefaultSpinner size={10}/>
                            </div>
                        )
                        }
                    </button>
                ) : (
                    <div className='done-loading-msg'>end of post feed</div>
                )}
                {isFirstLoad && (
                    <div id={loadingKey.current} className="loader">
                        <DefaultSpinner/>
                    </div>
                )}
            </div>
        </div>
    )
} 

UserPosts.propTypes = {
    posts: PropTypes.array,
    postsLabel: PropTypes.string,
    updateUser: PropTypes.func.isRequired,
    numPostsPerLoad: PropTypes.number,
};