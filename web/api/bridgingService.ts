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
        const data = { ...window.studentData };
        // Ensure latitude and longitude are numbers, default to 0 if not
        return {
            ...data,
            latitude: typeof data.latitude === "number" ? data.latitude : 0,
            longitude: typeof data.longitude === "number" ? data.longitude : 0,
        };
    }
    return null;
};
