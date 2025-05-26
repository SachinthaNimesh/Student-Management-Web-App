import React, { useEffect } from "react";
import RealTimeClock from "../components/RealTimeClock";
import { getStudentById } from "../api/studentService";
import { Student } from "../types/student";
import ProfilePictureMale from "../assets/profile_male.png";
import ProfilePictureFemale from "../assets/profile_female.png";
import { getStudentDataFromBridge } from "../api/bridgingService";

// Minimal CSS-in-JS for the header design
const headerStyles = {
  header: {
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    position: "relative" as const,
    zIndex: 2,
  },
  greeting: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  greetingH1: {
    color: "white",
    fontSize: 24,
    fontWeight: 600,
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  wave: {
    fontSize: 28,
    animation: "wave 2s ease-in-out infinite",
    display: "inline-block",
  },
  datetime: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.3)",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    color: "white",
    fontWeight: "bold" as const,
    overflow: "hidden",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover" as const,
    display: "block",
  },
};

const Header: React.FC = () => {
  const [student, setStudent] = React.useState<Student | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = getStudentDataFromBridge();
        if (!studentData || !studentData.student_id) {
          alert("Student data is not available. Please try again.");
          return;
        }
        
        const fetchedStudent = await getStudentById();
        setStudent(fetchedStudent);
      } catch (error) {
        console.error("An error occurred while fetching student data:", error);
      }
    };

    fetchStudent();
  }, []);

  // Get initials for fallback avatar
  const getInitial = () => {
    if (student && student.first_name) {
      return student.first_name.charAt(0).toUpperCase();
    }
    return "";
  };

  return (
    <header style={headerStyles.header}>
      <div style={headerStyles.greeting}>
        <h1 style={headerStyles.greetingH1}>
          Hi {student ? student.first_name : "!"}
        </h1>
        <span style={headerStyles.wave} role="img" aria-label="wave">
          👋
        </span>
        <div style={headerStyles.datetime}>
          <RealTimeClock />
        </div>
      </div>
      <div style={headerStyles.profilePic}>
        {student?.gender === "Male" || student?.gender === "Female" ? (
          <img
            src={
              student?.gender === "Male"
                ? ProfilePictureMale
                : ProfilePictureFemale
            }
            alt="Profile"
            style={headerStyles.profileImg}
          />
        ) : (
          getInitial()
        )}
      </div>
    </header>
  );
};

export default Header;
