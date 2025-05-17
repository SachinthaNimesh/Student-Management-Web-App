import React, { useEffect,useState } from "react";
import RealTimeClock from "../components/RealTimeClock";
import { getStudentById } from "../api/studentService";
import { Student } from "../types/student";

import ProfilePicture from "../assets/profile_male.png";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
<<<<<<< HEAD
// import { validateBearerToken } from "../api/bearerService";

const Header: React.FC = () => {
  const [student, setStudent] = React.useState<Student | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
=======
import { getStudentByIdNative } from "../api/getStudentService";

const Header: React.FC = () => {
  const [student, setStudent] = React.useState<Student | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchstudentId = async () => {
      const studentId = await getStudentByIdNative();
      setStudentId(studentId);
      console.log("Fetched studentId from getStudentByIdNative:", studentId);
    };

    fetchstudentId();
  }, []); // Fetch studentId on component mount
>>>>>>> 4edc486f94f2f238efb3acbfbb46c9847895d8a1

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (studentId !== null) {
          const student = await getStudentById(studentId);
          console.log("Fetched student details from getStudentById:", student);
          setStudent(student);
        } else {
          console.error("Student ID is null");
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
      }
    };

    const fetchToken = () => {
      // Simulate fetching the token from the request object
      const authHeader = document.cookie.split("; ").find(row => row.startsWith("Authorization="));
      const token = authHeader ? authHeader.split("=")[1] : null;
      setToken(token);
    };

    fetchStudent();
<<<<<<< HEAD
    fetchToken();
  }, []);
=======
  }, [studentId]); // Fetch student details when studentId changes
>>>>>>> 4edc486f94f2f238efb3acbfbb46c9847895d8a1

  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{ position: "fixed", top: "20px", left: 0, right: 0 }}
      >
        <Box
          sx={{
            bgcolor: "transparent",
            height: "10vh",
            width: "100%",
            marginTop: "2vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              padding: "0 1rem",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontFamily: "Poppins, sans-serif",
                  margin: 0,
                }}
              >
                Hi {student ? student.first_name : "!"} 👋
              </h1>
              <RealTimeClock />
              <p style={{ fontSize: "0.8rem", color: "gray" }}>
                Token: {token || "No token available"}
              </p>
            </Box>
            <Box>
              <img
                src={ProfilePicture}
                alt="Profile"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Header;
