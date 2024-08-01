import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import CodeBlock from '~/components/CodeBlock';
import { Course, Lesson } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import { LessonLink } from '~/components/LessonLink'; // Import LessonLink

interface LessonPageProps {
    courseName: string;
    lesson: Lesson;
    nextLesson: Lesson | null;
    course: Course; // Include course prop
}

const Lesson: NextPage<LessonPageProps> = ({ courseName, lesson, nextLesson, course }) => (
    <>
        <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
        <div className="container py-10">
            <Markdown className="markdown-body prose max-w-none" options={{ overrides: { pre: CodeBlock } }}>
                {lesson.content}
            </Markdown>
            {nextLesson && (
                <div className="mt-4">
                    <LessonLink course={course} lesson={nextLesson} />
                </div>
            )}
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const lessonId = params!.lesson_id as string;
    const courseId = params!.course_id as string;

    // Fetch the current lesson
    const lessonResponse = await axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lessonId}/`);
    const lesson = lessonResponse.data;
    // Fetch the course and lessons
    const courseResponse = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/`);
    const course = courseResponse.data;

    const lessonsResponse = await axios.get<Lesson[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/lessons/`);
    const lessons = lessonsResponse.data;

    // Find the index of the current lesson
    const currentIndex = lessons.findIndex(l => l.id === lesson.id);

    // Determine the next lesson
    const nextLesson = lessons[currentIndex + 1] || null;

    return {
        props: {
            courseName: course.name,
            lesson,
            nextLesson,
            course  // Pass course data as a prop
        }
    };
};

export default Lesson;
