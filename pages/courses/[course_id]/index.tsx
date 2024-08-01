import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import { Course, Lesson, Quiz } from '~/types/api';
import LessonLink from '~/components/LessonLink';
import QuizLink from '~/components/QuizLink';
import { PageHeader } from '~/components/PageHeader';

interface CoursePageProps {
    course: Course;
    lessons: Lesson[];
    quizzes: Quiz[];
}

const CoursePage: NextPage<CoursePageProps> = ({ course, lessons, quizzes }) => (
    <div>
        <PageHeader title={course.name} subtitle={course.description} />
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Lessons</h2>
                <div className="space-y-4">
                    {lessons.map(lesson => (
                        <LessonLink key={lesson.id} lesson={lesson} courseId={course.id} />
                    ))}
                </div>
                <h2 className="text-2xl font-bold mt-8 mb-4">Quizzes</h2>
                <div className="space-y-4">
                    {quizzes.map(quiz => (
                        <QuizLink key={quiz.id} quiz={quiz} courseId={course.id} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export const getServerSideProps: GetServerSideProps<CoursePageProps> = async (context) => {
    const { course_id } = context.params as { course_id: string };

    try {
        const { data: course } = await axios.get<Course>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/`);
        const { data: lessonsData } = await axios.get<Lesson[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/lessons/`
        );
        const { data: quizzesData } = await axios.get<Quiz[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course_id}/quizzes/`
        );

        return {
            props: {
                course,
                lessons: lessonsData,
                quizzes: quizzesData,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            notFound: true,
        };
    }
};

export default CoursePage;
