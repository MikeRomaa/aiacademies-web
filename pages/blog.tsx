import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { PageHeader } from '~/components/PageHeader';
import { RiFileCopy2Line } from 'react-icons/ri';
import { Card } from '~/components/Card';
import { Course } from '~/types/api';
import Image from 'next/image';
import Article from '~/public/img/Article.jpg';

interface CourseCardProps {
    course: Course;
}

const Blog: NextPage = () => (
    <>
        <PageHeader title="Blog" />
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">This Week&apos;s AI News</h1>
            <Link href="https://news.mit.edu/2024/study-structured-randomization-ai-can-improve-fairness-0724" passHref>
                <a className="no-underline">
                    <Card className="!p-0 duration-500 hover:-translate-y-2">
                        <Image
                            src={Article}
                            alt="Article Image"
                            className="w-full object-cover rounded-t-2xl"
                            layout="responsive"
                            height={300}
                        />
                        <div className="p-4">
                            <h4 className="text-xl font-semibold mb-2">
                                Study: When allocating scarce resources with AI, randomization can improve fairness
                            </h4>
                            <p className="inline-flex items-center text-slate-400">
                                <RiFileCopy2Line size={22} className="mr-2" />
                                Read More
                            </p>
                        </div>
                    </Card>
                </a>
            </Link>
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Updates & Info</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Implementing two new courses including Natural Language Processing and Ethics in AI</li>
                    <li>Revamped the mobile interface for easier use</li>
                    <li>Introduced a blog page with weekly articles and an info section</li>
                </ul>
            </div>
        </div>
    </>
);
export default Blog;
