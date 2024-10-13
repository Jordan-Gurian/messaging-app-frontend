import PropTypes from 'prop-types';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createS3Client, getUserPresignedUrl } from './../utils/s3Utils';
import UserProfileImage from './UserProfileImage';

export default function FollowBlock(props) {

    const s3 = createS3Client();
    const [followingUrls, setFollowingUrls] = useState([]);


    async function getPresignedUrls() {
        props.followUsers.map(async(user) => {
            try {
                const userUrl = await getUserPresignedUrl(s3, user.profile_url);
                setFollowingUrls(followingUrls => [...followingUrls, userUrl]);
            } catch (error) {
                return { error }
            } 
        });
    }

    useEffect(() => {
        getPresignedUrls();
    }, [])

    if (props.followUsers.length > 0 && followingUrls.length > 0) {
        return (
            <div className='follow-block'>
                {props.followUsers.map((user, index) => {
                    return (
                        <Link key={uuidv4()} className='follow-block-user' to={`./../${user.username}`} reloadDocument>
                            <UserProfileImage 
                                isUser={false}
                                presignedUrl={followingUrls[index]}
                                height={'75px'}
                                width={'75px'}
                            />
                            <div>{user.username}</div>
                        </Link>
                    )
                })}
            </div>
        )
    } else {
        return (
            <div className='follow-block'>
                None
            </div>
        )
    }
} 

FollowBlock.propTypes = {
    followUsers: PropTypes.array
};