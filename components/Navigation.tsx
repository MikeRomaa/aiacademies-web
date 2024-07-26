import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { useSession } from '~/utils/sessionHooks';
import logo from '~/public/img/full_logo.png';

const Navigation: React.FC = () => {
    const session = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <nav className="sticky top-0 bg-white z-30 py-4">
            <div className="container flex items-center justify-between gap-4 lg:gap-8">
                {/* Hamburger Menu Button */}
                <button
                    className="lg:hidden flex items-center"
                    onClick={toggleMenu}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                {/* Logo */}
                <Link href="/" passHref>
                    <a className="flex-shrink-0">
                        <Image
                            src={logo}
                            alt="AI Academies"
                            height={100}
                            width={333}
                            className="w-auto h-16 lg:h-24"
                        />
                    </a>
                </Link>
                {/* Navigation Links for larger screens */}
                <div className="hidden lg:flex lg:ml-auto lg:gap-8">
                    <Link href="/" passHref>
                        <a className="py-2">Home</a>
                    </Link>
                    <Link href="/courses" passHref>
                        <a className="py-2">Courses</a>
                    </Link>
                    <Link href="/about" passHref>
                        <a className="py-2">About Us</a>
                    </Link>
                    <Link href="/partners" passHref>
                        <a className="py-2">Partners</a>
                    </Link>
                    <Link href="/blog" passHref>
                        <a className="py-2">Blog</a>
                    </Link>
                </div>
                {/* Sign In/Sign Out and Session Info */}
                <div className="hidden lg:flex items-center gap-4 ml-auto">
                    {session ? (
                        <>
                            <p className="font-medium hidden lg:block">Signed in as {session.fullName}</p>
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
                                <a className="font-medium hidden lg:block">
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
            </div>
            {/* Off-Canvas Menu */}
            <div
                className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}
                onClick={toggleMenu}
            >
                <div className="flex flex-col items-center justify-center h-full">
                    <button className="absolute top-4 right-4 text-white" onClick={toggleMenu}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="flex flex-col items-center space-y-4">
                        <Link href="/" passHref>
                            <a className="text-white text-xl" onClick={toggleMenu}>Home</a>
                        </Link>
                        <Link href="/courses" passHref>
                            <a className="text-white text-xl" onClick={toggleMenu}>Courses</a>
                        </Link>
                        <Link href="/about" passHref>
                            <a className="text-white text-xl" onClick={toggleMenu}>About Us</a>
                        </Link>
                        <Link href="/partners" passHref>
                            <a className="text-white text-xl" onClick={toggleMenu}>Partners</a>
                        </Link>
                        <Link href="/blog" passHref>
                            <a className="text-white text-xl" onClick={toggleMenu}>Blog</a>
                        </Link>
                        {session ? (
                            <Link href="/signout" passHref>
                                <a>
                                    <Button className="bg-deepblue-500 text-white font-medium" onClick={toggleMenu}>
                                        Sign Out
                                    </Button>
                                </a>
                            </Link>
                        ) : (
                            <>
                                <Link href="/signin" passHref>
                                    <a className="text-white text-xl" onClick={toggleMenu}>Sign In</a>
                                </Link>
                                <Link href="/signup" passHref>
                                    <a>
                                        <Button className="bg-deepblue-500 text-white font-medium" onClick={toggleMenu}>
                                            Sign Up
                                        </Button>
                                    </a>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navigation;
/*
    return (
        <nav className="sticky top-0 bg-white z-30 py-4">
            <div className="container flex items-center gap-8">
                <Link href="/" passHref>
                    <a>
                        <Image src={logo} alt="AI Academies" height={100} width={333} />
                    </a>
                </Link>
                <button className="lg:hidden ml-auto" onClick={toggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <div className={`flex-col lg:flex-row lg:flex lg:ml-auto ${isMenuOpen ? 'flex' : 'hidden'} lg:gap-8`}>
                    <Link href="/" passHref>
                        <a className="ml-0 lg:ml-auto lg:block">
                            Home
                        </a>
                    </Link>
                    <Link href="/courses" passHref>
                        <a className="lg:block">
                            Courses
                        </a>
                    </Link>
                    <Link href="/about" passHref>
                        <a className="lg:block">
                            About Us
                        </a>
                    </Link>
                    <Link href="/partners" passHref>
                        <a className="lg:block">
                            Partners
                        </a>
                    </Link>
                    <Link href="/blog" passHref>
                        <a className="lg:block">
                            Blog
                        </a>
                    </Link>
                    {session ? (
                        <>
                            <p className="font-medium lg:block">Signed in as {session.fullName}</p>
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
                                <a className="font-medium lg:ml-0">
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
            </div>
        </nav>
    );
};
    return (
        <nav className="sticky top-0 bg-white z-30 py-4">
            <div className="container flex items-center gap-8">
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
*/
