import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
    };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
        try {
            // Verify token is still valid
            const profile = await authService.verifyToken(token);
            setUser(JSON.parse(storedUser));
        } catch (error) {
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        }
        setLoading(false);
    };

    const login = async (formData, isAdmin = false) => {
        try {
        let result;
        
        if (isAdmin) {
            result = await authService.adminLogin(formData);
        } else {
            result = await authService.userLogin(formData);
        }

        if (result.success) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            setUser(result.user);
            console.log(user);
            return { success: true, user: result.user };
        } else {
            return { success: false, error: result.error };
        }
        } catch (error) {
        return { success: false, error: error.message };
        }
    };

    const register = async (userData, isAdmin = false) => {
        try {
        const result = isAdmin
        ? await authService.adminRegister(userData)
        : await authService.userRegister(userData);

        if (result.success) {
            return { success: true };
        } else {
            return { success: false, error: result.error };
        }
        } catch (error) {
        return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
};