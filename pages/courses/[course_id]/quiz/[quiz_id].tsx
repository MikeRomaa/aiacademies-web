import React, { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { Field, Form, Formik } from 'formik';
import classNames from 'classnames';
import { PageHeader } from '~/components/PageHeader';
import { Input, Radio } from '~/components/Forms';
import CodeBlock from '~/components/CodeBlock';
import { Button } from '~/components/Button';
import axiosInstance from '~/utils/axiosInstance';
import { Course, Lesson, Quiz, QuizAttempt } from '~/types/api';
import Spinner from '~/components/Spinner';

interface QuizPageProps {
    courseName: string;
    courseId: number;
    quiz: Quiz;
    nextLessonId?: number;
    nextQuizId?: number;
}

const QuizPage: NextPage<QuizPageProps> = ({ courseName, courseId, quiz, nextLessonId, nextQuizId }) => {
    const [review, setReview] = useState<QuizAttempt | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAttemptReview();
    }, []);

    const getAttemptReview = useCallback(() => {
        axiosInstance
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz.id}/review/`)
            .then(({ data }) => setReview(data))
            .finally(() => setLoading(false));
    }, [setReview]);

    const handleNextPage = () => {
        if (nextQuizId) {
            window.location.href = `/courses/${courseId}/quiz/${nextQuizId}`;
        } else if (nextLessonId) {
            window.location.href = `/courses/${courseId}/lessons/${nextLessonId}`;
        }
    };

    if (loading) {
        return (
            <div className="h-96 bg-white flex place-items-center">
                <Spinner />
            </div>
        );
    }

    if (review) {
        return (
            <>
                <PageHeader title={courseName} subtitle={`${quiz.number ?? 0}. ${quiz.title}`} />
                <div className="container py-10">
                    <h3 className="font-medium">Attempt Score: {review.score}%</h3>
                    {quiz.questions.map((question, i) => (
                        <section className="flex mb-8" key={i}>
                            <div>
                                {question.context && (
                                    <Markdown className="markdown-body max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                                        {question.context}
                                    </Markdown>
                                )}
                                <p className="font-medium">{i + 1}. {question.question}</p>
                                {question.multiple_choice && (
                                    <ul>
                                        {question.choices?.map((choice) => (
                                            <li key={choice} className="list-outside list-disc ml-5">{choice}</li>
                                        ))}
                                    </ul>
                                )}
                                <p className={classNames('font-medium', {
                                    'text-emerald-600': review.answers[i].trim() === review.questions[i].correct_answer,
                                    'text-red-600': review.answers[i].trim() !== review.questions[i].correct_answer,
                                })}>Your answer: {review.answers[i]}</p>
                                {review.answers[i].trim() === review.questions[i].correct_answer && (
                                    <p className="text-emerald-600 font-medium">Correct answer: {review.questions[i].correct_answer}</p>
                                )}
                            </div>
                        </section>
                    ))}
                    <Button className="bg-deepblue-700 text-white" onClick={() => setReview(undefined)}>Re-attempt Quiz</Button>
                    {nextLessonId || nextQuizId ? (
                        <Button className="bg-deepblue-700 text-white mt-4" onClick={handleNextPage}>Next {nextQuizId ? 'Quiz' : 'Lesson'}</Button>
                    ) : null}
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader title={courseName} subtitle={`${quiz.number ?? 0}. ${quiz.title}`} />
            <div className="container py-10">
                <Formik
                    initialValues={quiz.questions.reduce((acc, _, i) => {
                        acc[i] = undefined;
                        return acc;
                    }, {} as any)}
                    onSubmit={(values, { setSubmitting }) => {
                        axiosInstance
                            .post(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz.id}/`, values)
                            .then(() => {
                                setLoading(true);
                                getAttemptReview();
                            })
                            .finally(() => setSubmitting(false));
                    }}
                >
                    {({ errors, isSubmitting }) => (
                        <Form>
                            {quiz.questions.map((question, i) => (
                                <section className="flex mb-8" key={i}>
                                    <div>
                                        {question.context && (
                                            <Markdown className="markdown-body max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                                                {question.context}
                                            </Markdown>
                                        )}
                                        {question.multiple_choice ? (
                                            <Field
                                                required
                                                as={Radio}
                                                label={`${i + 1}. ${question.question}`}
                                                name={i}
                                                choices={question.choices?.map((choice) => ({ label: choice, value: choice })) ?? []}
                                            />
                                        ) : (
                                            <Field
                                                required
                                                as={Input}
                                                label={`${i + 1}. ${question.question}`}
                                                name={i}
                                            />
                                        )}
                                    </div>
                                </section>
                            ))}
                            <Button
                                className="bg-deepblue-700 text-white"
                                loading={isSubmitting}
                                disabled={!!Object.keys(errors).length}
                                type="submit"
                            >
                                Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const quiz = await axios.get<Quiz>(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${params!.quiz_id}/`);
        const course = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);

        const quizIndex = course.data.quizzes.findIndex(q => q.id === quiz.data.id);
        const nextQuizId = quizIndex >= 0 && quizIndex < course.data.quizzes.length - 1
            ? course.data.quizzes[quizIndex + 1].id
            : undefined;
        const nextLessonId = quizIndex >= 0 && course.data.lessons.length > 0
            ? course.data.lessons[0].id
            : undefined;

        return { props: { courseName: course.data.name, courseId: course.data.id, quiz: quiz.data, nextLessonId, nextQuizId } };
    } catch (error) {
        return { notFound: true };
    }
};

export default QuizPage;
