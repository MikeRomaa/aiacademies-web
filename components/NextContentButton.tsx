import React from 'react';
import { useRouter } from 'next/router';

interface Content {
    id: number;
    number: number;
    title: string;
    type: 'lesson' | 'quiz';
}

interface NextContentButtonProps {
    currentNumber: number;
    contents: Content[];
    courseId: number;
}

const NextContentButton: React.FC<NextContentButtonProps> = ({ currentNumber, contents, courseId }) => {
    const router = useRouter();

    // Find the next content based on the current number
    const nextContent = contents.find((content) => content.number === currentNumber + 1);

    // If no next content, return null or display 'Course Completed'
    if (!nextContent) {
        return <p className="text-green-600 font-semibold mt-4">Course Completed!</p>; // Optional feedback
    }

    const handleClick = () => {
        const path =
            nextContent.type === 'lesson'
                ? `/courses/${courseId}/lesson/${nextContent.id}`
                : `/courses/${courseId}/quiz/${nextContent.id}`;
        router.push(path);
    };

    return (
        <button
            onClick={handleClick}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 transition"
        >
            Next: {nextContent.type === 'lesson' ? 'Lesson' : 'Quiz'} {nextContent.number} - {nextContent.title}
        </button>
    );
};

export default NextContentButton;
