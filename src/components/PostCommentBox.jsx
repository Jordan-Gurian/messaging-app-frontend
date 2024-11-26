import PropTypes from 'prop-types';
import Comment from './Comment';

export default function PostCommentBox({ post }) {
    
    
    return (
        post.comments.map((comment) => {
            return (
                <Comment key={comment.id} commentId={comment.id}/> 
            )
        })
    );

} 

PostCommentBox.propTypes = {
    post: PropTypes.object.isRequired,
};