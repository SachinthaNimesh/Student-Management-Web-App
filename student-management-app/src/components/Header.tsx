import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStudentById } from '../api/studentService';
import { Student } from '../types/student';
import { useLocation } from '../api/locationService';

const Header: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const { latitude, longitude } = useLocation();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const fetchedStudent = await getStudentById();
        setStudent(fetchedStudent);
      } catch (error) {
        console.error('An error occurred while fetching student data:', error);
      }
    };

    fetchStudent();
  }, []);

  const getInitial = () => {
    if (student?.first_name) {
      return student.first_name.charAt(0).toUpperCase();
    }
    return '';
  };

  return (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Hi {student ? student.first_name : '!'}
        </Text>
        <Text style={styles.wave}>👋</Text>
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationText}>
          {latitude && longitude 
            ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            : 'Getting location...'}
        </Text>
      </View>
      <View style={styles.profilePic}>
        <Text style={styles.initial}>{getInitial()}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    position: 'absolute',
    top: 0,
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
    fontFamily: 'System',
  },
  wave: {
    fontSize: 28,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 5,
    left: 20,
  },
  locationText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
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
    overflow: 'hidden',
  },
  initial: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Header; 