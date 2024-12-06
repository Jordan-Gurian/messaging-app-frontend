import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import UserProfileImage from './UserProfileImage';

import './FollowBlock.css'

export default function FollowBlock({ followUsers }) {

    const numCols = 5;
    const gridColumnWidth = '150px';
    const gridRowHeight = '100px';
    const height = '75px';
    const width = '75px';

    return (
        <div 
            className='follow-block' 
            style={
                { 
                    gridTemplateColumns: `repeat(${numCols}, ${gridColumnWidth})`,
                    gridAutoRows: `minmax(${gridRowHeight}, auto)`,
                    marginLeft: `calc(${width} / -2)`
                }
            }>
            {followUsers.map((user) => {
                return (
                    <Link key={uuidv4()}
                        className='follow-block-user follow-user-flex'
                        to={`/user/${user.username}`}
                        reloadDocument
                    >
                        <UserProfileImage 
                            profileUrl={user.profile_url}
                            allowEdit={false}
                            height={height}
                            width={width}
                        />
                        <div className="follow-username" style={{maxWidth: gridColumnWidth}}>{user.username}</div>
                    </Link>
                )
            })}
        </div>
    )
} 

FollowBlock.propTypes = {
    followUsers: PropTypes.array
};