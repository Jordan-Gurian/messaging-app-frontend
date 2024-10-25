import PropTypes from 'prop-types';
import FollowBlock from './FollowBlock';

export default function UserFollowedBy(props) {
    return (
        <div className='followedBy user-profile-follower-container'>
            <div className='follow-label'>Followers:</div>
            <FollowBlock followUsers={props.followedBy}></FollowBlock>
        </div>
    )

} 

UserFollowedBy.propTypes = {
    followedBy: PropTypes.array
};