import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import CodeBlock from '~/components/CodeBlock';
import { Course, Lesson } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import Link from 'next/link'; // Import Link component from Next.js

interface LessonPageProps {
    courseName: string;
    lesson: Lesson;
    nextLesson: Lesson | null;
}

const Lesson: NextPage<LessonPageProps> = ({ courseName, lesson, nextLesson }) => (
    <>
        <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
        <div className="container py-10">
            <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                {lesson.content}
            </Markdown>

            {nextLesson && (
                <div className="mt-4">
                    <Link href={`/courses/${lesson.course}/lessons/${nextLesson.id}`}>
                        <a className="btn btn-primary">Next Lesson: {nextLesson.title}</a>
                    </Link>
                </div>
            )}
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const lesson = await axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${params!.lesson_id}/`);
    const course = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);
    const lessons = await axios.get<Lesson[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/lessons/`);

    const currentIndex = lessons.data.findIndex(l => l.id === lesson.data.id);
    const nextLesson = lessons.data[currentIndex + 1] || null;

    return {
        props: {
            courseName: course.data.name,
            lesson: lesson.data,
            nextLesson
        }
    };
};

export default Lesson;
