import React from 'react';
import Link from 'next/link';

interface NextContentButtonProps {
    nextContent: { type: 'lesson' | 'quiz'; id: number; title: string } | null;
    courseId: number;
}

const NextContentButton: React.FC<NextContentButtonProps> = ({ nextContent, courseId }) => {
    if (!nextContent) {
        return null;
    }

    const { type, id, title } = nextContent;

    return (
        <Link href={`/courses/${courseId}/${type}/${id}`} passHref>
            <button className="btn-primary">
                Next: {title}
            </button>
        </Link>
    );
};

export default NextContentButton;
