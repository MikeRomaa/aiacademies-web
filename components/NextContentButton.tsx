interface NextContentButtonProps {
    nextContent: { id: number; title: string } | null; // Can be null if there's no next content
    courseId: number; // The course ID to build the URL
}

const NextContentButton: React.FC<NextContentButtonProps> = ({ nextContent, courseId }) => {
    if (!nextContent) return null; // Don't render anything if there's no next content

    const contentType = nextContent.title.includes("Quiz") ? "quiz" : "lesson"; // Determine if it's a quiz or lesson

    return (
        <Link href={`/courses/${courseId}/${contentType}/${nextContent.id}`} passHref>
            <button className="bg-deepblue-700 text-white p-2 rounded mt-4">
                Next: {nextContent.title}
            </button>
        </Link>
    );
};
