import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import { PageHeader } from '~/components/PageHeader';
import { Course, Lesson, Quiz } from '~/types/api';
import { Card } from '~/components/Card';
import { LessonLink, QuizLink } from '~/components/LessonLink';

interface CoursePageProps {
    course: Course;
}

const CoursePage: NextPage<CoursePageProps> = ({ course }) => (
    <>
        <PageHeader title={course.name} />
        <div className="container py-10">
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="basis-1/2">
                    <Card>
                        <h2 className="font-medium text-xl mb-4">Lessons & Quizzes</h2>
                        <div className="relative pl-10">
                            <span className="absolute left-4 w-1.5 h-full bg-slate-200 rounded-full" />
                            {[...course.lessons, ...course.quizzes]
                                .sort((a, b) => a.number - b.number)
                                .map((unit) =>
                                    'content' in unit ? (
                                        <LessonLink key={unit.id} course={course} lesson={unit as Lesson} />
                                    ) : (
                                        <QuizLink key={unit.id} course={course} quiz={unit as Quiz} />
                                    )
                                )}
                        </div>
                    </Card>
                </div>
                <div className="basis-1/2">
                    <Card className="!p-0 mb-10">
                        <img
                            src={course.banner}
                            alt={course.name}
                            className="h-96 w-full object-cover rounded-t-2xl"
                        />
                        <div className="p-6">
                            <h2 className="font-medium text-xl">{course.name}</h2>
                            <p className="mb-2"><b className="font-medium">Approximate Duration:</b> {course.total_duration} Hour{course.total_duration !== 1 && 's'}</p>
                            <p className="mb-2"><b className="font-medium">Difficulty:</b> {difficultyIntToString(course.difficulty)}</p>
                            <p><Markdown>{course.description ?? ''}</Markdown></p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const course = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${params!.course_id}/`);
    return { props: { course: course.data } };
};

export default CoursePage;
