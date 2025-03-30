import { jwtDecode } from 'jwt-decode';


export const checkTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now(); // Check if token is expired
    } catch (error) {
        return false; // If token is invalid
    }
};
