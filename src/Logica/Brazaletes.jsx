import axiosInstance from '../api/axiosConfig';

export const getBracelets = async () => {
    try {
        const response = await axiosInstance.get('/brazalet');
        return response.data;
    } catch (error) {
        console.error('Error fetching bracelets:', error);
        throw error;
    }
};

export const getBraceletsByUser = async (userId) => {
    try {
        const response = await axiosInstance.get(`/brazalet/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user bracelets:', error);
        throw error;
    }
};