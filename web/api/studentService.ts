import axios, { AxiosResponse } from 'axios';
import { Student } from '../types/student';
import { API_URL } from '../config/config';
import { getStudentDataFromBridge } from './bridgingService';

export const getStudentById = async (id: number): Promise<Student | null> => {
    try {
        const studentData = getStudentDataFromBridge();
        if (!studentData) {
            alert("Student data is not available.");
            return null;
        }
        const { API_KEY, student_id } = studentData;

        const response: AxiosResponse<Student> = await axios.get(`${API_URL}/get-student`, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY, 
                'student-id': student_id 
            },
        });
        if (response.headers['content-type']?.includes('application/json')) {
            console.log('Fetched student data:', response.data); // Log the student data
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