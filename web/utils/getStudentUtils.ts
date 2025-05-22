import { getStudentDataFromBridge } from "../api/bridgingService";

export const getStudentId = (): number | null => {
  const studentData = getStudentDataFromBridge();
  if (!studentData || !studentData.student_id) {
    console.error("Student data is not available.");
    return null;
  }
  return Number(studentData.student_id);
};