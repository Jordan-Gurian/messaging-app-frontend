import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import Comment from './Comment';
import { v4 as uuidv4 } from 'uuid';
import DefaultSpinner from './DefaultSpinner';
import { useLoggedInUser } from '../hooks/useLoggedInUser';

import './PostCommentBox.css'

export default function PostCommentBox({ post, isPost=true, numCommentsPerLoad=2 }) {
    
    const [visibleComments, setVisibleComments] = useState(numCommentsPerLoad);
    const [isLoading, setIsLoading] = useState(false);
    const [commentArray, setCommentArray] = useState([]);
    const [prevCommentArrayLength, setPrevCommentArrayLength] = useState(0);
    const [updateBox, setUpdateBox] = useState(true);
    const loadingKey = useRef(uuidv4());
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const loggedInUser = useLoggedInUser();

    async function getComment(commentId) {
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


    async function getAllNextLevelComments() {
        let userComments = [];
        let others = [];
        await Promise.all(
            post.comments.map(async (comment) => {
                if (isPost && comment.level !== 0) {
                    return;
                } else {
                    const fetchedComment = await getComment(comment.id);
                    if (comment.authorId === loggedInUser.id) {
                        userComments.push(fetchedComment);
                    } else {
                        others.push(fetchedComment);
                    }
                }
            })
        );

        return [...userComments, ...others];
    }

    function loadMoreComments() {
        if (visibleComments < post.comments.length) {
            setIsLoading(true);
            setTimeout(() => {
                setVisibleComments((prev) => Math.min(prev + numCommentsPerLoad, post.comments.length)); // Load 10 more posts
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
        const fetchCommentArray = async () => {
            if (post.authorId && ( post || updateBox) ) {
                let newArr = await getAllNextLevelComments(post)
                setCommentArray(newArr);
                setUpdateBox(false);
            }
        }
        fetchCommentArray();
    }, [updateBox, post])

    useEffect(() => {
        if (!isFirstLoad && commentArray.length > prevCommentArrayLength) {
            setVisibleComments(visibleComments + 1);
            setPrevCommentArrayLength(commentArray.length);
        }
    }, [commentArray, prevCommentArrayLength])

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
        <div>
        {commentArray.slice(0, visibleComments).map((comment) => {
            return ( 
                <div key={comment.id} className="comment-box">
                    <Comment commentId={comment.id}/>
                </div>
            );
        })}
    
        {visibleComments < commentArray.length && (
            <button className='edit-button load-more-button' onClick={loadMoreComments}>
                Load more replies...
                {(
                    <div id={loadingKey.current} className="loader">
                        <DefaultSpinner size={10} />
                    </div>
                )}
            </button>
        )}
        </div>
    )
}

PostCommentBox.propTypes = {
    post: PropTypes.object.isRequired,
    isPost: PropTypes.bool,
    numCommentsPerLoad: PropTypes.number,
};