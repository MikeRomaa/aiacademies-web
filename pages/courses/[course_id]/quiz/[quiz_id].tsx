import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { PageHeader } from '~/components/PageHeader';
import { Quiz, QuizQuestion, Course } from '~/types/api';

interface QuizPageProps {
    quiz: Quiz;
    course: Course;
    nextQuiz?: Quiz;
}

const QuizPage: NextPage<QuizPageProps> = ({ quiz, course, nextQuiz }) => (
    <>
        <PageHeader title={course.name} subtitle={`${quiz.number}. ${quiz.title}`} />
        <div className="container py-10">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Quiz Content</h2>
                <Markdown>{quiz.content}</Markdown>
                {nextQuiz && (
                    <div className="mt-6 text-center">
                        <a href={`/courses/${course.id}/quizzes/${nextQuiz.id}`} className="text-blue-500 hover:underline">
                            Next Quiz: {nextQuiz.title}
                        </a>
                    </div>
                )}
            </div>
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const quiz_id = params!.quiz_id as string;
    const course_id = params!.course_id as string;

    const [quizResponse, courseResponse] = await Promise.all([
        axios.get<Quiz>(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz_id}/`),
        axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`)
    ]);

    const quiz = quizResponse.data;
    const course = courseResponse.data;
    const nextQuiz = course.quizzes.find((q) => q.number === quiz.number + 1);

    return { props: { quiz, course, nextQuiz: nextQuiz ?? null } };
};

export default QuizPage;
