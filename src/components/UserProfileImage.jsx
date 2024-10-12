import PropTypes from 'prop-types';
import EditUserProfileImage from '../pages/UserProfilePage/EditUserProfileImage';

export default function UserProfileImage(props) {
    return (
        <div>
            <img className='user-profile-img' src={props.presignedUrl}/>
            <EditUserProfileImage onFormSubmit={props.onFormSubmit} />
        </div>
    )
} 

UserProfileImage.propTypes = {
    presignedUrl: PropTypes.string.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
};