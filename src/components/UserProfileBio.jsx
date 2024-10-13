import PropTypes from 'prop-types';
import EditUserProfileBio from '../pages/UserProfilePage/EditUserProfileBio';

export default function UserProfileBio(props) {
    if (props.isUser) {
        return (
            <div>
                <div className='user-profile-bio'>
                    {props.profile_bio}
                </div>
                <EditUserProfileBio onFormSubmit={props.onFormSubmit}/>
            </div>
        )
    } else {
        return (
            <div>
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