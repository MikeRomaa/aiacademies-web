import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { useSession } from '~/utils/sessionHooks';
import { Accordion, AccordionElement } from '~/components/Accordion';
import logo from '~/public/img/full_logo.png';

const Navigation: React.FC = () => {
    const session = useSession();

    return (
        <nav className="sticky top-0 bg-white z-30 py-4">
            <div className="container flex items-center gap-8">
                <Accordion>
                    <AccordionElement title="Expand">
                        Simply click the “Sign Up” button on the top right, and then enter your full name, email address, and password.
                    </AccordionElement>
                </Accordion>
                <Link href="/" passHref>
                    <a>
                        <Image src={logo} alt="AI Academies" height={100} width={333} />
                    </a>
                </Link>
                <Link href="/" passHref>
                    <a className="ml-0 hidden lg:ml-auto lg:block">
                        Home
                    </a>
                </Link>
                <Link href="/courses" passHref>
                    <a className="hidden lg:block">
                        Courses
                    </a>
                </Link>
                <Link href="/about" passHref>
                    <a className="hidden lg:block">
                        About Us
                    </a>
                </Link>
                <Link href="/partners" passHref>
                    <a className="hidden lg:block">
                        Partners
                    </a>
                </Link>
                <Link href="/blog" passHref>
                    <a className="hidden lg:block">
                        Blog
                    </a>
                </Link>
                {session ? (
                    <>
                        <p className="font-medium hidden lg:visible">Signed in as {session.fullName}</p>
                        <Link href="/signout" passHref>
                            <a>
                                <Button className="bg-deepblue-500 text-white font-medium">
                                    Sign Out
                                </Button>
                            </a>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/signin" passHref>
                            <a className="ml-auto lg:ml-0 font-medium">
                                Sign In
                            </a>
                        </Link>
                        <Link href="/signup" passHref>
                            <a>
                                <Button className="bg-deepblue-500 text-white font-medium">
                                    Sign Up
                                </Button>
                            </a>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
