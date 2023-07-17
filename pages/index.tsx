import React from 'react';
import { NextPage } from 'next';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { Accordion, AccordionElement } from '~/components/Accordion';
import { PageHeader } from '~/components/PageHeader';
import { useSession } from '~/utils/sessionHooks';

const Home: NextPage = () => {
    const session = useSession();

    return (
        <>
            <PageHeader title={session ? `Welcome back, ${session.firstName}!` : 'Welcome to AI Academies!'} />
            <div className="container py-10">
                <h2 className="font-medium mb-10">Our Mission</h2>
                <ul className="list-disc pl-5 mb-10">
                    <li><b>Young Brains AI</b> is an international non-profit organization whose goal is to provide a free, up-to-date, and accessible artificial intelligence curriculum to middle and high school students across the globe</li>
                    <br/>
                    <li>We strive to broaden the participation of underrepresented groups (including gender, socioeconomic status, and ethnicity) to increase their success in computer science and technology</li>
                    <br/>
                    <li>This website, <b>AI Academies</b>, offers a free curriculum that removes any financial barrier to immersing students in the world of AI</li>
                </ul>
                <h2 className="font-medium mb-10">Our Impact</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
                    <div className="rounded-xl bg-slate-100/50 p-5">
                        <h3 className="font-medium">500+</h3>
                        <h3 className="mb-0">Users</h3>
                    </div>
                    <div className="rounded-xl bg-slate-100/50 p-5">
                        <h3 className="font-medium">6,000+</h3>
                        <h3 className="mb-0">Page Views</h3>
                    </div>
                    <div className="rounded-xl bg-slate-100/50 p-5">
                        <h3 className="font-medium">20+</h3>
                        <h3 className="mb-0">Countries Reached</h3>
                    </div>
                </div>
                <h2 className="font-medium mb-10">Frequently Asked Questions</h2>
                <Accordion>
                    <AccordionElement title="What is this site?">
                        AI Academies is a user-friendly introduction to artificial intelligence and machine learning. The site’s goal is to make AI content accessible and free to all since current resources online are either too complicated or expensive.
                    </AccordionElement>
                    <AccordionElement title="Why AI?">
                        Every student should have the opportunity to learn AI. The field is shaping the future of humanity across nearly every industry, so by starting early, students will have a foundation for success. The job market for AI is booming due to high demand, making careers in AI lucrative and stable. In addition, AI can make a real impact in the world by improving the lives of others. AI is still a new field, so there is a lot more research to be done and a lot more to discover.
                    </AccordionElement>
                    <AccordionElement title="Do I need any prior experience?">
                        Not at all! All experience levels from beginner to advanced are welcomed and encouraged!
                    </AccordionElement>
                    <AccordionElement title="How do I create an account?">
                        Simply click the “Sign Up” button on the top right, and then enter your full name, email address, and password.
                    </AccordionElement>
                    <AccordionElement title="What device should I use?">
                        We recommend using a laptop or desktop for the best user experience. On mobile, some of the images may look distorted.
                    </AccordionElement>
                    <AccordionElement title="How do the courses work?">
                        Each course is complete with lessons, template code, and quizzes. Once you make an account, you can attempt quizzes; each quiz has unlimited attempts and shows your score after each attempt. Courses are recommended to be completed in the order they appear.
                    </AccordionElement>
                    <AccordionElement title="What programming languages will I use?">
                        These courses all use Python, a programming language used heavily in AI and machine learning.
                    </AccordionElement>
                </Accordion>
            </div>
        </>
    );
};

export default Home;
