import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLocation } from "../api/locationService";
import { postCheckOut } from "../api/attendanceService";
import NetInfo from "@react-native-community/netinfo";
import LottieView from 'lottie-react-native';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CheckOutScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showNoInternet, setShowNoInternet] = useState(false);
  const { latitude, longitude } = useLocation();

  useEffect(() => {
    if (!showNoInternet) return;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setShowNoInternet(false);
      }
    });
    return () => unsubscribe();
  }, [showNoInternet]);

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      if (latitude == null || longitude == null) {
        setLoading(false);
        return alert(
          "Location data is not available. Please enable location services and try again."
        );
      }

      await postCheckOut(latitude, longitude);
      navigation.replace("Feedback");
    } catch (error: any) {
      if (
        typeof error?.message === "string" &&
        (error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("internet") ||
          error.message.toLowerCase().includes("connection") ||
          error.message.toLowerCase().includes("failed to fetch"))
      ) {
        setShowNoInternet(true);
      } else {
        console.error("An error occurred during check-out:", error);
        alert(
          error instanceof Error
            ? error.message
            : "An error occurred during check-out. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (showNoInternet) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.container,
          {
            backgroundColor: "#667eea",
            zIndex: 999,
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
          },
        ]}
      >
        <View />
        <View style={styles.noInternetCard}>
          <Text style={styles.noInternetEmoji}>🛜</Text>
          <Text style={styles.noInternetTitle}>No Internet Connection</Text>
          <Text style={styles.noInternetMsg}>
            Turn Mobile Data or Wifi On 🛜
          </Text>
          <Text style={styles.noInternetWait}>Waiting for connection...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Lottie animation for home */}
        <View style={{ width: 120, height: 120, marginBottom: 20 }}>
          {/* @ts-ignore */}
          <LottieView
            source={{
              uri: "https://lottie.host/e0fe36ea-db79-48fc-b40a-8c550970cc09/iKa9zRuPni.lottie",
            }}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
        </View>
        <Text style={styles.title}>Leaving?</Text>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCheckOut}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.spinner} />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Out</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#667eea",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 25,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
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
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#e53935",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopColor: "white",
  },
  noInternetCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
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
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  noInternetMsg: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  noInternetWait: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
});

export default CheckOutScreen;
