import PropTypes from 'prop-types';
import FollowBlock from './FollowBlock';
import './UserFollowBlock.css';

export default function UserFollowBlock({ followLabel='Follow Block', followBlockContent }) {

    return (
        <div className='following user-profile-following-container'>
            <div className='profile-page-section-label'>{followLabel}</div>
            <FollowBlock followUsers={followBlockContent}></FollowBlock>
        </div>
    )

} 

UserFollowBlock.propTypes = {
    followBlockContent: PropTypes.array,
    followLabel: PropTypes.string,
};