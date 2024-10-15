import PropTypes from 'prop-types';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './../hooks/AuthContext'

export default function FollowButton(props) {
    
    const token = localStorage.token;
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const userToFollow = useParams();
    const usernameToFollow = userToFollow.username;

    let decoded;
    let username;
    let isFollow = true; // show "Follow" for unauthenticated users

    if (isAuthenticated) {
        decoded = jwtDecode(token);
        username = decoded.user.username;
        isFollow = !props.followedBy.some(user => user.username === username);
    }
     
    async function followUser() { 
        const apiUrl = import.meta.env.VITE_API_URL
        const requestURL = `${apiUrl}/users/${username}/follow`

        const body = {
            usernameToFollow: usernameToFollow,
            isFollow: isFollow,
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
            const responseDetails = await response.json();
            if (responseDetails.error === 'token invalid') {
                localStorage.removeItem("token");
                navigate('/', { state: { successMessage: 'You have successfully logged out' } });
            }
            props.onClick(responseDetails);
        } catch (error) {
            return { error }        
        }  
    }

    if (props.isUser) {
        return (
            <div>
            </div>
        )
    } else if (!props.followedBy) {
        return (
            <button>
                <Link to="/register">Follow</Link>
            </button>
        )
    } else {
        if (props.followedBy && !isFollow) {
            return (
                <button onClick={followUser}>
                    Unfollow
                </button>
            )
        } else {
            return (
                <button onClick={followUser}>
                    Follow
                </button>
            )
        }
    }
} 

FollowButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    isUser: PropTypes.bool.isRequired,
    followedBy: PropTypes.array,
}