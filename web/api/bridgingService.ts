// web/api/bridgingService.ts

declare global {
    interface Window {
        studentData?: {
            student_id: string;
            API_KEY: string;
            latitude: number;
            longitude: number;
        };
    }
}

export const getStudentDataFromBridge = (): {
    student_id: string;
    API_KEY: string;
    latitude: number;
    longitude: number;
} | null => {
    if (typeof window !== "undefined" && window.studentData) {
        // Always return a fresh copy to avoid stale references
        return { ...window.studentData };
    }
    return null;
};
