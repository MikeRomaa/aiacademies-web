import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import LessonLink from '~/components/LessonLink';
import QuizLink from '~/components/QuizLink';
import { Course } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import { Card } from '~/components/Card';

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
                        <h2 className="font-medium">Lessons</h2>
                        <div className="relative pl-10">
                            <span className="absolute left-4 w-1.5 h-full bg-slate-200 rounded-full" />
                            {[...course.lessons, ...course.quizzes]
                                .sort((a, b) => a.number > b.number ? 1 : -1)
                                .map((unit) =>
                                    'points' in unit
                                        ? <LessonLink key={unit.id} courseId={course.id} lesson={unit} />
                                        : <QuizLink key={unit.id} courseId={course.id} quiz={unit} />
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
                        <div className="p-10">
                            <h2 className="font-medium">{course.name}</h2>
                            <p className="mb-2"><b className="font-medium">Approximate Duration:</b> {course.total_duration} Hour{course.total_duration !== 1 && 's'}</p>
                            <p className="mb-2"><b className="font-medium">Difficulty:</b> {course.difficulty}</p>
                            <p>{course.description}</p>
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
