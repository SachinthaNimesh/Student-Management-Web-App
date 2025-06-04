export interface Mood {
    id: number;
    student_id: number;
    recorded_at: Date; // if sri lanka it will be stored with +5.30
    emotion: string;
    is_daily: boolean;
}