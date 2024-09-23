import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { Course, Lesson } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import NextContentButton from '~/components/NextContentButton';

interface LessonPageProps {
    courseName: string;
    lesson: Lesson;
    courseId: number;
}

const Lesson: NextPage<LessonPageProps> = ({ courseName, lesson, courseId }) => (
    <>
        <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
        <div className="container py-10">
            <Markdown className="markdown-body prose max-w-none">
                {lesson.content}
            </Markdown>
            <NextContentButton nextContent={lesson.next_content ?? null} courseId={courseId} />
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const lessonResponse = await axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${params!.lesson_id}/`);
    const courseResponse = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);

    return {
        props: {
            courseName: courseResponse.data.name,
            lesson: lessonResponse.data,
            courseId: courseResponse.data.id, // Pass courseId to props
        }
    };
};

export default Lesson;
