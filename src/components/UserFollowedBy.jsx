import PropTypes from 'prop-types';
import UserProfileImage from './UserProfileImage';
import { v4 as uuidv4 } from 'uuid';

export default function UserFollowedBy(props) {

    const apiUrl = import.meta.env.VITE_API_URL;

    if (props.followedBy.length > 0) {
        return (
            <div className='following'>
                Followers:
                {props.followedBy.map((user) => {
                    return (
                        <div key={uuidv4()} className='following-user'>
                            <UserProfileImage 
                                profile_url={`${apiUrl}/${user.profile_url}`} 
                            />
                            <div>{user.username}</div>
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return (
            <div className='following'>
                Followers:
                No followers
            </div>
        )
    }
} 

UserFollowedBy.propTypes = {
    followedBy: PropTypes.array
};