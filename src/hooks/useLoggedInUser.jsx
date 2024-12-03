import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function useLoggedInUser() {
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.user;
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
        return null;
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setLoggedInUser(decoded.user);
            } catch (error) {
                console.error("Invalid token:", error);
                setLoggedInUser(null);
            }
        } else {
            setLoggedInUser(null);
        }
    }, []);

    return loggedInUser;
}