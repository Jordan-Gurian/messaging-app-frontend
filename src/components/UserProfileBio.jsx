import PropTypes from 'prop-types';
import EditUserProfileBio from '../pages/UserProfilePage/EditUserProfileBio';

import './UserProfileBio.css';

export default function UserProfileBio(props) {
    if (props.isUser) {
        return (
            <div className='user-profile-bio-container'>
                <div className='user-profile-bio'>
                    {props.profile_bio}
                </div>
                <EditUserProfileBio onFormSubmit={props.onFormSubmit}/>
            </div>
        )
    } else {
        return (
            <div className='user-profile-bio-container'>
                <div className='user-profile-bio'>
                    {props.profile_bio}
                </div>
            </div>
        )
    }
} 

UserProfileBio.propTypes = {
    profile_bio: PropTypes.string,
    onFormSubmit: PropTypes.func.isRequired,
    isUser: PropTypes.bool.isRequired,
};