import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import { createS3Client, uploadToS3, deleteS3Objects } from '../../utils/s3Utils';
import Resizer from 'react-image-file-resizer';
import PropTypes from 'prop-types';
import EditIcon from './../../assets/edit.png';

import './EditUserProfileImage.css';

export default function EditUserProfileImage(props) {

    const usernameObj = useParams()
    const username = usernameObj.username;
    const fileUploadRef = useRef();

    function handleFileInput(event) {
        event.preventDefault();
        fileUploadRef.current.click();    
    }

    async function handleProfileImageUpdate(event, username) {


        const file = fileUploadRef.current.files[0];
        const key = `${username}/${uuidv4()}`;

        async function resizeFile(file) {
            return new Promise((resolve, reject) => {
              Resizer.imageFileResizer(
                file,
                200,
                200,
                "JPEG",
                100,
                0,
                (uri) => {
                  resolve(uri);
                },
                "file"
              );
            });
          }
        
        const fileResized = await resizeFile(file);

        try {
            const s3 = createS3Client();
            await deleteS3Objects(s3, null, username)
            await uploadToS3(s3, fileResized, key);
            const user = await updateUserProfileUrl(key, username);
            props.onFormSubmit(user)
        } catch (error) {
            console.log(error)
            return { error }
        }


    }

    async function updateUserProfileUrl(key, username) {

        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/users/${username}`

        const token = localStorage.token;
        const decoded = jwtDecode(token);
        
        // Redundant, but nice added layer of defense
        if (decoded.user.username !== username) {
            return new Error(`Cannot change another user's profile`);
        }

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
        <form id="form" encType="multipart/form-data" onSubmit={handleFileInput}>
            <input 
                type="file"
                id="file"
                accept=".png, .jpg, .jpeg"
                ref={fileUploadRef}
                onChange={(event) => handleProfileImageUpdate(event, username)}
                hidden
            />
            <button type="submit">
                <img 
                    src={EditIcon}
                    height='20px'
                    width='20px'
                    alt="404 not found"
                />
            </button>
        </form>
    )
}

EditUserProfileImage.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
};