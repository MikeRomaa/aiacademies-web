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
        <a href="https://discord.gg/XSn8nxqvw4" target="_blank" rel="noreferrer">
        <a className="no-underline">
            <Card className="!p-0 duration-500 hover:-translate-y-2">
                <img
                    className="h-60 w-full object-cover rounded-t-2xl"
                />
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
