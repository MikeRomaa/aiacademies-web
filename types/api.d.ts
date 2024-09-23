export type BaseCourse = {
    id: number;
    num_lessons: number;
    name: string;
    banner: string;
    featured: boolean;
}

export type Course = {
    id: number;
    lessons: Lesson[];
    quizzes: Quiz[];
    total_duration: number;
    name: string;
    banner: string;
    featured: boolean;
    description: string;
    difficulty: number;
    enrolled: number;
}

export type CourseUnit = {
    id: number;
    course_id: number;
    number: number;
    title: string;
}

export interface Lesson extends CourseUnit {
    duration_minutes: number;
    points: number;
    content: string;
    next_content: { type: "lesson" | "quiz"; id: number; title: string } | null; // Update this line
}
export interface Quiz extends CourseUnit {
    questions: QuizQuestion[];
    next_content?: {
        type: 'lesson' | 'quiz';
        id: number;
        title: string;
    } | null; // Optionally add this line for quizzes
}

export type QuizQuestion = {
    context?: string;
    question: string;
    multiple_choice: boolean;
    choices?: string[];
    correct_answer?: string; // Add this line if it was missing
}

export type QuizAttempt = {
    id: number;
    course_id: number;
    title: string;
    questions: {
        context?: string;
        question: string;
        correct_answer: string;
    }[];
    answers: {
        [key: string]: string;
    };
    score: number;
    next_content: { type: "lesson" | "quiz"; id: number; title: string } | null; // Add this line if needed
};
