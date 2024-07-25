import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { PageHeader } from '~/components/PageHeader';
import { RiFileCopy2Line } from 'react-icons/ri';
import { Card } from '~/components/Card';
import { BaseCourse } from '~/types/api';
import Image from 'next/image';


interface CourseCardProps {
    course: BaseCourse;
}


const Blog: NextPage = () => (
    <>
        <PageHeader title="Blog" />
        <div className="container py-10">
            <h1>This weeks AI News</h1>
            <br/>
            <a href="https://news.mit.edu/2024/study-structured-randomization-ai-can-improve-fairness-0724" target="_blank" rel="noreferrer">
                <a className="no-underline">
                    <Card className="!p-0 duration-500 hover:-translate-y-2">
                        <div className="p-4">
                            <p className="inline-flex items-center text-slate-400">
                                <RiFileCopy2Line size={22} className="mr-2" />
                            </p>
                        </div>
                    </Card>
                </a>
            </a>
            <h2>Updates & Info</h2>
        </div>
    </>
);
export default Blog;
