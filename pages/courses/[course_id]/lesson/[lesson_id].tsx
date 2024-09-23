import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { Course, Lesson, Quiz } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import NextContentButton from '~/components/NextContentButton';

interface LessonPageProps {
  courseName: string;
  lesson: Lesson;
  courseId: number;
  contents: Array<{ id: number; number: number; title: string; type: 'lesson' | 'quiz' }>; // Unified content type
}

const Lesson: NextPage<LessonPageProps> = ({ courseName, lesson, courseId, contents }) => (
  <>
    <PageHeader title={courseName} subtitle={`${lesson.number ?? 0}. ${lesson.title}`} />
    <div className="container py-10">
      <Markdown className="markdown-body prose max-w-none">
        {lesson.content}
      </Markdown>
      {/* Pass the current lesson number, all contents, and courseId to NextContentButton */}
      <NextContentButton currentNumber={lesson.number} contents={contents} courseId={courseId} />
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch lesson and course data
  const lessonResponse = await axios.get<Lesson>(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${params!.lesson_id}/`);
  const courseResponse = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);

  // Fetch all lessons and quizzes (content) for the course for navigation purposes
  const { lessons, quizzes } = courseResponse.data;

  // Combine lessons and quizzes into a unified content array for navigation
  const contents = [
    ...lessons.map((lesson) => ({ id: lesson.id, number: lesson.number, title: lesson.title, type: 'lesson' })),
    ...quizzes.map((quiz) => ({ id: quiz.id, number: quiz.number, title: quiz.title, type: 'quiz' })),
  ].sort((a, b) => a.number - b.number); // Sort by the number to ensure proper sequence

  return {
    props: {
      courseName: courseResponse.data.name,
      lesson: lessonResponse.data,
      courseId: courseResponse.data.id,
      contents, // Pass contents to props for NextContentButton
    },
  };
};

export default Lesson;
