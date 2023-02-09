import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaDiscord, FaInstagram } from 'react-icons/fa';
import logo from '~/public/img/full_logo.png';

const Footer: React.FC = () => (
    <footer className="bg-slate-100">
        <div className="container flex flex-col lg:flex-row justify-between py-16">
            <div>
                <Image src={logo} alt="AI Academies" height={100} width={333} />
                <p className="mb-0">&copy; {new Date().getFullYear()} Young Brains AI</p>
                <p>All Rights Reserved</p>
            </div>
            <div>
                <h4 className="mb-3 font-medium">Explore</h4>
                <Link href="/" passHref>
                    <a><p>Home</p></a>
                </Link>
                <Link href="/courses" passHref>
                    <a><p>Courses</p></a>
                </Link>
                <Link href="/about" passHref>
                    <a><p>About Us</p></a>
                </Link>
                <Link href="/partners" passHref>
                    <a><p>Partners</p></a>
                </Link>
            </div>
            <div>
                <h4 className="mb-3 font-medium">Contact Us</h4>
                <a href="mailto:youngbrainsai@gmail.com">
                    <p className="mb-2">youngbrainsai@gmail.com</p>
                </a>
                <a href="https://discord.gg/XSn8nxqvw4" target="_blank" rel="noreferrer">
                    <button className="btn-social">
                        <FaDiscord size={21} />
                    </button>
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;
