import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import { LessonLink } from '~/components/LessonLink';
import { QuizLink } from '~/components/QuizLink';
import { difficultyIntToString } from '~/utils/strings';
import { Course } from '~/types/api';
import { PageHeader } from '~/components/PageHeader';
import { Card } from '~/components/Card';

interface CoursePageProps {
    course: Course;
}

const CoursePage: NextPage<CoursePageProps> = ({ course }) => {
    // Combine and sort units
    const sortedUnits = [
        ...course.lessons.map(lesson => ({ ...lesson, type: 'lesson' as const })),
        ...course.quizzes.map(quiz => ({ ...quiz, type: 'quiz' as const })),
    ].sort((a, b) => a.number - b.number);

    return (
        <>
            <PageHeader title={course.name} />
            <div className="container py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-1/2">
                        <Card>
                            <h2 className="font-medium">Lessons & Quizzes</h2>
                            <div className="mt-4">
                                {sortedUnits.map(unit =>
                                    unit.type === 'lesson' ? (
                                        <LessonLink key={unit.id} course={course} lesson={unit} />
                                    ) : (
                                        <QuizLink key={unit.id} course={course} quiz={unit} />
                                    )
                                )}
                            </div>
                        </Card>
                    </div>
                    <div className="lg:w-1/2">
                        <Card>
                            <img
                                src={course.banner}
                                alt={course.name}
                                className="w-full h-64 object-cover rounded-t-lg"
                            />
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-2">{course.name}</h2>
                                <p className="mb-2">
                                    <strong>Approximate Duration:</strong> {course.total_duration} Hour
                                    {course.total_duration !== 1 && 's'}
                                </p>
                                <p className="mb-4">
                                    <strong>Difficulty:</strong> {difficultyIntToString(course.difficulty)}
                                </p>
                                <Markdown>{course.description}</Markdown>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { course_id } = params!;

    try {
        const courseResponse = await axios.get<Course>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`
        );
        const course = courseResponse.data;

        return {
            props: {
                course,
            },
        };
    } catch (error) {
        console.error("Error fetching course data:", error);
        return {
            notFound: true,
        };
    }
};

export default CoursePage;
