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
            <div className="container flex items-center justify-between px-4 lg:px-8">
                {/* Hamburger Menu Button */}
                <button 
                    className="lg:hidden text-2xl text-gray-900"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                {/* Logo */}
                <Link href="/" passHref>
                    <a className="flex-shrink-0" aria-label="AI Academies home">
                        <Image
                            src={logo}
                            alt="AI Academies Logo"
                            height={60}
                            width={200}
                            className="w-auto h-16 lg:h-24"
                        />
                    </a>
                </Link>
                {/* Navigation Links for larger screens */}
                <div className="hidden lg:flex lg:ml-auto lg:gap-8 items-center">
                    <Link href="/" passHref>
                        <a className="py-2 hover:text-deepblue-500">Home</a>
                    </Link>
                    <Link href="/courses" passHref>
                        <a className="py-2 hover:text-deepblue-500">Courses</a>
                    </Link>
                    <Link href="/about" passHref>
                        <a className="py-2 hover:text-deepblue-500">About Us</a>
                    </Link>
                    <Link href="/partners" passHref>
                        <a className="py-2 hover:text-deepblue-500">Partners</a>
                    </Link>
                    <Link href="/blog" passHref>
                        <a className="py-2 hover:text-deepblue-500">Blog</a>
                    </Link>
                </div>
                {/* Sign In/Sign Out and Session Info */}
                <div className="hidden lg:flex items-center gap-4 ml-auto">
                    {session ? (
                        <>
                            <p className="font-medium">Signed in as {session.fullName}</p>
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
                                <a className="font-medium hover:text-deepblue-500">
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
                <div className="flex flex-col h-full">
                    <button 
                        className="absolute top-4 right-4 text-white text-2xl"
                        onClick={toggleMenu}
                        aria-label="Close menu"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="flex flex-col items-center justify-center flex-1 overflow-y-auto px-4">
                        <Link href="/" passHref>
                            <a className="text-white text-2xl py-4 hover:text-deepblue-500" onClick={toggleMenu}>Home</a>
                        </Link>
                        <Link href="/courses" passHref>
                            <a className="text-white text-2xl py-4 hover:text-deepblue-500" onClick={toggleMenu}>Courses</a>
                        </Link>
                        <Link href="/about" passHref>
                            <a className="text-white text-2xl py-4 hover:text-deepblue-500" onClick={toggleMenu}>About Us</a>
                        </Link>
                        <Link href="/partners" passHref>
                            <a className="text-white text-2xl py-4 hover:text-deepblue-500" onClick={toggleMenu}>Partners</a>
                        </Link>
                        <Link href="/blog" passHref>
                            <a className="text-white text-2xl py-4 hover:text-deepblue-500" onClick={toggleMenu}>Blog</a>
                        </Link>
                        {session ? (
                            <Link href="/signout" passHref>
                                <a>
                                    <Button className="bg-deepblue-500 text-white font-medium mb-4" onClick={toggleMenu}>
                                        Sign Out
                                    </Button>
                                </a>
                            </Link>
                        ) : (
                            <>
                                <Link href="/signin" passHref>
                                    <a className="text-white text-2xl py-4 hover:text-deepblue-500" onClick={toggleMenu}>Sign In</a>
                                </Link>
                                <Link href="/signup" passHref>
                                    <a>
                                        <Button className="bg-deepblue-500 text-white font-medium mb-4" onClick={toggleMenu}>
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
