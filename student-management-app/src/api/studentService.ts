import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://87e89eab-95e5-4c0f-8192-7ee0196e1581-dev.e1-us-east-azure.choreoapis.dev/employee-mgmt-system/student-mgmt-server/v1.0';

export const getStudentById = async () => {
  try {
    let student_id = await AsyncStorage.getItem('student_id');
    if (!student_id) {
      throw new Error('Student ID not found');
    }
    student_id = student_id.trim();
    console.log('Fetched student_id from AsyncStorage:', student_id);

    const url = `${BASE_URL}/get-student`;
    console.log('Fetching student data from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Student-ID': student_id,
        'api-key': String(process.env.EXPO_PUBLIC_API_KEY ?? ''),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch student data:', response.status, errorText);
      throw new Error('Failed to fetch student data');
    }

    const data = await response.json();
    console.log('Student data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};