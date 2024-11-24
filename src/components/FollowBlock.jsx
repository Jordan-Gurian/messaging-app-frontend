import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import UserProfileImage from './UserProfileImage';
import './FollowBlock.css'

export default function FollowBlock({ followUsers }) {

    return (
        <div className='follow-block'>
            {followUsers.map((user) => {
                return (
                    <Link key={uuidv4()} className='follow-block-user' to={`/user/${user.username}`} reloadDocument>
                        <UserProfileImage 
                            profileUrl={user.profile_url}
                            allowEdit={false}
                            height={'75px'}
                            width={'75px'}
                        />
                        <div>{user.username}</div>
                    </Link>
                )
            })}
        </div>
    )
} 

FollowBlock.propTypes = {
    followUsers: PropTypes.array
};