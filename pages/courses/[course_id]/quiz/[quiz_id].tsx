// pages/courses/[course_id]/quiz/[quiz_id].tsx

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
import { Course, Quiz, QuizAttempt, TypedCourseUnit } from '~/types/api';
import Spinner from '~/components/Spinner';
import Link from 'next/link';
import { getSortedCourseUnits, getNextUnit } from '~/utils/courseUtils';

interface QuizPageProps {
    courseName: string;
    quiz: Quiz;
    nextUnit: TypedCourseUnit | null;
}

const QuizPage: NextPage<QuizPageProps> = ({ courseName, quiz, nextUnit }) => {
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
    }, [quiz.id]);

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
                <PageHeader title={courseName} subtitle={`${quiz.number}. ${quiz.title}`} />
                <div className="container py-10">
                    <h3 className="font-medium">Attempt Score: {review.score}%</h3>
                    {quiz.questions.map((question, i) => (
                        <section className="flex mb-8" key={i}>
                            <div>
                                {question.context && (
                                    <Markdown
                                        className="markdown-body max-w-none"
                                        options={{ overrides: { pre: CodeBlock } }}
                                    >
                                        {question.context}
                                    </Markdown>
                                )}
                                <p className="font-medium">
                                    {i + 1}. {question.question}
                                </p>
                                {question.multiple_choice && (
                                    <ul>
                                        {question.choices?.map(choice => (
                                            <li key={choice} className="list-outside list-disc ml-5">
                                                {choice}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <p
                                    className={classNames('font-medium', {
                                        'text-emerald-600':
                                            review.answers[i].trim() === question.correct_answer,
                                        'text-red-600':
                                            review.answers[i].trim() !== question.correct_answer,
                                    })}
                                >
                                    Your answer: {review.answers[i]}
                                </p>
                                {review.answers[i].trim() === question.correct_answer && (
                                    <p className="text-emerald-600 font-medium">
                                        Correct answer: {question.correct_answer}
                                    </p>
                                )}
                            </div>
                        </section>
                    ))}
                    <Button
                        className="bg-deepblue-700 text-white"
                        onClick={() => setReview(undefined)}
                    >
                        Re-attempt Quiz
                    </Button>
                    {nextUnit ? (
                        <div className="mt-8 flex justify-end">
                            <Link
                                href={
                                    nextUnit.type === 'lesson'
                                        ? `/courses/${quiz.course_id}/lesson/${nextUnit.id}`
                                        : `/courses/${quiz.course_id}/quiz/${nextUnit.id}`
                                }
                                passHref
                            >
                                <a>
                                    <Button className="bg-deepblue-700 text-white">
                                        Next: {nextUnit.type === 'lesson' ? 'Lesson' : 'Quiz'} {nextUnit.number}
                                    </Button>
                                </a>
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-8 flex justify-center">
                            <p className="text-lg font-medium text-emerald-600">
                                Congratulations! You have completed this course.
                            </p>
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader title={courseName} subtitle={`${quiz.number}. ${quiz.title}`} />
            <div className="container py-10">
                <Formik
                    initialValues={quiz.questions.reduce((acc, _, i) => {
                        acc[i] = '';
                        return acc;
                    }, {} as Record<string, string>)}
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
                                            <Markdown
                                                className="markdown-body max-w-none"
                                                options={{ overrides: { pre: CodeBlock } }}
                                            >
                                                {question.context}
                                            </Markdown>
                                        )}
                                        {question.multiple_choice ? (
                                            <Field
                                                required
                                                as={Radio}
                                                label={`${i + 1}. ${question.question}`}
                                                name={i.toString()}
                                                choices={
                                                    question.choices?.map(choice => ({
                                                        label: choice,
                                                        value: choice,
                                                    })) || []
                                                }
                                            />
                                        ) : (
                                            <Field
                                                required
                                                as={Input}
                                                label={`${i + 1}. ${question.question}`}
                                                name={i.toString()}
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
                {nextUnit ? (
                    <div className="mt-8 flex justify-end">
                        <Link
                            href={
                                nextUnit.type === 'lesson'
                                    ? `/courses/${quiz.course_id}/lesson/${nextUnit.id}`
                                    : `/courses/${quiz.course_id}/quiz/${nextUnit.id}`
                            }
                            passHref
                        >
                            <a>
                                <Button className="bg-deepblue-700 text-white">
                                    Next: {nextUnit.type === 'lesson' ? 'Lesson' : 'Quiz'} {nextUnit.number}
                                </Button>
                            </a>
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 flex justify-center">
                        <p className="text-lg font-medium text-emerald-600">
                            Congratulations! You have completed this course.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { course_id, quiz_id } = params!;

    try {
        // Fetch the specific quiz
        const quizResponse = await axios.get<Quiz>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz_id}/`
        );
        const quiz = quizResponse.data;

        // Fetch the course with all units
        const courseResponse = await axios.get<Course>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`
        );
        const course = courseResponse.data;

        // Get sorted units
        const sortedUnits = getSortedCourseUnits(course);

        // Find the next unit
        const nextUnit = getNextUnit(sortedUnits, quiz.id, 'quiz');

        return {
            props: {
                courseName: course.name,
                quiz,
                nextUnit,
            },
        };
    } catch (error) {
        // Handle errors, e.g., redirect to a 404 page
        return {
            notFound: true,
        };
    }
};

export default QuizPage;
