import PropTypes from 'prop-types';
import FollowBlock from './FollowBlock';
import './UserFollowing.css';

export default function UserFollowing(props) {
    return (
        <div className='following user-profile-following-container'>
            <div className='follow-label'>Following:</div>
            <FollowBlock followUsers={props.following}></FollowBlock>
        </div>
    )

} 

UserFollowing.propTypes = {
    following: PropTypes.array
};