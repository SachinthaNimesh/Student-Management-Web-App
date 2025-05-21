// web/api/bridgingService.ts

declare global {
    interface Window {
        studentData?: { student_id: string; API_KEY: string };
    }
}

export const getStudentDataFromBridge = (): { student_id: string; API_KEY: string } | null => {
    if (typeof window !== "undefined" && window.studentData) {
        return window.studentData;
    }
    console.warn("Student data is not available on the window object.");
    return null;
};

