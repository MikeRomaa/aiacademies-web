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
import { Quiz, QuizAttempt, Course } from '~/types/api';
import Spinner from '~/components/Spinner';
import { useNextNavigation } from '~/utils/navigationUtils';

interface QuizPageProps {
    course: Course;
    quiz: Quiz;
}

const QuizPage: NextPage<QuizPageProps> = ({ course, quiz }) => {
    const { nextUnit, handleNext } = useNextNavigation(course, quiz.id, 'quiz');
    const [review, setReview] = useState<QuizAttempt | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const fetchReview = useCallback(async () => {
        try {
            const response = await axios.get<QuizAttempt>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz.id}/review/`
            );
            setReview(response.data);
        } catch (error) {
            console.error("Error fetching quiz review:", error);
            setReview(undefined);
        } finally {
            setLoading(false);
        }
    }, [quiz.id]);

    useEffect(() => {
        fetchReview();
    }, [fetchReview]);

    if (loading) {
        return (
            <div className="h-96 bg-white flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (review) {
        return (
            <>
                <PageHeader title={course.name} subtitle={`${quiz.number}. ${quiz.title}`} />
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
                                        'text-emerald-600': review.answers[i]?.trim() === question.correct_answer,
                                        'text-red-600': review.answers[i]?.trim() !== question.correct_answer,
                                    })}
                                >
                                    Your answer: {review.answers[i]}
                                </p>
                                {review.answers[i]?.trim() === question.correct_answer && (
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
                    {nextUnit && (
                        <div className="mt-8 flex justify-end">
                            <Button className="bg-deepblue-700 text-white" onClick={handleNext}>
                                Next: {nextUnit.type === 'lesson' ? 'Lesson' : 'Quiz'} {nextUnit.number}
                            </Button>
                        </div>
                    )}
                    {!nextUnit && (
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
            <PageHeader title={course.name} subtitle={`${quiz.number}. ${quiz.title}`} />
            <div className="container py-10">
                <Formik
                    initialValues={quiz.questions.reduce((acc, _, i) => {
                        acc[i] = '';
                        return acc;
                    }, {} as Record<string, string>)}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await axios.post(
                                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz.id}/`,
                                values
                            );
                            setLoading(true);
                            fetchReview();
                        } catch (error) {
                            console.error("Error submitting quiz:", error);
                        } finally {
                            setSubmitting(false);
                        }
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
                                disabled={!!Object.keys(errors).length}
                                type="submit"
                            >
                                Submit Quiz
                            </Button>
                        </Form>
                    )}
                </Formik>
                {nextUnit && (
                    <div className="mt-8 flex justify-end">
                        <Button className="bg-deepblue-700 text-white" onClick={handleNext}>
                            Next: {nextUnit.type === 'lesson' ? 'Lesson' : 'Quiz'} {nextUnit.number}
                        </Button>
                    </div>
                )}
                {!nextUnit && (
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
        const quizResponse = await axios.get<Quiz>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quiz_id}/`
        );
        const quiz = quizResponse.data;

        const courseResponse = await axios.get<Course>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`
        );
        const course = courseResponse.data;

        return {
            props: {
                course,
                quiz,
            },
        };
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        return {
            notFound: true,
        };
    }
};

export default QuizPage;
