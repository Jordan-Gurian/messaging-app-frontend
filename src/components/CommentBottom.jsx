import PropTypes from 'prop-types';
import LikeButton from './LikeButton';
import EditButton from './EditButton';
import DeleteIcon from '../assets/delete.png';
import PostMetrics from './PostMetrics';

import './CommentBottom.css';

export default function CommentBottom({ comment, isUser=false, setCommentUpdate, changeEditStatus, deleteComment }) {

    return (
        comment.isDeleted ? (
            <div className="comment-bottom">
                <PostMetrics
                    likes={comment.usersThatLiked.length}
                    comments={comment.comments.length}
                />
                <div className="comment-date subtext">
                    {comment.date}
                </div>
            </div>
        ) : (
            <div className="comment-bottom">
                <LikeButton objToLike={comment} updateLikes={setCommentUpdate}/>
                <PostMetrics
                    likes={comment.usersThatLiked.length}
                    comments={comment.comments.length}
                />
                <div className="comment-date subtext">
                    {comment.date}
                </div>
                {isUser && (
                    <div className="mod-buttons">
                        <EditButton onClick={() => changeEditStatus()} width='16px'/>
                        <EditButton icon={DeleteIcon} onClick={() => deleteComment()} width='16px'/>
                    </div>
                )}
            </div>
        )
    )
}

CommentBottom.propTypes = {
    comment: PropTypes.object.isRequired,
    isUser: PropTypes.bool,
    setCommentUpdate: PropTypes.func.isRequired,
    changeEditStatus: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
};