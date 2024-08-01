import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { Quiz as QuizType, Lesson } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';

interface QuizPageProps {
    quiz: QuizType;
    nextQuiz?: QuizType; // Use `undefined` instead of `null`
    nextLesson?: Lesson; // Include nextLesson for handling lessons
}

const QuizPage: NextPage<QuizPageProps> = ({ quiz, nextQuiz, nextLesson }) => {
    const quizContent = quiz.content || ''; // Ensure `quiz.content` is a string

    return (
        <>
            <PageHeader title={`Quiz ${quiz.number ?? 0}: ${quiz.title}`} />
            <div className="container py-10">
                <Markdown className="markdown-body prose max-w-none">
                    {quizContent}
                </Markdown>
                <div className="mt-4">
                    {nextQuiz && (
                        <a
                            href={`/courses/${nextQuiz.course_id}/quiz/${nextQuiz.id}`}
                            className="btn btn-primary"
                        >
                            Next Quiz: {nextQuiz.title}
                        </a>
                    )}
                    {nextLesson && (
                        <a
                            href={`/courses/${nextLesson.course_id}/lessons/${nextLesson.id}`}
                            className="btn btn-secondary"
                        >
                            Next Lesson: {nextLesson.title}
                        </a>
                    )}
                </div>
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
            axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`)
        ]);

        const course = courseResponse.data;
        const quizzes = course.quizzes;
        const lessons = course.lessons;

        const currentQuizIndex = quizzes.findIndex(q => q.id === quiz_id);
        const nextQuiz = currentQuizIndex + 1 < quizzes.length ? quizzes[currentQuizIndex + 1] : undefined;

        const currentLessonIndex = lessons.findIndex(l => l.id === quiz_id); // Change this to appropriate index for lesson
        const nextLesson = currentLessonIndex + 1 < lessons.length ? lessons[currentLessonIndex + 1] : undefined;

        return {
            props: {
                quiz: quizResponse.data,
                nextQuiz,
                nextLesson,
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
