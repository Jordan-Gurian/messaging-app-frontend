import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';
import { useLoggedInUser } from './../hooks/useLoggedInUser';

export default function EditButton({ handleClick, width }) {
    
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
            <button className="edit-button" onClick={handleClick}>
                <IconImage className="icon-image" icon={EditIcon} width={width} />
            </button>
        )
    )
}

EditButton.propTypes = {
    handleClick: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired,
};