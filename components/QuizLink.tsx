// components/QuizLink.tsx

import React from 'react';
import Link from 'next/link';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { TypedQuiz, Course } from '~/types/api';
import { useSession } from '~/utils/sessionHooks';
import { Button } from '~/components/Button';

interface QuizLinkProps {
    course: Course;
    quiz: TypedQuiz;
}

export const QuizLink: React.FC<QuizLinkProps> = ({ course, quiz }) => {
    const session = useSession();
    if (session) {
        return (
            <Link href={`/courses/${course.id}/quiz/${quiz.id}`} passHref>
                <a className="relative flex flex-col lg:flex-row justify-between duration-200 hover:bg-slate-100 rounded px-4 py-3">
                    <span className="absolute -left-8 top-4 w-6 h-6 bg-slate-200 border-white border-4 rounded-full" />
                    <div>
                        <h5 className="font-medium mb-0">{quiz.number}. {quiz.title}</h5>
                    </div>
                    <span className="flex lg:inline-flex items-center text-deepblue-700">
                        Attempt Quiz <AiOutlineArrowRight size={21} className="ml-1"/>
                    </span>
                </a>
            </Link>
        );
    }
    return (
        <a className="relative flex flex-col lg:flex-row justify-between rounded px-4 py-3">
            <span className="absolute -left-8 top-4 w-6 h-6 bg-slate-200 border-white border-4 rounded-full" />
            <div>
                <h5 className="font-medium mb-0">{quiz.number}. {quiz.title}</h5>
            </div>
            <span className="flex lg:inline-flex items-center text-deepblue-700 font-medium">
                Sign in to attempt
            </span>
        </a>
    );
};
