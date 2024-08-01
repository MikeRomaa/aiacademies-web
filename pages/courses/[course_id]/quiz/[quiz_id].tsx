import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { Quiz as QuizType } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';

interface QuizPageProps {
    quiz: QuizType;
    nextQuiz?: QuizType; // Use `undefined` instead of `null`
}

const QuizPage: NextPage<QuizPageProps> = ({ quiz, nextQuiz }) => {
    const quizContent = quiz.content || ''; // Ensure `quiz.content` is a string

    return (
        <>
            <PageHeader title={`Quiz ${quiz.number ?? 0}: ${quiz.title}`} />
            <div className="container py-10">
                <Markdown className="markdown-body prose max-w-none">
                    {quizContent}
                </Markdown>
                {nextQuiz && (
                    <div className="mt-4">
                        <a
                            href={`/courses/${nextQuiz.course_id}/quiz/${nextQuiz.id}`}
                            className="btn btn-primary"
                        >
                            Next Quiz: {nextQuiz.title}
                        </a>
                    </div>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<QuizPageProps> = async ({ params }) => {
    const quiz_id = parseInt(params!.quiz_id as string, 10);
    const course_id = parseInt(params!.course_id as string, 10);

    try {
        const [quizResponse, courseResponse] = await Promise.all([
            axios.get<QuizType>(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz_id}/`),
            axios.get<{ quizzes: QuizType[] }>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`) // Adjust endpoint if needed
        ]);

        const quizzes = courseResponse.data.quizzes;
        const currentIndex = quizzes.findIndex(q => q.id === quiz_id);
        const nextQuiz = currentIndex + 1 < quizzes.length ? quizzes[currentIndex + 1] : undefined;

        return {
            props: {
                quiz: quizResponse.data,
                nextQuiz,
            },
        };
    } catch (error) {
        // Handle error accordingly
        return {
            notFound: true,
        };
    }
};

export default QuizPage;
