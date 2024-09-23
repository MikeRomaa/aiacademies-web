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
import { Course, Quiz, QuizAttempt } from '~/types/api';
import Spinner from '~/components/Spinner';
import NextContentButton from '~/components/NextContentButton'; // Ensure to import this component

interface QuizPageProps {
    course: Course;
    quiz: Quiz;
}

const QuizPage: NextPage<QuizPageProps> = ({ courseName, quiz }) => {
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
                                    'text-emerald-600': review.answers[i].trim() === question.correct_answer,
                                    'text-red-600': review.answers[i].trim() !== question.correct_answer,
                                })}>Your answer: {review.answers[i]}</p>
                                {review.answers[i].trim() === question.correct_answer && (
                                    <p className="text-emerald-600 font-medium">Correct answer: {question.correct_answer}</p>
                                )}
                            </div>
                        </section>
                    ))}
                    <Button className="bg-deepblue-700 text-white" onClick={() => setReview(undefined)}>Re-attempt Quiz</Button>
                    <NextContentButton nextContent={review.next_content} courseId={course.id} /> {/* Access next_content from quiz */}
                </div>
            </>
        );
    }

    // Render quiz questions
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
    const quizResponse = await axios.get<Quiz>(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${params!.quiz_id}/`);
    const courseResponse = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);

    return {
        props: {
            courseName: courseResponse.data.name,
            quiz: quizResponse.data,
        }
    };
};

export default QuizPage;
