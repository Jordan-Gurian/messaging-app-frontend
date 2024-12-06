import { useState, useEffect } from 'react'
import { useLoggedInUser } from './../../hooks/useLoggedInUser';
import { useAuth } from './../../hooks/AuthContext';
import DefaultSpinner from './../../components/DefaultSpinner';
import UserPosts from './../../components/UserPosts';

import './index.css'

export default function HomePage() {

    const { isAuthenticated, checkAuth } = useAuth();
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isPostsLoading, setIsPostsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState({});
    const [posts, setPosts] = useState([]);
    const loggedInUser = useLoggedInUser();
    const apiUrl = import.meta.env.VITE_API_URL;

    async function getUser() {
        try {
            const requestURL = `${apiUrl}/users/${loggedInUser.id}`;
            const response = await fetch(requestURL);
            const user = await response.json();
            return user;
        } catch (error) {
            return { error }
        } 
    }

    async function getHomePagePosts() {
        try {
            const queryString = currentUser.following.map(user => `authorIds[]=${user.id}`).join('&');

            const requestURL = `${apiUrl}/posts?${queryString}`;
            const response = await fetch(requestURL);
            const posts = await response.json();
            return posts;
        } catch (error) {
            return { error }
        } 
    }

    useEffect(() => {
        checkAuth();
    }, [])

    useEffect(() => {
        if (isAuthenticated && loggedInUser) {
            const fetchUser = async () => {
                try {
                    setIsUserLoading(true);
                    const user = await getUser();
                    setCurrentUser(user);
                    setIsUserLoading(false);
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
            fetchUser();
        }
    },[isAuthenticated])

    useEffect(() => {
        const fetchPosts = async () => {
            if (!isUserLoading && currentUser.following && currentUser.following.length > 0) {
                setIsPostsLoading(true);
                try {
                    const homePagePosts = await getHomePagePosts();
                    setPosts(homePagePosts);
                    setIsPostsLoading(false);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            // Do not fetch posts if there is no user
            } else if (!isUserLoading) {
                setIsPostsLoading(false);
            }
        };

        fetchPosts();
    }, [isUserLoading, currentUser]);

    const homePageMessage = isAuthenticated ? `Home screen, but you're logged in!` : `Home screen, but you're not logged in :(`
    return (
        <main className="home-page-container">
            {homePageMessage}
            {isAuthenticated && posts && (
                <UserPosts
                    posts={posts}
                    postsLabel={'Home Page'}
                    updateUser={() => setIsUserLoading(true)}
                />
            )}
        </main>
    )
}