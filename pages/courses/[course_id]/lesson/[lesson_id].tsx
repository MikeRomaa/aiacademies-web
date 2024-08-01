import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import { PageHeader } from '~/components/PageHeader';
import Markdown from 'markdown-to-jsx';
import { Lesson } from '~/types/api';
import { Course } from '~/types/api';

interface LessonPageProps {
    lesson: Lesson;
    course: Course;
    nextLesson?: Lesson;
}

const LessonPage: NextPage<LessonPageProps> = ({ lesson, course, nextLesson }) => (
    <>
        <PageHeader title={course.name} subtitle={`${lesson.number}. ${lesson.title}`} />
        <div className="container py-10">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <Markdown>{lesson.content}</Markdown>
                {nextLesson && (
                    <div className="mt-6 text-center">
                        <a href={`/courses/${course.id}/lessons/${nextLesson.id}`} className="text-blue-500 hover:underline">
                            Next Lesson: {nextLesson.title}
                        </a>
                    </div>
                )}
            </div>
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const lesson_id = params!.lesson_id as string;
    const course_id = params!.course_id as string;

    const [lessonResponse, courseResponse] = await Promise.all([
        axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson_id}/`),
        axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`)
    ]);

    const lesson = lessonResponse.data;
    const course = courseResponse.data;
    const nextLesson = course.lessons.find((l) => l.number === lesson.number + 1);

    return { props: { lesson, course, nextLesson: nextLesson ?? null } };
};

export default LessonPage;
