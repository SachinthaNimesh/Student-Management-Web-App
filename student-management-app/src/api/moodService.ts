import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://87e89eab-95e5-4c0f-8192-7ee0196e1581-dev.e1-us-east-azure.choreoapis.dev/employee-mgmt-system/student-mgmt-server/v1.0';

export type MoodType = 'happy' | 'neutral' | 'sad';

export const postMood = async (mood: MoodType, type: 'checkin' | 'checkout') => {
  try {
    const student_id = await AsyncStorage.getItem('student_id');
    if (!student_id) {
      throw new Error('Student ID not found');
    }

    const response = await fetch(`${BASE_URL}/post-mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'student-id': student_id.trim(),
        'api-key': String(process.env.EXPO_PUBLIC_API_KEY ?? ''),
      },
      body: JSON.stringify({
        emotion: mood,
        is_daily: type === 'checkin' ? false : true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to post mood');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting mood:', error);
    throw error;
  }
};