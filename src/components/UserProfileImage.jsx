import PropTypes from 'prop-types';

export default function UserProfileImage(props) {
    return (
        <img className='user-profile-img' src={props.profile_url}/>
    )
} 

UserProfileImage.propTypes = {
    profile_url: PropTypes.string.isRequired
};