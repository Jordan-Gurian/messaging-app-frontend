import { createBrowserRouter } from "react-router-dom";
import App from './App';
import ErrorPage from './pages/Error/index';
import LoginPage from './pages/Login/index'
import HomePage from './pages/Home/index';
import RegisterPage from './pages/Register/index';
import UserProfilePage from './pages/UserProfilePage/index';
import AllUsersPage from './pages/AllUsersPage/index';

import './index.css';

// if you want to show the loader when React loads data again
const hideLoader = () => {
    const loader = document.querySelector('.loader');
    loader.classList.add('loader--hide');
};
const router = createBrowserRouter([
    {
        path: "/",
        element: <App hideLoader={hideLoader}/>,
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
        ],
    }
]);

export default router