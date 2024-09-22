import React from 'react';
import { useRouter } from 'next/router';

interface NextContentButtonProps {
    nextContent?: {
        type: 'lesson' | 'quiz';
        id: number;
        title: string;
    } | null;
}

const NextContentButton: React.FC<NextContentButtonProps> = ({ nextContent }) => {
    const router = useRouter();

    const handleNext = () => {
        if (nextContent) {
            router.push(`/${nextContent.type === 'lesson' ? 'lessons' : 'quizzes'}/${nextContent.id}`);
        }
    };

    if (!nextContent) return null;

    return (
        <button onClick={handleNext} className="btn">
            Next: {nextContent.title}
        </button>
    );
};

export default NextContentButton;
