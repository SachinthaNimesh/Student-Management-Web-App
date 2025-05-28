import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { postMood, MoodType } from '../api/moodService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const popupContent: Record<
  MoodType,
  {
    emoji: string;
    title: string;
    message: string;
    strategies?: { icon: string; title: string; desc: string }[];
  }
> = {
  happy: {
    emoji: '🌟',
    title: 'You are Happy!',
    message: "That's great!",
  },
  neutral: {
    emoji: '🌱',
    title: 'You feel Okay',
    message: 'Maybe try something simple to refresh.',
    strategies: [
      { icon: '💨', title: 'Breathe', desc: 'Take a deep breath.' },
      { icon: '🚶‍♀️', title: 'Walk', desc: 'Go for a short walk.' },
      { icon: '🎵', title: 'Music', desc: 'Listen to your favorite song.' },
    ],
  },
  sad: {
    emoji: '🤗',
    title: 'You feel Sad',
    message: "It's okay to feel sad. Try to take care of yourself.",
    strategies: [
      { icon: '💨', title: 'Breathe', desc: 'Take a deep breath.' },
      { icon: '📝', title: 'Write', desc: 'Write down your feelings.' },
      { icon: '💙', title: 'Help', desc: 'Talk to someone you trust.' },
      { icon: '🛁', title: 'Rest', desc: 'Take a break and relax.' },
    ],
  },
};

const Emotion: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<MoodType | null>(null);

  const handleMoodPress = async (emotion: MoodType) => {
    try {
      setLoading(true);
      await postMood(emotion, 'checkin');
      setPopup(emotion);
    } catch (error) {
      console.error('Error posting mood:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while saving your mood.');
    } finally {
      setLoading(false);
    }
  };

  const moodEmojis = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
  };

  return (
    <View style={styles.container}>
      <View style={styles.moodCard}>
        <TouchableOpacity onPress={() => navigation.replace('CheckOut')}>
          <Text style={styles.title}>How are you feeling Now?</Text>
        </TouchableOpacity>
        <View style={styles.moodButtons}>
          {(['happy', 'neutral', 'sad'] as const).map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[styles.moodButton, popup === mood && styles.selectedMood]}
              onPress={() => handleMoodPress(mood)}
              disabled={loading}
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
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal
        visible={popup !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPopup(null)}
      >
        {popup && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.popupEmoji}>{popupContent[popup].emoji}</Text>
              <Text style={styles.popupTitle}>{popupContent[popup].title}</Text>
              <Text style={styles.popupMessage}>
                {popupContent[popup].message}
              </Text>

              {popupContent[popup].strategies && (
                <View style={styles.strategies}>
                  {popupContent[popup].strategies!.map((strategy, index) => (
                    <View key={index} style={styles.strategyItem}>
                      <Text style={styles.strategyTitle}>
                        {strategy.icon} {strategy.title}
                      </Text>
                      <Text style={styles.strategyDesc}>{strategy.desc}</Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setPopup(null);
                }}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
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
  checkoutCard: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    padding: 20,
  },
  checkoutButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  homeIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A6A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 320,
    alignItems: 'center',
  },
  popupEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#4A4A6A',
  },
  popupMessage: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 25,
    textAlign: 'center',
  },
  strategies: {
    width: '100%',
  },
  strategyItem: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B7ED8',
  },
  strategyTitle: {
    color: '#8B7ED8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  strategyDesc: {
    color: '#6B6B6B',
    fontSize: 13,
  },
  modalButton: {
    backgroundColor: '#8B7ED8',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Emotion; 