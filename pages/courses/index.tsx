import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { AiFillStar, AiOutlineSearch } from 'react-icons/ai';
import axios from 'axios';
import { Card } from '~/components/Card';
import { CourseCard } from '~/components/CourseCard';
import { PageHeader } from '~/components/PageHeader';
import { Course } from '~/types/api';

interface CourseListPageProps {
    courses: Course[];
}

const CourseList: NextPage<CourseListPageProps> = ({ courses }) => {
    const [search, setSearch] = useState('');

    return (
        <>
            <PageHeader title="Courses" />
            <div className="container py-10">
                <Card className="relative flex items-center !p-0 mb-10 text-lg">
                    <AiOutlineSearch size={30} className="absolute left-5 fill-slate-400 pointer-events-none" />
                    <input
                        className="w-full h-full py-6 pl-16 pr-6 bg-transparent outline-0 placeholder:text-slate-400"
                        placeholder="Search for a course or subject..."
                        onChange={({ target }) => setSearch(target.value)}
                    />
                </Card>
                {search ? (
                    <>
                        <h2 className="font-medium mb-10">Search Results</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-10">
                            {courses
                                ?.filter(course => course.name.toLowerCase().includes(search.toLowerCase()))
                                .map((course) => <CourseCard key={course.id} course={course} />)}
                        </div>
                    </>
                ) : (
                    <>
                        {courses?.some(course => course.featured) && (
                            <h2 className="inline-flex items-center font-medium mb-10">
                                <AiFillStar className="fill-amber-300 mr-2" />
                                Featured Courses
                            </h2>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-10">
                            {courses?.filter(course => course.featured).map((course) => <CourseCard key={course.id} course={course} />)}
                        </div>
                        <h2 className="font-medium mb-10">All Courses</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                            {courses?.map((course) => <CourseCard key={course.id} course={course} />)}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    const courses = await axios.get<BaseCourse>(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/`);

    return { props: { courses: courses.data } };
};

export default CourseList;
