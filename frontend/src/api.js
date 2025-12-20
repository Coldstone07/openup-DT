import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = {
    healthCheck: async () => {
        const response = await axios.get(`${API_URL}/health`);
        return response.data;
    },
    submitSession: async (sessionData) => {
        const response = await axios.post(`${API_URL}/session`, sessionData);
        return response.data;
    },
    getMatches: async (matchRequest) => {
        const response = await axios.post(`${API_URL}/match`, matchRequest);
        return response.data;
    },
    getGraph: async () => {
        const response = await axios.get(`${API_URL}/graph`);
        return response.data;
    }
};
