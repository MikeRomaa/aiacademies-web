// utils/courseUtils.ts

import { Course, TypedCourseUnit, TypedLesson, TypedQuiz } from '~/types/api';

/**
 * Merges lessons and quizzes, tags them with type, and sorts them by number.
 * @param course The course object containing lessons and quizzes.
 * @returns An array of course units sorted by their number.
 */
export const getSortedCourseUnits = (course: Course): TypedCourseUnit[] => {
    const lessonsWithType: TypedLesson[] = course.lessons.map(lesson => ({
        ...lesson,
        type: 'lesson',
    }));

    const quizzesWithType: TypedQuiz[] = course.quizzes.map(quiz => ({
        ...quiz,
        type: 'quiz',
    }));

    const allUnits: TypedCourseUnit[] = [...lessonsWithType, ...quizzesWithType];

    return allUnits.sort((a, b) => a.number - b.number);
};

/**
 * Finds the next unit in the sorted list based on the current unit.
 * @param sortedUnits The sorted array of course units.
 * @param currentId The ID of the current unit.
 * @param currentType The type of the current unit ('lesson' or 'quiz').
 * @returns The next course unit or null if the current unit is the last one.
 */
export const getNextUnit = (
    sortedUnits: TypedCourseUnit[],
    currentId: number,
    currentType: 'lesson' | 'quiz'
): TypedCourseUnit | null => {
    const currentIndex = sortedUnits.findIndex(
        unit => unit.id === currentId && unit.type === currentType
    );

    if (currentIndex === -1 || currentIndex === sortedUnits.length - 1) {
        return null; // No next unit
    }

    return sortedUnits[currentIndex + 1];
};
