import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { useSession } from '~/utils/sessionHooks';
import logo from '~/public/img/full_logo.png';

const Navigation: React.FC = () => {
    const session = useSession();

    return (
        <nav className="sticky top-0 bg-white z-30">
            <div className="container flex items-center gap-8">
                <Link href="/" passHref>
                    <a>
                        <Image src={logo} alt="AI Academies" height={100} width={333} />
                    </a>
                </Link>
                {session ? (
                    <>
                        <p className="ml-auto font-medium">Signed in as {session.fullName}</p>
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
                            <a className="ml-auto font-medium">
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
