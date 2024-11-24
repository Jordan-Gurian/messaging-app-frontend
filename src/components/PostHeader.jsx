import PropTypes from "prop-types";
import UserProfileImage from './UserProfileImage';
import EditButton from './EditButton';

import './PostHeader.css'

export default function PostHeader({ author, post, onClick, loggedInUser=null, isActiveEdit=false }) {
    return (
        <div className='post-header'>
            <UserProfileImage
                profileUrl={author.profile_url}
                allowEdit={false}
                presignedUrl={author.profile_url}
                height='50px'
                width='50px'
            />
            <div className='post-header user-info'>
                <div className='post-header top-line'>
                    <div className='post-header author'>{author.username}</div>
                    {loggedInUser.id === author.id && !isActiveEdit && (
                        <EditButton onClick={() => onClick()} width='18px'/>
                    )}
                </div>
                <div className='post-header date subtext'>{post.date}</div>
            </div>
        </div>
    );
}

PostHeader.propTypes = {
    author: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    loggedInUser: PropTypes.object,
    isActiveEdit: PropTypes.bool,
};

