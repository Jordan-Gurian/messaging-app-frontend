import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';
import { useLoggedInUser } from './../hooks/useLoggedInUser';

export default function EditButton({ handleSubmit, width }) {
    
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
            <form id="form" onSubmit={handleSubmit}>
                <button className="edit-button" type="submit">
                    <IconImage className="icon-image" icon={EditIcon} width={width} />
                </button>
            </form>
        )
    )
}

EditButton.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    width: PropTypes.string.isRequired,
};