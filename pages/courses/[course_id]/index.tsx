import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { LessonLink } from '~/components/LessonLink';
import { QuizLink } from '~/components/QuizLink';
import { difficultyIntToString } from '~/utils/strings';
import { Course, TypedCourseUnit, TypedLesson, TypedQuiz } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import { Card } from '~/components/Card';
import { getSortedCourseUnits } from '~/utils/courseUtils';

interface CoursePageProps {
    course: Course;
}

const Course: NextPage<CoursePageProps> = ({ course }) => (
    <>
        <PageHeader title={course.name} />
        <div className="container py-10">
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="basis-1/2">
                    <Card>
                        <h2 className="font-medium">Lessons & Quizzes</h2>
                        <div className="relative pl-10">
                            <span className="absolute left-4 w-1.5 h-full bg-slate-200 rounded-full" />
                            {getSortedCourseUnits(course).map(unit =>
                                unit.type === 'lesson' ? (
                                    <LessonLink key={unit.id} course={course} lesson={unit as TypedLesson} />
                                ) : (
                                    <QuizLink key={unit.id} course={course} quiz={unit as TypedQuiz} />
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
                        <div className="p-10">
                            <h2 className="font-medium">{course.name}</h2>
                            <p className="mb-2">
                                <b className="font-medium">Approximate Duration:</b> {course.total_duration} Hour
                                {course.total_duration !== 1 && 's'}
                            </p>
                            <p className="mb-2">
                                <b className="font-medium">Difficulty:</b> {difficultyIntToString(course.difficulty)}
                            </p>
                            <p>
                                <Markdown>{course.description || ''}</Markdown>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { course_id } = params!;

    try {
        const courseResponse = await axios.get<Course>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`
        );
        const course = courseResponse.data;

        return { props: { course } };
    } catch (error) {
        return {
            notFound: true,
        };
    }
};

export default Course;
