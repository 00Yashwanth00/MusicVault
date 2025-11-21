import api from './api';

export const authService = {
    userLogin: async ({email, password}) => {
        try {
        const response = await api.post('/api/auth/users/login', {
            email,
            password
        });
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.error || 'Login failed');
        }
    },

    adminLogin: async ({admin_id, email, password}) => {
        try {
        const response = await api.post('/api/auth/admin/login', {
            admin_id,
            email,
            password
        });
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.error || 'Admin login failed');
        }
    },

    userRegister: async (userData) => {
        try {
        const response = await api.post('/api/auth/users/register', {
            ...userData
        });
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.error || 'Registration failed');
        }
    },

    adminRegister: async (adminData) => {
        console.log(adminData);
        try {
        const response = await api.post('/api/auth/admin/register', {
            ...adminData
        });
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.error || 'Admin registration failed');
        }
    },

    getProfile: async () => {
        try {
        const response = await api.get('/api/auth/profile');
        return response.data;
        } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get profile');
        }
    },

    verifyToken: async (token) => {
        try {
        const response = await api.get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
        } catch (error) {
        throw new Error('Invalid token');
        }
    }
}