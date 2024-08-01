import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { PageHeader } from '~/components/PageHeader';
import { Lesson } from '~/types/api';
import CodeBlock from '~/components/CodeBlock';

interface LessonPageProps {
    lesson: Lesson;
    courseName: string;
}

const LessonPage: NextPage<LessonPageProps> = ({ lesson, courseName }) => {
    return (
        <>
            <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
            <div className="container py-10">
                <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                    {lesson.content}
                </Markdown>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { course_id, lesson_id } = params as { course_id: string; lesson_id: string };

    try {
        const { data: lesson } = await axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson_id}/`);
        const { data: course } = await axios.get<{ name: string }>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`);

        return {
            props: {
                lesson,
                courseName: course.name,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
};

export default LessonPage;
