import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import PropTypes from "prop-types";
import CloseIcon from "./../../components/CloseIcon";
import ImageCropper from "./../../components/ImageCropper";
import { createS3Client, deleteS3Objects, uploadToS3 } from "./../../utils/s3Utils";

import './EditUserProfileImage.css';

export default function EditUserProfileImage({ updateAvatar, closeModal }) {

    const usernameObj = useParams()
    const username = usernameObj.username;

    async function handleUpdateAvatar(file) {
        const key = `${username}/${uuidv4()}`;
        try {
            const s3 = createS3Client();
            await deleteS3Objects(s3, null, username)
            await uploadToS3(s3, file, key);
            await updateUserProfileUrl(key);
            updateAvatar(true);
        } catch (error) {
            console.log(error)
            return { error }
        }
    }

    async function updateUserProfileUrl(key) {

        const token = localStorage.token;
        const decoded = jwtDecode(token);
        
        // Redundant, but nice added layer of defense
        if (decoded.user.username !== username) {
            return new Error(`Cannot change another user's profile`);
        }

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/users/${decoded.user.id}`

        const body = {
            profile_url: key,
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
            return await response.json()
        } catch (error) {
            console.log(error)
            return { error }        
        }  
    }

    return (
        <div role="dialog">
            <div className="modal-overlay"></div>
            <div className="modal-container">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="close-profile-image"
                            onClick={closeModal}
                        >
                            <span>Close menu</span>
                            <CloseIcon />
                        </button>
                        <ImageCropper 
                            updateAvatar={handleUpdateAvatar}
                            closeModal={closeModal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

EditUserProfileImage.propTypes = {
    updateAvatar: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
};
