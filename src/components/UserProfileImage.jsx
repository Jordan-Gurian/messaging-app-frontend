import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';

import './UserProfileImage.css'

export default function UserProfileImage({ presignedUrl, isUser, height='auto', width='auto', modalSetter }) {

    const [isHover, setIsHover] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleMouseEnter = () => {
        setIsHover(true); // Update state on mouse enter
    };

    const handleMouseLeave = () => {
        setIsHover(false); // Update state on mouse leave
    };
    if (isUser && isAuthenticated && isHover) {
        return (
            <div className="user-profile-img-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img className='user-profile-img' src={presignedUrl} height={height} width={width}/>
                <button className="search-button" onClick={() => modalSetter(true)}>
                    <IconImage className="icon-image" icon={EditIcon} height="15px" />
                </button>
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
    presignedUrl: PropTypes.string.isRequired,
    isUser: PropTypes.bool.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    modalSetter: PropTypes.func,
};