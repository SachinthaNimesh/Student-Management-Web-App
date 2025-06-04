import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added import for useNavigate

const Welcome = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const loadFonts = async () => {
      const font = new FontFace(
        "Lobster-regular",
        "url(/assets/fonts/Lobster-Regular.ttf)" // Ensure this path matches the actual location of the font file
      );
      await font.load();
      document.fonts.add(font);
      setFontsLoaded(true);
    };

    loadFonts();

    const timer = setTimeout(() => {
      navigate("/checkin"); // Use navigate instead of window.location.href
    }, 3000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]); // Added navigate to dependency array

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.title}>Worky</h1>

        <p style={styles.subtitle}>Welcome!</p>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0052A5",
    width: "100vw", // Responsive width

    height: "100vh", // Responsive height

    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    flexDirection: "column" as const,
  },
  title: {
    fontSize: "90px",
    fontFamily: "Lobster-regular",
    fontWeight: "400",
    color: "#fff",
    margin: 0,
  },
  subtitle: {
    fontSize: "24px",
    color: "#fff",
    marginTop: "10px",
  },
};

export default Welcome;
