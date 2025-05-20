import { useCallback } from "react";
import { Mood } from "../types/mood";
import { API_URL } from "../config/config";

export function useMoodService() {
    const getMood = useCallback(async (id: number): Promise<Mood> => {
        const response = await fetch(`${API_URL}/get-mood`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch mood data');
        }

        return response.json();
    }, []);

    const sendMood = useCallback(async (student_id: number, emotion: string, is_daily: boolean): Promise<void> => {
        console.log('sendMood input:', { student_id, emotion, is_daily });
        try {
            const response = await fetch(`${API_URL}/post-mood`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Student-ID': student_id.toString() // Include student_id in headers
                },
                body: JSON.stringify({
                    emotion,
                    is_daily
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to send mood data:', errorText);
                throw new Error('Failed to send mood data');
            }

            console.log('Mood data sent successfully');
        } catch (error) {
            console.error('Error in sendMood:', error);
            throw error;
        }
    }, []);

    return { getMood, sendMood };
}
