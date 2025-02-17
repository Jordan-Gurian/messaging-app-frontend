import { createBrowserRouter } from "react-router-dom";
import App from './App';
import ErrorPage from './pages/Error/index';
import LoginPage from './pages/Login/index'
import HomePage from './pages/Home/index';
import RegisterPage from './pages/Register/index';
import UserProfilePage from './pages/UserProfilePage/index';
import AllUsersPage from './pages/AllUsersPage/index';
import UserChatsPage from './pages/UserChatsPage/index';

import './index.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/register',
                element: <RegisterPage />,
            },
            {
                path: '/user/:username',
                element: <UserProfilePage />,
            },
            {
                path: '/users',
                element: <AllUsersPage />,
            },
            {
                path: '/user/:username/following',
                element: <AllUsersPage following={true} />,
            },
            {
                path: '/user/:username/followers',
                element: <AllUsersPage following={false} />,
            },
            {
                path: '/user/:username/chats',
                element: <UserChatsPage />,
            },
        ],
    }
]);

export default router