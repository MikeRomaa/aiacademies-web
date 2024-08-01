import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import CodeBlock from '~/components/CodeBlock';
import { Course, Quiz } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import Link from 'next/link';

interface QuizPageProps {
    courseName: string;
    quiz: Quiz;
    nextQuiz: Quiz | null;
}

const QuizPage: NextPage<QuizPageProps> = ({ courseName, quiz, nextQuiz }) => (
    <>
        <PageHeader title={courseName} subtitle={`${quiz.number ?? 0}. ${quiz.title}`} />
        <div className="container py-10">
            <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                {/* Quiz content */}
            </Markdown>
            {nextQuiz && (
                <div className="mt-10">
                    <Link href={`/courses/${quiz.course_id}/quiz/${nextQuiz.id}`}>
                        <a className="btn btn-primary">Next Quiz: {nextQuiz.title}</a>
                    </Link>
                </div>
            )}
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const quizId = params!.quiz_id as string;
    const courseId = params!.course_id as string;

    // Fetch the current quiz
    const quiz = await axios.get<Quiz>(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}/`);
    const course = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/`);

    // Fetch all quizzes to determine the next quiz
    const quizzes = await axios.get<Quiz[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/quizzes/`);
    const sortedQuizzes = quizzes.data.sort((a, b) => a.number - b.number);
    const currentQuizIndex = sortedQuizzes.findIndex(q => q.id === quiz.data.id);
    const nextQuiz = sortedQuizzes[currentQuizIndex + 1] || null;

    return {
        props: {
            courseName: course.data.name,
            quiz: quiz.data,
            nextQuiz: nextQuiz,
        }
    };
};

export default QuizPage;
