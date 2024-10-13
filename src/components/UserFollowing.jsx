import PropTypes from 'prop-types';
import FollowBlock from './FollowBlock';

export default function UserFollowing(props) {
    return (
        <div className='following'>
            <div className='follow-label'>Following:</div>
            <FollowBlock followUsers={props.following}></FollowBlock>
        </div>
    )

} 

UserFollowing.propTypes = {
    following: PropTypes.array
};