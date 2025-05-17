import React, { useEffect } from "react";
import RealTimeClock from "../components/RealTimeClock";
import { getStudentById } from "../api/studentService";
import { Student } from "../types/student";

import ProfilePicture from "../assets/profile_male.png";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import { validateBearerToken } from "../api/bearerService";

const Header: React.FC = () => {
  const [student, setStudent] = React.useState<Student | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const student = await getStudentById(1);
        setStudent(student);
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
    fetchToken();
  }, []);

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
