import PropTypes from "prop-types";
import UserProfileImage from './UserProfileImage';
import EditButton from './EditButton';
import DeleteIcon from './../assets/delete.png'

import './PostHeader.css'

export default function PostHeader({ author, post, onClickEdit, onClickDelete, loggedInUser=null, isActiveEdit=false }) {
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
                        <div className='mod-buttons'>
                            <EditButton onClick={() => onClickEdit()} width='18px'/>
                            <EditButton icon={DeleteIcon} onClick={() => onClickDelete()} width='18px'/>
                        </div>
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
    onClickEdit: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    loggedInUser: PropTypes.object,
    isActiveEdit: PropTypes.bool,
};

