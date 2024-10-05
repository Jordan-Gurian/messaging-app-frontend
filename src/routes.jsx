import { createBrowserRouter } from "react-router-dom";
import App from './App';
import ErrorPage from './pages/Error/index';
import LoginPage from './pages/Login/index'
import HomePage from './pages/Home/index';
import RegisterPage from './pages/Register/index';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/register',
                element: <RegisterPage />,
            },

        ],
    }
]);

export default router