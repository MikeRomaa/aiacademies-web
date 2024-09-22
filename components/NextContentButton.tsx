import React from 'react';
import { useRouter } from 'next/router';

interface NextContentButtonProps {
    nextContent: {
        type: 'lesson' | 'quiz';
        id: number;
        title: string;
    } | null;
}

const NextContentButton: React.FC<NextContentButtonProps> = ({ nextContent }) => {
    const router = useRouter();

    if (!nextContent) {
        return null; // Don't show the button if there's no next content
    }

    const handleNextClick = () => {
        const nextUrl = nextContent.type === 'lesson'
            ? `/lessons/${nextContent.id}`
            : `/quizzes/${nextContent.id}`;
        router.push(nextUrl);
    };

    return (
        <button onClick={handleNextClick} className="btn-next">
            Next: {nextContent.title}
        </button>
    );
};

export default NextContentButton;
