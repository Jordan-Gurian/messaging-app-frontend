import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import UserProfileImage from './UserProfileImage';

export default function UserFollowedBy(props) {

    const apiUrl = import.meta.env.VITE_API_URL;

    if (props.followedBy.length > 0) {
        return (
            <div className='following'>
                Followers:
                {props.followedBy.map((user) => {
                    return (
                        <Link key={uuidv4()} className='following-user' to={`./../${user.username}`} reloadDocument>
                            <UserProfileImage 
                                profile_url={`${apiUrl}/${user.profile_url}`} 
                            />
                            <div>{user.username}</div>
                        </Link>
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