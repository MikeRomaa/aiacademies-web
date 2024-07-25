import React from 'react';
import { NextPage } from 'next';
import { PageHeader } from '~/components/PageHeader';
import Image from 'next/image';
import rayhan from '~/public/img/good_picture_rayhan.jpg';
import saketh from '~/public/img/saketh.jpg';
import nathan from '~/public/img/nathan.jpg';
import william from '~/public/img/william_cropped.png';
import danial from '~/public/img/Danial_Pic.jpg';
import ben from '~/public/img/Ben_Li.jpeg';

const Blog: NextPage = () => (
    <>
        <PageHeader title="Blog" />
        <div className="container py-10">
            <h1>This weeks AI News</h1>
            <br/>
            <div className="lg:flex gap-10 mb-5">

            </div>
            <div className="lg:flex gap-10 mb-5">

            </div>
            <div className="lg:flex gap-10 mb-5">

            </div>
            <div className="lg:flex gap-10 mb-5">

            </div>
            <div className="lg:flex gap-10 mb-5">

            </div>
            <div className="lg:flex gap-10 mb-5">

            </div>
            <h2>Updates & Info</h2>
        </div>
    </>
);
export default Blog;
