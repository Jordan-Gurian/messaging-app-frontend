import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import UserProfileImage from './UserProfileImage';

export default function UserFollowing(props) {

    const apiUrl = import.meta.env.VITE_API_URL;

    if (props.following.length > 0) {
        return (
            <div className='following'>
                Following:
                {props.following.map((user) => {
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
                Following:
                Not following any users
            </div>
        )
    }
} 

UserFollowing.propTypes = {
    following: PropTypes.array
};