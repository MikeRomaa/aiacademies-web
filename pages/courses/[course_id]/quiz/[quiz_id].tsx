import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { Quiz } from '~/types/api'; // Ensure this matches the actual API response
import { PageHeader } from '~/components/PageHeader';
import { CodeBlock } from '~/components/CodeBlock'; // Ensure you have this component if needed

interface QuizPageProps {
    quiz: Quiz;
    nextQuiz?: Quiz;
}

const QuizPage: NextPage<QuizPageProps> = ({ quiz, nextQuiz }) => {
    // Since quiz.content does not exist, you can use a placeholder or alternative content if needed
    const quizContent = ''; // Or another fallback approach if needed

    return (
        <>
            <PageHeader title={quiz.title} subtitle={`Quiz #${quiz.number}`} />
            <div className="container py-10">
                <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                    {quizContent}
                </Markdown>
                {nextQuiz && (
                    <Link href={`/courses/${nextQuiz.course_id}/quiz/${nextQuiz.id}`}>
                        <a className="btn btn-primary">Next Quiz</a>
                    </Link>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<QuizPageProps> = async ({ params }) => {
    const { quiz_id } = params!;
    const quizResponse = await axios.get<Quiz>(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz_id}/`);
    const quiz = quizResponse.data;

    // Fetch the next quiz as needed
    // Assuming you have a mechanism to get the next quiz ID, adjust this as necessary
    const nextQuizId = quiz.next_quiz_id; // Make sure this matches the API response structure
    const nextQuizResponse = nextQuizId
        ? await axios.get<Quiz>(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${nextQuizId}/`)
        : { data: null };
    const nextQuiz = nextQuizResponse.data;

    return { props: { quiz, nextQuiz } };
};

export default QuizPage;
