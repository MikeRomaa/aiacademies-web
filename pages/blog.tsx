import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { PageHeader } from '~/components/PageHeader';
import { RiFileCopy2Line } from 'react-icons/ri';
import { Card } from '~/components/Card';
import { BaseCourse } from '~/types/api';
import Image from 'next/image';
import Article from '~/public/img/Article.jpg';



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
                        <h4>{'Study: When allocating scarce resources with AI, randomization can improve fairness'}</h4>
                        <Image src={Article} alt="Article Image" className="h-60 w-100 object-cover rounded-t-2xl" />
                        <div className="p-4">
                            <p className="inline-flex items-center text-slate-400">
                                <RiFileCopy2Line size={22} className="mr-2" />
                            </p>
                        </div>
                    </Card>
                </a>
            </a>
            <br/>
            <div>
                <h2>Updates & Info</h2>
                <p>Implementing two new Courses including Natural Language Processing and Ethics in AI</p>
            </div>
        </div>
    </>
);
export default Blog;
