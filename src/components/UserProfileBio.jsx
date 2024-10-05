import PropTypes from 'prop-types';

export default function UserProfileBio(props) {
    return (
        <div className='user-profile-bio'>
            {props.profile_bio}
        </div>
    )
} 

UserProfileBio.propTypes = {
    profile_bio: PropTypes.string
};