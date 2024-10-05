import PropTypes from 'prop-types';
import UserProfileImage from './UserProfileImage';
import { v4 as uuidv4 } from 'uuid';

export default function UserFollowing(props) {

    const apiUrl = import.meta.env.VITE_API_URL;

    if (props.following.length > 0) {
        return (
            <div className='following'>
                Following:
                {props.following.map((user) => {
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
                Following:
                Not following any users
            </div>
        )
    }
} 

UserFollowing.propTypes = {
    following: PropTypes.array
};