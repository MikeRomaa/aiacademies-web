// types/api.d.ts

// Lesson Interface
export interface Lesson {
    id: number;
    course_id: number;
    number: number;
    title: string;
    duration_minutes: number;
    points: number;
    content: string;
}

// QuizQuestion Interface
export interface QuizQuestion {
    context?: string;
    question: string;
    multiple_choice: boolean;
    choices?: string[];
    correct_answer: string;
}

// Quiz Interface
export interface Quiz {
    id: number;
    course_id: number;
    number: number;
    title: string;
    questions: QuizQuestion[];
}

// Course Interface
export interface Course {
    id: number;
    name: string;
    banner: string;
    featured: boolean;
    description: string;
    difficulty: number;
    enrolled: number;
    lessons: Lesson[];
    quizzes: Quiz[];
    total_duration: number;
}

// QuizAttempt Interface
export interface QuizAttempt {
    id: number;
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
}

// Discriminated Union Types for Frontend Navigation
export type TypedLesson = Lesson & { type: 'lesson' };
export type TypedQuiz = Quiz & { type: 'quiz' };
export type TypedCourseUnit = TypedLesson | TypedQuiz;
