import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const WelcomeGreeting: React.FC<Props> = ({ navigation }) => {
  const [welcomeText, setWelcomeText] = useState('');

  useEffect(() => {
    const messages = [
      "Let's do this!",
      "Good morning!",
      "We can do it!",
      "Stay happy!",
      "You are great!",
      "Today will be good!",
      "Keep smiling!",
      "Be your best!",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setWelcomeText(randomMessage);

    const timer = setTimeout(() => {
      navigation.replace('Emotions');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LottieView
          source={{
        uri: [
          'https://lottie.host/8f2c312f-9100-4ff7-be99-99a8bd90a894/TbP8d42cek.lottie',
          'https://lottie.host/d70c9115-b567-43c0-b39d-07383205b216/8CBoIhDskY.lottie',
          'https://lottie.host/664596c3-11a3-458a-831b-5ae7615e4bc7/LgsMRSFI5p.lottie',
          'https://lottie.host/e65fc1fe-3f05-458a-a191-ed18cf9b9e5d/Wi8X4nh4pZ.lottie'
        ][Math.floor(Math.random() * 4)]
          }}
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
});

export default WelcomeGreeting;