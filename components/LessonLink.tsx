import React from 'react';
import Link from 'next/link';
import { Quiz } from '~/types/api';
import { Lesson } from '~/types/api';
import { useSession } from '~/utils/sessionHooks';

interface LessonLinkProps {
    course: Course;
    lesson: Lesson;
}

export const LessonLink: React.FC<LessonLinkProps> = ({ course, lesson }) => (
    <Link href={`/courses/${course.id}/lesson/${lesson.id}`} passHref>
        <a className="relative flex flex-col lg:flex-row justify-between duration-200 hover:bg-slate-100 rounded px-4 py-3">
            <span className="absolute -left-8 top-4 w-6 h-6 bg-slate-200 border-white border-4 rounded-full" />
            <div>
                <h5 className="font-medium mb-1">{lesson.number ?? 0}. {lesson.title}</h5>
                <div className="text-slate-400">
                    <span className="inline-flex items-center mr-5">
                        {/* Icon and duration here */}
                        {lesson.duration_minutes} min
                    </span>
                    <span className="inline-flex items-center">
                        {/* Icon and points here */}
                        {lesson.points} pts
                    </span>
                </div>
            </div>
            <span className="flex lg:inline-flex items-center text-deepblue-400">
                View Lesson
            </span>
        </a>
    </Link>
);

interface QuizLinkProps {
    course: Course;
    quiz: Quiz;
}

export const QuizLink: React.FC<QuizLinkProps> = ({ course, quiz }) => {
    const session = useSession();

    return (
        <Link href={`/courses/${course.id}/quiz/${quiz.id}`} passHref>
            <a className="relative flex flex-col lg:flex-row justify-between duration-200 hover:bg-slate-100 rounded px-4 py-3">
                <span className="absolute -left-8 top-4 w-6 h-6 bg-slate-200 border-white border-4 rounded-full" />
                <div>
                    <h5 className="font-medium mb-0">{quiz.number ?? 0}. {quiz.title}</h5>
                </div>
                <span className="flex lg:inline-flex items-center text-deepblue-700">
                    {session ? 'Attempt Quiz' : 'Sign in to attempt'}
                </span>
            </a>
        </Link>
    );
};
