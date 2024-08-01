import React, { useState, useEffect } from 'react';
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
    nextLesson: Lesson | null;
}

const LessonPage: NextPage<LessonPageProps> = ({ courseName, lesson, nextLesson }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading delay for demonstration
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="container py-10 text-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-10 text-center">
                <p>Error loading lesson details. Please try again later.</p>
            </div>
        );
    }

    return (
        <>
            <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
            <div className="container py-10">
                <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                    {lesson.content}
                </Markdown>
                {nextLesson ? (
                    <div className="mt-10">
                        <Link href={`/courses/${lesson.course_id}/lesson/${nextLesson.id}`} passHref>
                            <a className="bg-blue-600 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out" aria-label={`Go to next lesson: ${nextLesson.title}`}>
                                Next Lesson: {nextLesson.title}
                            </a>
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10">
                        <p className="text-gray-600">This is the last lesson in the course.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const lesson = await axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${params!.lesson_id}/`);
        const course = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);

        // Find the next lesson
        const lessons = course.data.lessons;
        const currentLessonIndex = lessons.findIndex(l => l.id === lesson.data.id);
        const nextLesson = lessons[currentLessonIndex + 1] || null;

        return {
            props: {
                courseName: course.data.name,
                lesson: lesson.data,
                nextLesson
            }
        };
    } catch (error) {
        console.error('Failed to fetch lesson or course data:', error);
        return {
            props: {
                courseName: '',
                lesson: {} as Lesson,
                nextLesson: null
            }
        };
    }
};

export default LessonPage;
