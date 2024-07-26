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
            <h1>This Week&apos;s AI News</h1>
            <br />
            <Link href="https://news.mit.edu/2024/study-structured-randomization-ai-can-improve-fairness-0724" passHref>
                <a className="no-underline">
                    <Card className="!p-0 duration-500 hover:-translate-y-2">
                        <Image
                            src={Article}
                            alt="Article Image"
                            className="h-60 w-full object-cover rounded-t-2xl"
                            layout="responsive"
                        />
                        <div className="p-4">
                            <h4 className="text-lg font-semibold">
                                Study: When allocating scarce resources with AI, randomization can improve fairness
                            </h4>
                            <p className="inline-flex items-center text-slate-400 mt-2">
                                <RiFileCopy2Line size={22} className="mr-2" />
                                Read More
                            </p>
                        </div>
                    </Card>
                </a>
            </Link>
            <br />
            <div>
                <h2>Updates & Info</h2>
                <p>Implementing two new Courses including Natural Language Processing and Ethics in AI</p>
            </div>
        </div>
    </>
);
export default Blog;
