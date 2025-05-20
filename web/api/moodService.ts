import { useCallback } from "react";
import { API_URL, TEST_KEY } from "../config/config";

export function useMoodService() {
  const sendMood = useCallback(
    async (
      student_id: number,
      emotion: string,
      is_daily: boolean
    ): Promise<void> => {
      console.log("sendMood input:", { student_id, emotion, is_daily });
      try {
        const response = await fetch(`${API_URL}/post-mood`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "student-id": student_id.toString(),
            "Test-Key": TEST_KEY,
          },
          body: JSON.stringify({
            emotion,
            is_daily,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to send mood data:", errorText);
          throw new Error("Failed to send mood data");
        }

        console.log("Mood data sent successfully");
      } catch (error) {
        console.error("Error in sendMood:", error);
        throw error;
      }
    },
    []
  );

  return { sendMood };
}
