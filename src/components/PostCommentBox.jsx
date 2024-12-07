import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import Comment from './Comment';


export default function PostCommentBox({ post, updateLoadCount }) {
    
    const [commentArray, setCommentArray] = useState([]);
    const [updateBox, setUpdateBox] = useState(true);
    const [isCommentsLoaded, setIsCommentsLoaded] = useState(false);
    const [commentsLoadedCount, setCommentsLoadedCount] = useState(0);
    const isLoaded = useRef(false);

    function updateCommentsLoadedCount() {
        setCommentsLoadedCount((prevCount) => prevCount + 1);
    }

    useEffect(() => {
        if (commentsLoadedCount === post.comments.length) {
            setIsCommentsLoaded(true);
        }
    }, [commentsLoadedCount, post.comments.length]);

    
    useEffect(() => {
        if (isCommentsLoaded && updateLoadCount && !isLoaded.current) {
            updateLoadCount();
            isLoaded.current = true;
        }
      }, [isCommentsLoaded]);


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


    async function orderComments(item, isPost = true, processedComments = new Set()) {
        let newArr = [];
    
        if (!isPost && !processedComments.has(item.id)) {
            item = await getComment(item.id);
            newArr.push(item);
            processedComments.add(item.id);
        }
    
        if (item.comments && item.comments.length > 0) {
            for (const nestedComment of item.comments) {
                const orderedNestedComments = await orderComments(nestedComment, false, processedComments);
                newArr = newArr.concat(orderedNestedComments);
            }
        }
    
        return newArr;
    }
    
    useEffect(() => {
        const fetchCommentArray = async () => {
            if (post.authorId && ( post || updateBox) ) {
                setCommentArray(await orderComments(post, true));
                setUpdateBox(false);
            }
        }
        fetchCommentArray();
    }, [updateBox, post])

    return (
        commentArray.map((comment) => {
            return ( 
                <Comment key={comment.id} commentId={comment.id} setUpdateBox={setUpdateBox} updateLoadCount={updateCommentsLoadedCount}/> 
            )
        })
    )
}

PostCommentBox.propTypes = {
    post: PropTypes.object.isRequired,
    updateLoadCount: PropTypes.func,
};