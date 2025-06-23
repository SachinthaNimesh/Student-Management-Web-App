import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
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
  const [showThankYou, setShowThankYou] = useState<MoodType | null>(null);
  const [animatingMood, setAnimatingMood] = useState<MoodType | null>(null);
  const emojiAnim = useRef({
    happy: new Animated.Value(0),
    neutral: new Animated.Value(0),
    sad: new Animated.Value(0),
  }).current;

  const handleMoodPress = async (emotion: MoodType) => {
    setAnimatingMood(emotion);
    // Animate text opacity out
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(emojiAnim[emotion], {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(emojiAnim[emotion], {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(async () => {
        setAnimatingMood(null);
        setActiveMood(emotion);
        setLoading(true);
        try {
          await postMood(emotion, 'checkin');
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
          setActiveMood(null);
        }
      });
    }, 150); // short delay to allow text to fade out before emoji slides
  };

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
          <Text style={styles.title}>How are you?</Text>
          <View style={styles.moodButtons}>
            {(['happy', 'neutral', 'sad'] as const).map((mood) => {
              const isAnimating = animatingMood === mood;
              return (
                <TouchableOpacity
                  key={mood}
                  style={[styles.moodButton]}
                  onPress={() => handleMoodPress(mood)}
                  disabled={loading || activeMood !== null || isAnimating}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 120, minHeight: 64 }}>
                    <Animated.View
                      style={[
                        styles.moodEmoji,
                        mood === 'happy'
                          ? styles.happy
                          : mood === 'neutral'
                          ? styles.neutral
                          : styles.sad,
                        isAnimating && {
                          transform: [
                            {
                              translateX: emojiAnim[mood].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 120], // slide right then back
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Text style={styles.emojiText}>{moodEmojis[mood]}</Text>
                    </Animated.View>
                    {!isAnimating && (
                      <>
                        <Text style={styles.moodText}>
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </Text>
                        <View style={styles.flexGrow} />
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
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
        {/* Exit button in left bottom corner */}
        <View style={exitButtonContainerStyle}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.replace('CheckOut')}
            activeOpacity={0.8}
          >
            <Text style={{fontSize: 28}} role="img" aria-label="exit">🚪</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D2D2D',
    marginBottom: 25,
    alignSelf: 'center',
  },
  moodButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
    marginBottom: 24,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 0,
    marginHorizontal: 0,
    minWidth: 120,
    minHeight: 64,
    shadowColor: '#22543d',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  flexGrow: {
    flex: 1,
  },
  selectedMood: {
    backgroundColor: 'rgba(232, 230, 255, 1)',
    borderColor: 'rgba(139, 126, 216, 0.6)',
  },
  moodEmoji: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    backgroundColor: '#fff',
    shadowColor: '#b7e4c7',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  emojiText: {
    fontSize: 44,
    textAlign: 'center',
    color: '#22543d',
    width: 60,
    height: 60,
    textAlignVertical: 'center',
    lineHeight: 60,
    includeFontPadding: false,
  },
  moodText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#22543d',
    letterSpacing: 0.2,
    opacity: 0.92,
  },
  happy: {
    backgroundColor: '#f0fff4',
    borderColor: '#68d391',
    borderWidth: 0,
  },
  neutral: {
    backgroundColor: '#fffaf0',
    borderColor: '#fbb6ce',
    borderWidth: 0,
  },
  sad: {
    backgroundColor: '#ebf8ff',
    borderColor: '#90cdf4',
    borderWidth: 0,
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
  exitButton: {
    width: 64,
    height: 64,
    borderRadius: 28,
    backgroundColor: '#FF8A9B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
const fabContainerStyle = {
  position: 'absolute' as const,
  bottom: -56,
  right: -16,
  zIndex: 100,
};

// Exit button container for left bottom corner
const exitButtonContainerStyle = {
  position: 'absolute' as const,
  bottom: -26,
  left: 16,
  zIndex: 100,
};

export default Emotion;