import React from 'react';
import Link from 'next/link';
import { Quiz } from '~/types/api';

interface QuizLinkProps {
    quiz: Quiz;
    courseId: number;
}

const QuizLink: React.FC<QuizLinkProps> = ({ quiz, courseId }) => (
    <Link href={`/courses/${courseId}/quiz/${quiz.id}`}>
        <a className="block p-4 mb-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <p>Number: {quiz.number}</p>
        </a>
    </Link>
);

export default QuizLink;
