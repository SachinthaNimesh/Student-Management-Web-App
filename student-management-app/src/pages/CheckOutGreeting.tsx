import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CheckOutGreeting: React.FC<Props> = ({ navigation }) => {
  const [welcomeText, setWelcomeText] = useState('');

  useEffect(() => {
    const messages = [
      "Great job today! 🎉",
      "Enjoy your time off! 🌟",
      "Relax and recharge! 😀",
      "See you next time! 👋",
      "Take care! 🌞",
      "Have a wonderful evening! 🌙",
      "Thanks for your hard work! 👍",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setWelcomeText(randomMessage);

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
      setTimeout(() => {
        BackHandler.exitApp();
      }, 500); // Give time for navigation before exit
    }, 3000);

    return () => clearTimeout(timer);
  }, []);// [navigation]

  return (
    <View style={styles.container}>
      <View style={styles.card}>
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

export default CheckOutGreeting;