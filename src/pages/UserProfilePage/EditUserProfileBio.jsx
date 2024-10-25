import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import IconImage from './../../components/IconImage';
import EditIcon from './../../assets/edit.png';

export default function EditUserProfileBio(props) {

    const usernameObj = useParams()
    const username = usernameObj.username;

    async function updateUserProfileBio(event, username) {
        event.preventDefault();

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/users/${username}`

        const token = localStorage.token;
        const decoded = jwtDecode(token);
        
        if (decoded.user.username !== username) {
            return new Error(`Cannot change another user's profile`);
        }

        const body = {
            profile_bio: event.target.bio.value,
        };
    
        const bodyString = JSON.stringify(body);
    
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    
        const requestOptions = {
            body: bodyString,
            method: "PUT",
            headers: headers,
        }

        try {
            const response = await fetch(requestURL, requestOptions);
            const user = await response.json();
            props.onFormSubmit()
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }
    
    return (
        <form id="form" onSubmit={(event) => updateUserProfileBio(event, username)}>
            <input 
                type="text"
                id="bio"
            />
            <button className="search-button" type="submit">
                <IconImage className="icon-image" icon={EditIcon} width="15px" />
            </button>
        </form>
    )
}

EditUserProfileBio.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
};