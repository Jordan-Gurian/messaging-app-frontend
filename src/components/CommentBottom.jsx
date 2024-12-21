import PropTypes from 'prop-types';
import LikeButton from './LikeButton';
import EditButton from './EditButton';
import DeleteIcon from '../assets/delete.png';
import ReplyIcon from './../assets/reply.png';
import PostMetrics from './PostMetrics';

import './CommentBottom.css';

export default function CommentBottom({ comment, isUser=false, setCommentUpdate, changeEditStatus, changeReplyStatus, deleteComment }) {

    return (
        comment.isDeleted ? (
            <div className="comment-bottom">
                <PostMetrics
                    usersThatLiked={comment.usersThatLiked}
                    comments={comment.comments.length}
                />
                <div className="comment-date subtext">
                    {comment.date}
                </div>
            </div>
        ) : (
            <div className="comment-bottom">
                <LikeButton objToLike={comment} updateLikes={setCommentUpdate} title="Like"/>
                <EditButton icon={ReplyIcon} onClick={() => changeReplyStatus()} width='16px' title="Add comment"/>
                <PostMetrics
                    usersThatLiked={comment.usersThatLiked}
                    comments={comment.comments.length}
                />
                <div className="comment-date subtext">
                    {comment.date}
                </div>
                {isUser && (
                    <div className="mod-buttons">
                        <EditButton onClick={() => changeEditStatus()} width='16px' title="Edit comment"/>
                        <EditButton icon={DeleteIcon} onClick={() => deleteComment()} width='16px' title="Delete comment"/>
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
    changeReplyStatus: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
};