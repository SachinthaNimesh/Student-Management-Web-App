import { Student } from '../types/student';
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const MOCK_STUDENT: Student = {
  id: '1',
  student_id: '1',
  first_name: 'John',
  last_name: 'Doe',
  gender: 'Male',
  email: 'john.doe@example.com',
};

export const getStudentById = async (): Promise<Student> => {
  try {
    const studentData = await AsyncStorage.getItem('student_1');
    if (studentData) {
      return JSON.parse(studentData);
    }
    
    // If no data exists, store and return mock data
    await AsyncStorage.setItem('student_1', JSON.stringify(MOCK_STUDENT));
    return MOCK_STUDENT;
  } catch (error) {
    console.error('Error fetching student:', error);
    return MOCK_STUDENT;
  }
}; 