import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import UserProfileImage from './UserProfileImage';
import DefaultSpinner from './DefaultSpinner';

import './FollowBlock.css'

export default function FollowBlock({ followUsers=[] }) {

    const loadingKey = useRef(uuidv4());
    const [isFollowersLoaded, setIsFollowersLoaded] = useState(false);
    const followersLoaded = useRef(0);

    const height = '75px';
    const width = '75px';
    
    function updateFollowersLoadedCount() {
        followersLoaded.current += 1;
    }

    useEffect(() => {
        setIsFollowersLoaded(followersLoaded.current === followUsers.length);
    }, [followersLoaded])

    const hideLoader = () => {
        const loader = document.getElementById(loadingKey.current);
        loader.classList.add("loader--hide");
    };
    
    useEffect(() => {
        if (isFollowersLoaded) {
            setTimeout(() => {
                hideLoader()
              }, 1000);
        }
      }, [isFollowersLoaded]);

    return (
        <div 
            className='follow-block' 
        >
            {followUsers.map((user) => {
                return (
                    <Link key={uuidv4()}
                        className='link-text follow-user-flex'
                        to={`/user/${user.username}`}
                        title={user.username}
                        reloadDocument
                    >
                        <UserProfileImage 
                            profileUrl={user.profile_url}
                            allowEdit={false}
                            height={height}
                            width={width}
                            updateLoadCount={updateFollowersLoadedCount}
                        />
                        <div className="follow-username">{user.username}</div>
                    </Link>
                )
            })}
            <div id={loadingKey.current} className="loader">
                <DefaultSpinner/>
            </div>
        </div>
    )
} 

FollowBlock.propTypes = {
    followUsers: PropTypes.array,
};