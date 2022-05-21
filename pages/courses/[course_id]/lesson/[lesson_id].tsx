import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import CodeBlock from '~/components/CodeBlock';
import { Course, Lesson } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';

interface LessonPageProps {
    courseName: string;
    lesson: Lesson;
}

const Lesson: NextPage<LessonPageProps> = ({ courseName, lesson }) => (
    <>
        <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
        <div className="container py-10">
            <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                {lesson.content}
            </Markdown>
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const lesson = await axios.get<Lesson>(`${process.env.API_URL}/api/lessons/${params!.lesson_id}/`);
    const course = await axios.get<Course>(`${process.env.API_URL}/api/courses/${params!.course_id}/`);

    return {
        props: {
            courseName: course.data.name,
            lesson: lesson.data,
        }
    };
};

export default Lesson;
