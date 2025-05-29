import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Layout from './src/components/Layout';
import Welcome from './src/pages/Welcome';
import OTP from './src/pages/OTP';
import CheckInScreen from './src/pages/CheckInScreen';
import WelcomeGreeting from './src/pages/WelcomeGreeting';
import Emotion from './src/pages/Emotion';
import CheckOutScreen from './src/pages/CheckOutScreen';
import Feedback from './src/pages/Feedback';
import CheckOutGreeting from './src/pages/CheckOutGreeting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

const Stack = createNativeStackNavigator();

type ScreenProps = {
  navigation: any;
  route: any;
};

export default function App() {
  const [studentIdChecked, setStudentIdChecked] = useState(false);
  const [hasStudentId, setHasStudentId] = useState(false);

  useEffect(() => {
    const checkStudentId = async () => {
      const student_id = await AsyncStorage.getItem('student_id');
      setHasStudentId(!!student_id);
      setStudentIdChecked(true);
    };
    checkStudentId();
  }, []);

  if (!studentIdChecked) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        {/* Always register OTP screen, but redirect in Welcome if needed */}
        <Stack.Screen name="OTP" component={OTP} />
        {hasStudentId && (
          <Stack.Screen
            name="CheckIn"
            component={(props: ScreenProps) => (
              <Layout>
                <CheckInScreen {...props} />
              </Layout>
            )}
          />
        )}
        {[
          'WelcomeGreeting',
          'Emotions',
          'CheckOut',
          'Feedback',
          'CheckOutGreeting',
        ].map((name) => (
          <Stack.Screen
            key={name}
            name={name}
            component={(props: ScreenProps) => (
              <Layout>
                {(() => {
                  switch (name) {
                    case 'WelcomeGreeting':
                      return <WelcomeGreeting {...props} />;
                    case 'Emotions':
                      return <Emotion {...props} />;
                    case 'CheckOut':
                      return <CheckOutScreen {...props} />;
                    case 'Feedback':
                      return <Feedback {...props} />;
                    case 'CheckOutGreeting':
                      return <CheckOutGreeting {...props} />;
                    default:
                      return null;
                  }
                })()}
              </Layout>
            )}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
