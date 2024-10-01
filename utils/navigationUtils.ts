import { Course, TypedCourseUnit, Lesson, Quiz } from '~/types/api';
import { useSession } from '~/utils/sessionHooks';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useNextNavigation = (
    course: Course,
    currentUnitId: number,
    currentType: 'lesson' | 'quiz'
) => {
    const router = useRouter();
    const session = useSession();

    // Combine and sort units by their number
    const sortedUnits: TypedCourseUnit[] = useMemo(() => {
        const lessons: TypedCourseUnit[] = course.lessons.map(lesson => ({
            ...lesson,
            type: 'lesson',
        }));

        const quizzes: TypedCourseUnit[] = course.quizzes.map(quiz => ({
            ...quiz,
            type: 'quiz',
        }));

        return [...lessons, ...quizzes].sort((a, b) => a.number - b.number);
    }, [course]);

    // Find the index of the current unit
    const currentIndex = sortedUnits.findIndex(
        unit => unit.id === currentUnitId && unit.type === currentType
    );

    // Determine the next unit
    const nextUnit = sortedUnits[currentIndex + 1] || null;

    // Handle navigation to the next unit
    const handleNext = () => {
        if (!nextUnit) return;

        if (nextUnit.type === 'quiz' && !session) {
            alert('You must be signed in to attempt the quiz.');
            router.push('/signin'); // Redirect to sign-in page
            return;
        }

        if (nextUnit.type === 'lesson') {
            router.push(`/courses/${course.id}/lesson/${nextUnit.id}`);
        } else if (nextUnit.type === 'quiz') {
            router.push(`/courses/${course.id}/quiz/${nextUnit.id}`);
        }
    };

    return { nextUnit, handleNext };
};
