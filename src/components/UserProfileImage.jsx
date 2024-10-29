import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';

import './UserProfileImage.css'

export default function UserProfileImage(props) {

    const [isHover, setIsHover] = useState(false);
    const height = props.height ? `${props.height}px` : 'auto';
    const width = props.width ? `${props.width}px` : 'auto';
    const { isAuthenticated } = useAuth();

    const handleMouseEnter = () => {
        setIsHover(true); // Update state on mouse enter
    };

    const handleMouseLeave = () => {
        setIsHover(false); // Update state on mouse leave
    };
    if (props.isUser && isAuthenticated && isHover) {
        return (
            <div className="user-profile-img-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img className='user-profile-img' src={props.presignedUrl} height={height} width={width}/>
                <button className="search-button" onClick={() => props.modalSetter(true)}>
                    <IconImage className="icon-image" icon={EditIcon} height="15px" />
                </button>
            </div>
        )
    } else if (isAuthenticated) {
        return (
            <div className="user-profile-img-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img className='user-profile-img' src={props.presignedUrl} height={height} width={width}/>
            </div>
        )
    } else {
        return (
            <div className="user-profile-img-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img className='user-profile-img blur' src={props.presignedUrl} height={height} width={width}/>
            </div>
        )
    }
} 

UserProfileImage.propTypes = {
    presignedUrl: PropTypes.string.isRequired,
    isUser: PropTypes.bool.isRequired,
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    modalSetter: PropTypes.func,
};