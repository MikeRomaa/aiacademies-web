import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import CodeBlock from '~/components/CodeBlock';
import { Course, Lesson, Quiz } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import Link from 'next/link';

interface LessonPageProps {
    courseName: string;
    lesson: Lesson;
    nextItem: { id: number; type: 'lesson' | 'quiz'; title: string } | null;
}

const LessonPage: NextPage<LessonPageProps> = ({ courseName, lesson, nextItem }) => {
    return (
        <>
            <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
            <div className="container py-10">
                <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                    {lesson.content}
                </Markdown>
                {nextItem ? (
                    <div className="mt-10">
                        <Link href={`/${nextItem.type === 'lesson' ? `courses/${lesson.course_id}/lesson/${nextItem.id}` : `courses/${lesson.course_id}/quiz/${nextItem.id}`}`} passHref>
                            <a className="bg-blue-600 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out" aria-label={`Go to next ${nextItem.type}: ${nextItem.title}`}>
                                Next {nextItem.type === 'lesson' ? 'Lesson' : 'Quiz'}: {nextItem.title}
                            </a>
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10">
                        <p className="text-gray-600">No more items available in this course.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const lessonId = params!.lesson_id as string;
        const courseId = params!.course_id as string;

        const lesson = await axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lessonId}/`);
        const course = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/`);

        const lessons = course.data.lessons;
        const quizzes = course.data.quizzes;

        // Find the current lesson index
        const currentLessonIndex = lessons.findIndex(lesson => lesson.id === parseInt(lessonId, 10));

        // Determine the next item in sequence
        let nextItem = null;
        if (currentLessonIndex + 1 < lessons.length) {
            // Next lesson
            nextItem = { id: lessons[currentLessonIndex + 1].id, type: 'lesson', title: lessons[currentLessonIndex + 1].title };
        } else if (currentLessonIndex === lessons.length - 1) {
            // No more lessons, but there might be a next quiz
            if (quizzes.length > 0) {
                nextItem = { id: quizzes[0].id, type: 'quiz', title: quizzes[0].title }; // Assuming quizzes are in order
            }
        }

        return {
            props: {
                courseName: course.data.name,
                lesson: lesson.data,
                nextItem
            }
        };
    } catch (error) {
        console.error('Failed to fetch lesson or course data:', error);
        return {
            props: {
                courseName: '',
                lesson: {} as Lesson,
                nextItem: null
            }
        };
    }
};

export default LessonPage;
