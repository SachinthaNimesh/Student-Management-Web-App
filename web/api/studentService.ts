import axios, { AxiosResponse } from 'axios';
import { Student } from '../types/student';
import { API_URL } from '../config/config';

export const getStudentById = async (id: number): Promise<Student | null> => {
    try {
        const response: AxiosResponse<Student> = await axios.get(`${API_URL}/students/${id}`, {
            headers: {
                Accept: 'application/json', // Ensure the API returns JSON
            },
        });
        if (response.headers['content-type']?.includes('application/json')) {
            return response.data;
        } else {
            throw new Error('Received non-JSON response from the API');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Axios error fetching student with id ${id}:`, {
                message: error.message,
                code: error.code,
                config: error.config,
                response: error.response?.data,
                status: error.response?.status,
            });
        } else {
            console.error(`Unexpected error fetching student with id ${id}:`, error);
        }
        throw new Error(`Failed to fetch student with id ${id}`);
    }
};