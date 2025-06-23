import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CheckOutGreeting: React.FC<Props> = ({ navigation }) => {
  const [welcomeText, setWelcomeText] = useState('');

  useEffect(() => {
    const messages = [
      "Great job today!",
      "Enjoy your time off!",
      "Relax and recharge!",
      "See you next time!",
      "Take care!",
      "Have a wonderful evening!",
      "Thanks for your hard work!",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setWelcomeText(randomMessage);

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
      setTimeout(() => {
        BackHandler.exitApp();
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // [navigation]

  // Use the same Lottie animation logic as in WelcomeGreeting
  const lottieSources = [
    'https://lottie.host/8f2c312f-9100-4ff7-be99-99a8bd90a894/TbP8d42cek.lottie',
    'https://lottie.host/d70c9115-b567-43c0-b39d-07383205b216/8CBoIhDskY.lottie',
    'https://lottie.host/e65fc1fe-3f05-458a-a191-ed18cf9b9e5d/Wi8X4nh4pZ.lottie',
  ];
  const [lottieIndex] = useState(() => Math.floor(Math.random() * lottieSources.length));

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LottieView
          source={{ uri: lottieSources[lottieIndex] }}
          autoPlay
          loop
          style={{ width: 180, height: 180, alignSelf: 'center', marginBottom: 20 }}
        />
        <Text style={styles.text}>{welcomeText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '100%',
    padding: 30,
    paddingVertical: 45,
    borderRadius: 18,
  },
  text: {
    color: '#000',
    fontSize: 48,
    textAlign: 'center',
    fontWeight: '600',
  },
  // Add styles for colorful mood buttons if you use them here in the future:
  happyBtn: {
    backgroundColor: '#f0fff4', // light green
    borderRadius: 24,
    padding: 18,
  },
  neutralBtn: {
    backgroundColor: '#fffaf0', // light yellow
    borderRadius: 24,
    padding: 18,
  },
  sadBtn: {
    backgroundColor: '#ebf8ff', // light blue
    borderRadius: 24,
    padding: 18,
  },
});

export default CheckOutGreeting;