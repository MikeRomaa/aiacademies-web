import Link from 'next/link';

interface NextContentButtonProps {
    nextContent: { id: number; title: string } | null;
    courseId: number;
}

const NextContentButton: React.FC<NextContentButtonProps> = ({ nextContent, courseId }) => {
    if (!nextContent) return null;

    return (
        <Link href={`/courses/${courseId}/lesson/${nextContent.id}`}>
            <button>
                Next: {nextContent.title}
            </button>
        </Link>
    );
};
