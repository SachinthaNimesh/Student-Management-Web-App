import axios from 'axios';
import { Student } from '../types/student';
import { API_URL } from '../config/config';
import { getStudentDataFromBridge } from './bridgingService';

export const getStudentById = async (): Promise<Student | null> => {
    let studentData: { student_id: string; API_KEY: string } | null = null;
    try {
        studentData = getStudentDataFromBridge();
        if (!studentData) {
            alert("Student data is not available.");
            return null;
        }
        const { student_id, API_KEY } = studentData;


        const response = await axios.get<Student>(`${API_URL}/get-student`, {
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
        if ((error as any).isAxiosError) {
            console.error(`Axios error fetching student with id ${studentData?.student_id}:`, {
                message: (error as any).message,
                code: (error as any).code,
                config: (error as any).config,
                response: (error as any).response?.data,
                status: (error as any).response?.status,
            });
        } else {
            console.error(`Unexpected error fetching student:`, error);
        }
        throw new Error(`Failed to fetch student`);
    }
};