import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';
import { useLoggedInUser } from './../hooks/useLoggedInUser';

export default function EditButton({ type = 'button', onClick, icon = EditIcon, width='auto', hoverToggle=false, isHover }) {
    
    const usernameObj = useParams()
    const username = usernameObj.username;
    const loggedInUser = useLoggedInUser();

    let isUser = false;

    if (loggedInUser) {
        isUser = username === loggedInUser.username;
    }

    const { isAuthenticated } = useAuth();

    return (
        isUser && isAuthenticated && (
            <button
                className={hoverToggle ? "edit-button hover-toggle" : "edit-button"}
                type={type}
                onClick={type === 'button' ? onClick : null}
            >
                <IconImage icon={icon} width={width} />
            </button>
        )
    )
}

EditButton.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    width: PropTypes.string,
    hoverToggle: PropTypes.bool,
};