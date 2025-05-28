import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocation } from '../api/locationService';
import { postCheckOut } from '../api/attendanceService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CheckOutScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { latitude, longitude } = useLocation();

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      if (latitude === null || longitude === null) {
        throw new Error('Location data is not available. Please try again.');
      }

      await postCheckOut(latitude, longitude);
      navigation.replace('Feedback');
    } catch (error) {
      console.error('An error occurred during check-out:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during check-out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.title}>Ready to Leave?</Text>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCheckOut}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.spinner} />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>👋</Text>
              <Text style={styles.buttonText}>Check Out</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#48c6ef',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: 'white',
  },
});

export default CheckOutScreen; 