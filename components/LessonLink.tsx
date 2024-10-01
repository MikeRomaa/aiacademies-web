import React from 'react';
import Link from 'next/link';
import { Lesson } from '~/types/api';

interface LessonLinkProps {
    course: { id: number };
    lesson: Lesson;
}

export const LessonLink: React.FC<LessonLinkProps> = ({ course, lesson }) => (
    <Link href={`/courses/${course.id}/lesson/${lesson.id}`} passHref>
        <a className="block p-4 mb-2 bg-white rounded shadow hover:bg-gray-100 transition">
            <h3 className="text-lg font-semibold">{lesson.number}. {lesson.title}</h3>
            <p className="text-sm text-gray-500">{lesson.duration_minutes} min | {lesson.points} pts</p>
        </a>
    </Link>
);
