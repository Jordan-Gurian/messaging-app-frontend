import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import { createS3Client, getUserPresignedUrl } from './../utils/s3Utils';
import DefaultProfilePic from './../assets/profile-default.png';
import EditButton from './EditButton';

import './UserProfileImage.css'

export default function UserProfileImage({ profileUrl, allowEdit, height='auto', width='auto', modalSetter, updateLoadCount }) {

    const [isHover, setIsHover] = useState(false);
    const [presignedUrl, setPresignedUrl] = useState(''); 
    const { isAuthenticated } = useAuth();

    const isLoaded = useRef(false);

    const handleMouseEnter = () => {
        setIsHover(true); // Update state on mouse enter
    };

    const handleMouseLeave = () => {
        setIsHover(false); // Update state on mouse leave
    };


    async function getPresignedUrl() {
        try {
            const s3 = createS3Client();
            const url = await getUserPresignedUrl(s3, profileUrl);
            return url
        } catch (error) {
            return { error }
        } 
    }

    useEffect(() => {
        if (profileUrl) {
            const fetchPresignedUrl = async ()  => {
                const url = await getPresignedUrl();
                setPresignedUrl(url);
            }
            fetchPresignedUrl();
        } else {
            setPresignedUrl(DefaultProfilePic);
        }
        if (updateLoadCount && !isLoaded.current) {
            updateLoadCount();
            isLoaded.current = true;
        }
    }, [profileUrl])

    if (allowEdit && isAuthenticated && isHover) {
        return (
            <div className="user-profile-img-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img className='user-profile-img' src={presignedUrl} height={height} width={width} alt="NOTHING"/>
                <div className="edit-button-container"> {/* Need div container for formatting */}
                    <EditButton onClick={() => modalSetter(true)} width={"32px"} title="Change profile picture"/>
                </div>
            </div>
        )
    } else if (isAuthenticated) {
        return (
            <div className="user-profile-img-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img className='user-profile-img' src={presignedUrl} height={height} width={width}/>
            </div>
        )
    } else {
        return (
            <div className="user-profile-img-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img className='user-profile-img blur' src={presignedUrl} height={height} width={width}/>
            </div>
        )
    }
} 

UserProfileImage.propTypes = {
    profileUrl: PropTypes.string.isRequired,
    allowEdit: PropTypes.bool.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    modalSetter: PropTypes.func,
    updateLoadCount: PropTypes.func,
};