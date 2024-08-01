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
    quiz: Quiz;
    nextItem: Lesson | Quiz | null;
}

const QuizPage: NextPage<QuizPageProps> = ({ courseName, quiz, nextItem }) => {
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

    if (loading) {
        return (
            <div className="h-96 bg-white flex place-items-center">
                <Spinner />
            </div>
        );
    }

    const handleSubmit = (values: any) => {
        axiosInstance
            .post(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz.id}/`, values)
            .then(() => {
                setLoading(true);
                getAttemptReview();
            });
    };

    const quizContent = quiz.content || ''; // Ensure `quiz.content` is a string

    return (
        <>
            <PageHeader title={courseName} subtitle={`${quiz.number ?? 0}. ${quiz.title}`} />
            <div className="container py-10">
                {review ? (
                    <>
                        <h3 className="font-medium">Attempt Score: {review.score}%</h3>
                        {quiz.questions.map((question, i) => (
                            <section className="flex mb-8" key={i}>
                                <div>
                                    {question.context && (
                                        <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
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
                    </>
                ) : (
                    <Formik
                        initialValues={quiz.questions.reduce((acc, _, i) => {
                            acc[i] = undefined;
                            return acc;
                        }, {} as any)}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, isSubmitting }) => (
                            <Form>
                                {quiz.questions.map((question, i) => (
                                    <section className="flex mb-8" key={i}>
                                        <div>
                                            {question.context && (
                                                <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
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
                                                    as={Input}
                                                    required
                                                    name={i}
                                                    label={`${i + 1}. ${question.question}`}
                                                />
                                            )}
                                        </div>
                                    </section>
                                ))}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={classNames('bg-deepblue-700 text-white', { 'opacity-50': isSubmitting })}
                                >
                                    Submit
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
            {nextItem && (
                <div className="bg-gray-100 p-4 rounded-lg mt-10">
                    <h3 className="text-lg font-semibold">Next Item</h3>
                    {nextItem.title}
                </div>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const quiz = await axios.get<Quiz>(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${params!.quiz_id}/`);
    const course = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);

    // Determine next item
    const lessons = course.data.lessons.sort((a, b) => a.number - b.number);
    const quizzes = course.data.quizzes.sort((a, b) => a.number - b.number);

    const currentIndex = quizzes.findIndex(q => q.id === parseInt(params!.quiz_id as string));
    const nextItem = currentIndex < quizzes.length - 1 ? quizzes[currentIndex + 1] : null;

    return {
        props: {
            courseName: course.data.name,
            quiz: quiz.data,
            nextItem,
        },
    };
};

export default QuizPage;
