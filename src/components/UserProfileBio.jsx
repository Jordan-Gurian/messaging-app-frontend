import PropTypes from 'prop-types';
import EditUserProfileBio from '../pages/UserProfilePage/EditUserProfileBio';

export default function UserProfileBio(props) {
    return (
        <div>
            <div className='user-profile-bio'>
                {props.profile_bio}
            </div>
            <EditUserProfileBio onFormSubmit={props.onFormSubmit}/>
        </div>
    )
} 

UserProfileBio.propTypes = {
    profile_bio: PropTypes.string,
    onFormSubmit: PropTypes.func.isRequired,
};