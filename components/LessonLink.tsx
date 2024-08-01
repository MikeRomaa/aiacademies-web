import React from 'react';
import Link from 'next/link';
import { Lesson } from '~/types/api';

interface LessonLinkProps {
    lesson: Lesson;
    courseId: number;
}

const LessonLink: React.FC<LessonLinkProps> = ({ lesson, courseId }) => (
    <Link href={`/courses/${courseId}/lesson/${lesson.id}`}>
        <a className="block p-4 mb-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
            <h3 className="text-lg font-semibold">{lesson.title}</h3>
            <p>Duration: {lesson.duration_minutes} minutes</p>
            <p>Points: {lesson.points}</p>
        </a>
    </Link>
);

export default LessonLink;
