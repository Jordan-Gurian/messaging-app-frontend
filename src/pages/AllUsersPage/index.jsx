import { useState, useEffect } from 'react';
import FollowBlock from './../../components/FollowBlock'

export default function UserProfilePage() {

    const [users, setUsers] = useState([]);

    const apiUrl = import.meta.env.VITE_API_URL;
    const requestURL = `${apiUrl}/users/`;

    async function getUserData() {
        try {
            const response = await fetch(requestURL);
            setUsers(await response.json());       
        } catch (error) {
            return { error }
        } 
    }
      
    useEffect(() => {
        getUserData();
    }, []);


    if (Object.keys(users).length > 0) {
        return (
            <main>
                <FollowBlock followUsers={users}></FollowBlock>
            </main>
        )
    } else {
        return (
            <main>
                Loading...
            </main>
        )
    }

}