// pages/courses/[course_id]/lesson/[lesson_id].tsx

import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import CodeBlock from '~/components/CodeBlock';
import { Lesson, TypedCourseUnit, Course } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import { Button } from '~/components/Button';
import { getSortedCourseUnits, getNextUnit } from '~/utils/courseUtils';
import Link from 'next/link';

interface LessonPageProps {
    courseName: string;
    lesson: Lesson;
    nextUnit: TypedCourseUnit | null;
}

const Lesson: NextPage<LessonPageProps> = ({ courseName, lesson, nextUnit }) => (
    <>
        <PageHeader title={courseName} subtitle={`${lesson.number}. ${lesson.title}`} />
        <div className="container py-10">
            <Markdown
                className="markdown-body prose max-w-none"
                options={{ overrides: { pre: CodeBlock } }}
            >
                {lesson.content}
            </Markdown>
            {nextUnit ? (
                <div className="mt-8 flex justify-end">
                    <Link
                        href={
                            nextUnit.type === 'lesson'
                                ? `/courses/${lesson.course_id}/lesson/${nextUnit.id}`
                                : `/courses/${lesson.course_id}/quiz/${nextUnit.id}`
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { course_id, lesson_id } = params!;

    try {
        // Fetch the specific lesson
        const lessonResponse = await axios.get<Lesson>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson_id}/`
        );
        const lesson = lessonResponse.data;

        // Fetch the course with all units
        const courseResponse = await axios.get<Course>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`
        );
        const course = courseResponse.data;

        // Get sorted units
        const sortedUnits = getSortedCourseUnits(course);

        // Find the next unit
        const nextUnit = getNextUnit(sortedUnits, lesson.id, 'lesson');

        return {
            props: {
                courseName: course.name,
                lesson,
                nextUnit,
            },
        };
    } catch (error) {
        // Handle errors, e.g., redirect to a 404 page
        console.error("Error fetching lesson data:", error);
        return {
            notFound: true,
        };
    }
};

export default Lesson;
