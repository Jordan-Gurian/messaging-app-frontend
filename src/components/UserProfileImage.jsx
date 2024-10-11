import PropTypes from 'prop-types';

export default function UserProfileImage(props) {
    return (
        <img className='user-profile-img' src={props.presignedUrl}/>
    )
} 

UserProfileImage.propTypes = {
    presignedUrl: PropTypes.string.isRequired
};