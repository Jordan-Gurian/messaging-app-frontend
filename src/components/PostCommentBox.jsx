import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Comment from './Comment';

export default function PostCommentBox({ post }) {
    
    const [commentArray, setCommentArray] = useState([]);
    const [updateBox, setUpdateBox] = useState(true);

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
                <Comment key={comment.id} commentId={comment.id} setUpdateBox={setUpdateBox}/> 
            )
        })
    )
}

PostCommentBox.propTypes = {
    post: PropTypes.object.isRequired,
};