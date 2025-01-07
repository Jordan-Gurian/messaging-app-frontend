import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FollowBlock from './../../components/FollowBlock'

export default function AllUsersPage( { following=false }) {

    const params = useParams();
    const [users, setUsers] = useState([]);

    async function getUserData() {
        
        const apiUrl = import.meta.env.VITE_API_URL;
        let requestURL;

        try {
            if (params.username) {
                const username = params.username;
                requestURL = `${apiUrl}/users/${username}`;
                const response = await fetch(requestURL);
                const user = await response.json();
                if (following) {
                    setUsers(user.following);  
                } else {
                    setUsers(user.followedBy);
                }
            } else {
                requestURL = `${apiUrl}/users/`;
                const response = await fetch(requestURL);
                setUsers(await response.json());  
            }
        } catch (error) {
            return { error }
        } 
    }
      
    useEffect(() => {
        getUserData();
    }, []);

    return ( 
        Object.keys(users).length > 0 && (
            <main className='all-users-page-container'>
                <FollowBlock followUsers={users} numCols='auto-fit'></FollowBlock>
            </main>
        )
    )
}

AllUsersPage.propTypes = {
    following: PropTypes.bool,
};