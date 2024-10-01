// pages/courses/[course_id]/lesson/[lesson_id].tsx

import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import CodeBlock from '~/components/CodeBlock';
import { Lesson, Course } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import { Button } from '~/components/Button';
import { useNextNavigation } from '~/utils/navigationUtils';

interface LessonPageProps {
    course: Course;
    lesson: Lesson;
}

const LessonPage: NextPage<LessonPageProps> = ({ course, lesson }) => {
    const { nextUnit, handleNext } = useNextNavigation(course, lesson.id, 'lesson');

    return (
        <>
            <PageHeader title={course.name} subtitle={`${lesson.number}. ${lesson.title}`} />
            <div className="container py-10">
                <Markdown
                    className="markdown-body prose max-w-none"
                    options={{ overrides: { pre: CodeBlock } }}
                >
                    {lesson.content}
                </Markdown>
                {nextUnit && (
                    <div className="mt-8 flex justify-end">
                        <Button className="bg-deepblue-700 text-white" onClick={handleNext}>
                            Next: {nextUnit.title}
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
    const { course_id, lesson_id } = params!;

    try {
        const lessonResponse = await axios.get<Lesson>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson_id}/`
        );
        const lesson = lessonResponse.data;

        const courseResponse = await axios.get<Course>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`
        );
        const course = courseResponse.data;

        return {
            props: {
                course,
                lesson,
            },
        };
    } catch (error) {
        console.error('Error fetching lesson data:', error);
        return {
            notFound: true,
        };
    }
};

export default LessonPage;
