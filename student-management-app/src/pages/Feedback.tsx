import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { postMood, MoodType } from '../api/moodService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
};

const Feedback: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodType | null>(null);

  const handleMoodPress = async (emotion: MoodType) => {
    try {
      setLoading(true);
      setActiveMood(emotion);
      await postMood(emotion, 'checkout');
      setTimeout(() => {
        setActiveMood(null);
        navigation.replace('CheckOutGreeting');
      }, 1000);
    } catch (error) {
      console.error('Error posting mood:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while saving your mood.');
      setActiveMood(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.moodCard}>
        <Text style={styles.title}>How was your day at work?</Text>
        <View style={styles.moodButtons}>
          {(['happy', 'neutral', 'sad'] as const).map((mood) => (
            <TouchableOpacity
              key={mood}
              style={styles.moodButton}
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
              {activeMood === mood && (
                <ActivityIndicator size="small" color="#8B7ED8" />
              )}
            </TouchableOpacity>
          ))}
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
});

export default Feedback;