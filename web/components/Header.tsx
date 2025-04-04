import React, { useEffect } from "react";
import RealTimeClock from "../components/RealTimeClock";
import { getStudentById } from "../api/studentService";
import { Student } from "../types/student";

import ProfilePicture from "../assets/user.jpg";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const Header: React.FC = () => {
  const [student, setStudent] = React.useState<Student | null>(null);
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const student = await getStudentById(1);
        setStudent(student);
      } catch (error) {
        console.error("Failed to fetch student:", error);
      }
    };

    fetchStudent();
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{ position: "fixed", top: 0, left: 0, right: 0 }}
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
