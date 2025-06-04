import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getStudentById } from '../api/studentService';

const Header: React.FC = () => {
  const [studentName, setStudentName] = React.useState<string>('');

  React.useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const student = await getStudentById();
        // Handle if API returns an array or object
        let firstName = '';
        if (Array.isArray(student) && student.length > 0) {
          firstName = student[0]?.first_name ?? '';
        } else if (student && typeof student === 'object') {
          firstName = student.first_name ?? '';
        }
        setStudentName(firstName);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Hi {studentName || '!'}
        </Text>
        <Text style={styles.wave}>👋</Text>
      </View>
      <View style={styles.profilePic}>
        <Text style={styles.profileInitial}>
          {studentName ? studentName.charAt(0).toUpperCase() : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greetingText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  wave: {
    fontSize: 28,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Header;