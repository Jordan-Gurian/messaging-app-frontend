import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import FollowBlock from './FollowBlock';
import './UserFollowBlock.css';

export default function UserFollowBlock({ followLabel='Follow Block', followBlockContent }) {

    followBlockContent.slice(0,15);

    useEffect(() => {
        followBlockContent.slice(0,15);
    }, [followBlockContent])

    return (
        <div className='following user-profile-following-container'>
            <Link className='profile-page-section-label' to={`./${followLabel}`}>
                {followLabel}
            </Link>
            <div className='follow-block-container'>
                <FollowBlock followUsers={followBlockContent}></FollowBlock>
            </div>
        </div>
    )

} 

UserFollowBlock.propTypes = {
    followBlockContent: PropTypes.array,
    followLabel: PropTypes.string,
};