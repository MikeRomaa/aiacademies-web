import React from 'react';
import Link from 'next/link';
import { Quiz } from '~/types/api';
import { useSession } from '~/utils/sessionHooks';

interface QuizLinkProps {
    course: { id: number };
    quiz: Quiz;
}

export const QuizLink: React.FC<QuizLinkProps> = ({ course, quiz }) => {
    const session = useSession();

    if (session) {
        return (
            <Link href={`/courses/${course.id}/quiz/${quiz.id}`} passHref>
                <a className="block p-4 mb-2 bg-white rounded shadow hover:bg-gray-100 transition">
                    <h3 className="text-lg font-semibold">{quiz.number}. {quiz.title}</h3>
                </a>
            </Link>
        );
    }

    return (
        <div className="block p-4 mb-2 bg-white rounded shadow cursor-not-allowed">
            <h3 className="text-lg font-semibold">{quiz.number}. {quiz.title}</h3>
            <p className="text-sm text-red-500">Sign in to attempt this quiz</p>
        </div>
    );
};
