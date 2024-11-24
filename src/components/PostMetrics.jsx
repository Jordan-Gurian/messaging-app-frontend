import PropTypes from "prop-types";

import './PostMetrics.css';

export default function PostMetrics({ likes=0, comments=0 }) {
    return (
        <div className='post metrics subtext'>
            <div className='post likes'>{likes} Likes</div>
            <div className='post comments'>{comments} Comments</div>
        </div>
    );
}

PostMetrics.propTypes = {
    likes: PropTypes.number,
    comments: PropTypes.number,
};