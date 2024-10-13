import PropTypes from 'prop-types';
import EditUserProfileImage from '../pages/UserProfilePage/EditUserProfileImage';

export default function UserProfileImage(props) {

    const height = props.height ? props.height : 'auto';
    const width = props.width ? props.width : 'auto';

    if (props.isUser) {
        return (
            <div>
                <img className='user-profile-img' src={props.presignedUrl} height={height} width={width}/>
                <EditUserProfileImage onFormSubmit={props.onFormSubmit} />
            </div>
        )
    } else {
        return (
            <div>
                <img className='user-profile-img' src={props.presignedUrl} height={height} width={width}/>
            </div>
        )
    }
} 

UserProfileImage.propTypes = {
    presignedUrl: PropTypes.string.isRequired,
    onFormSubmit: PropTypes.func,
    isUser: PropTypes.bool.isRequired,
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};