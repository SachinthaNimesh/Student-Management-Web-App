import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "./src/components/Layout";
import Welcome from "./src/pages/Welcome";
import OTP from "./src/pages/OTP";
import CheckInScreen from "./src/pages/CheckInScreen";
import WelcomeGreeting from "./src/pages/WelcomeGreeting";
import Emotion from "./src/pages/Emotion";
import CheckOutScreen from "./src/pages/CheckOutScreen";
import Feedback from "./src/pages/Feedback";
import CheckOutGreeting from "./src/pages/CheckOutGreeting";
import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

type ScreenProps = {
  navigation: any;
  route: any;
};

const LAST_ROUTE_KEY = "LAST_ROUTE_NAME";

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | undefined>(undefined);
  const routeNameRef = useRef<string>("");

  useEffect(() => {
    // Load last route name from storage
    AsyncStorage.getItem(LAST_ROUTE_KEY).then((route) => {
      setInitialRoute(route || "Welcome");
    });
  }, []);

  if (!initialRoute) {
    // Optionally show a splash/loading screen here
    return null;
  }

  return (
    <NavigationContainer
      onReady={() => {
        // Save the initial route name
        routeNameRef.current = initialRoute;
      }}
      onStateChange={async (state) => {
        const currentRoute = getActiveRouteName(state);
        if (currentRoute && routeNameRef.current !== currentRoute) {
          routeNameRef.current = currentRoute;
          await AsyncStorage.setItem(LAST_ROUTE_KEY, currentRoute);
        }
      }}
    >
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen
          name="CheckIn"
          component={(props: ScreenProps) => (
            <Layout>
              <CheckInScreen {...props} />
            </Layout>
          )}
        />
        {["WelcomeGreeting", "Emotions", "CheckOut", "Feedback", "CheckOutGreeting"].map(
          (name: string) => (
            <Stack.Screen
              key={name}
              name={name}
              component={(props: ScreenProps) => (
                <Layout>
                  {(() => {
                    switch (name) {
                      case "WelcomeGreeting":
                        return <WelcomeGreeting {...props} />;
                      case "Emotions":
                        return <Emotion {...props} />;
                      case "CheckOut":
                        return <CheckOutScreen {...props} />;
                      case "Feedback":
                        return <Feedback {...props} />;
                      case "CheckOutGreeting":
                        return <CheckOutGreeting {...props} />;
                      default:
                        return null;
                    }
                  })()}
                </Layout>
              )}
            />
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Helper to get the current route name from navigation state
function getActiveRouteName(state: any): string | undefined {
  if (!state) return undefined;
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
}
