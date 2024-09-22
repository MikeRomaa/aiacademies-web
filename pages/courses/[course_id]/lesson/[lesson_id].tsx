import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import CodeBlock from '~/components/CodeBlock';
import { Course, Lesson } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import Link from 'next/link';

interface LessonPageProps {
    courseName: string;
    lesson: Lesson;
    nextContent?: {
        type: string; // Either 'lesson' or 'quiz'
        id: number;
        title: string;
    };
}

const Lesson: NextPage<LessonPageProps> = ({ courseName, lesson, nextContent }) => (
    <>
        <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
        <div className="container py-10">
            <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                {lesson.content}
            </Markdown>
            {/* Display Next button only if there's a next lesson or quiz */}
            {nextContent && (
                <div className="mt-8">
                    <Link href={nextContent.type === 'lesson' ? `/lessons/${nextContent.id}` : `/quizzes/${nextContent.id}`}>
                        <a className="btn btn-primary">
                            Next {nextContent.type === 'lesson' ? 'Lesson' : 'Quiz'}: {nextContent.title}
                        </a>
                    </Link>
                </div>
            )}
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const lesson = await axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${params!.lesson_id}/`);
    const course = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);

    return {
        props: {
            courseName: course.data.name,
            lesson: lesson.data,
            nextContent: lesson.data.next_content || null, // Pass next content to the component
        }
    };
};

export default Lesson;
