import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { postMood, MoodType } from '../api/moodService';
import { postCheckOut } from '../api/attendanceService';
import { useLocation } from '../api/locationService';
import NetInfo from '@react-native-community/netinfo';
import FloatingActionButton from '../components/FAB';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
};

const Emotion: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodType | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { latitude, longitude } = useLocation();
  const [showNoInternet, setShowNoInternet] = useState(false);

  useEffect(() => {
    if (!showNoInternet) return;
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setShowNoInternet(false);
        setActiveMood(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [showNoInternet]);

  const handleMoodPress = async (emotion: MoodType) => {
    try {
      setLoading(true);
      setActiveMood(emotion);
      await postMood(emotion, 'checkin');
      setTimeout(() => {
        setActiveMood(null);
      }, 1000);
    } catch (error: any) {
      if (
        typeof error?.message === 'string' &&
        (
          error.message.toLowerCase().includes('network') ||
          error.message.toLowerCase().includes('internet') ||
          error.message.toLowerCase().includes('connection') ||
          error.message.toLowerCase().includes('failed to fetch')
        )
      ) {
        setShowNoInternet(true);
      } else {
        console.error('Error posting mood:', error);
        alert(error instanceof Error ? error.message : 'An error occurred while saving your mood.');
        setActiveMood(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Checkout flow extracted for FAB ---
  const handleEarlyCheckout = useCallback(async () => {
    try {
      setCheckoutLoading(true);
      setLoading(true);
      if (latitude === null || longitude === null) {
        setCheckoutLoading(false);
        setLoading(false);
        return alert('Location data is not available. Please try again.');
      }
      await postCheckOut(latitude, longitude);
      navigation.replace('Feedback');
    } catch (error: any) {
      if (
        typeof error?.message === 'string' &&
        (
          error.message.toLowerCase().includes('network') ||
          error.message.toLowerCase().includes('internet') ||
          error.message.toLowerCase().includes('connection') ||
          error.message.toLowerCase().includes('failed to fetch')
        )
      ) {
        setShowNoInternet(true);
      } else {
        console.error('Error during early checkout:', error);
        alert(error instanceof Error ? error.message : 'An error occurred during checkout. Please try again.');
      }
    } finally {
      setCheckoutLoading(false);
      setLoading(false);
    }
  }, [latitude, longitude, navigation]);


  if (showNoInternet) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.container, { backgroundColor: '#667eea', zIndex: 999, justifyContent: 'center', alignItems: 'center', padding: 0 }]}>
        <View/>
        <View style={styles.noInternetCard}>
          <Text style={styles.noInternetEmoji}>🛜</Text>
          <Text style={styles.noInternetTitle}>No Internet Connection</Text>
          <Text style={styles.noInternetMsg}>Turn Mobile Data or Wifi On 🛜</Text>
          <Text style={styles.noInternetWait}>Waiting for connection...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSpacer} />
      <View style={styles.contentWrapper}>
        <View style={styles.moodCard}>
          <Text style={styles.title}>How are you feeling Now?</Text>
          <View style={styles.moodButtons}>
            {(['happy', 'neutral', 'sad'] as const).map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[styles.moodButton]}
                onPress={() => handleMoodPress(mood)}
                disabled={loading || activeMood !== null}
              >
                <View
                  style={[
                    styles.moodEmoji,
                    mood === 'happy'
                      ? styles.happy
                      : mood === 'neutral'
                      ? styles.neutral
                      : styles.sad,
                  ]}
                >
                  <Text style={styles.emojiText}>{moodEmojis[mood]}</Text>
                </View>
                <Text style={styles.moodText}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </Text>
                <View style={styles.flexGrow} />
              </TouchableOpacity>
            ))}
          </View>
          
        </View>
        {/* FAB with checkout option */}
        <View style={fabContainerStyle}>
          <FloatingActionButton
            mainColor="#8B7ED8"
            actionColor="#FFD93D"
            labelColor="#4A4A6A"
            labelBgColor="#FFFBEA"
            backdropColor="#667eea"
            checkoutLoading={checkoutLoading}
            onCheckout={handleEarlyCheckout}
            navigation={navigation}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerSpacer: {
    height: 10,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    transform: [{ translateY: -50 }],
  },
  moodCard: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 25,
  },
  moodButtons: {
    gap: 15,
  },
  moodButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  flexGrow: {
    flex: 1,
  },
  selectedMood: {
    backgroundColor: 'rgba(232, 230, 255, 1)',
    borderColor: 'rgba(139, 126, 216, 0.6)',
  },
  moodEmoji: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emojiText: {
    fontSize: 20,
  },
  moodText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A4A6A',
  },
  happy: {
    backgroundColor: '#FFD93D',
  },
  neutral: {
    backgroundColor: '#A8E6CF',
  },
  sad: {
    backgroundColor: '#FF8A9B',
  },
  noInternetCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    minWidth: 260,
    maxWidth: 320,
    zIndex: 2,
  },
  noInternetEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  noInternetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  noInternetMsg: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  noInternetWait: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  callButton: {
    marginTop: 18,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
const fabContainerStyle = {
  position: 'absolute' as const,
  bottom: -56,
  right: -16,
  zIndex: 100,
};

export default Emotion;