import React, { useState, useEffect } from 'react';
import { BookmarkPost } from '../../services/post.services';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  postId: string;
  initialIsSaved: boolean;
}

export const BookMark: React.FC<BookmarkButtonProps> = ({
  postId,
  initialIsSaved,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(initialIsSaved);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const handleBookmarkToggle = async () => {
    if (isLoading) return;

    const originalIsSaved = isSaved;
    setIsSaved(!originalIsSaved);
    setIsLoading(true);

    try {
      await BookmarkPost(postId);
    } catch (error) {
      // console.error('Failed to update bookmark status:', error);
      setIsSaved(originalIsSaved);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmarkToggle}
      disabled={isLoading}
      className="flex items-center justify-center p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none disabled:opacity-50"
      aria-label={isSaved ? "Remove bookmark" : "Bookmark post"}
    >
      <Bookmark
        className={`w-5 h-5 transition-transform duration-200 active:scale-125 ${
          isSaved 
            ? 'fill-yellow-500 stroke-yellow-500 text-yellow-500' 
            : 'fill-transparent stroke-gray-500 dark:stroke-gray-400 hover:stroke-yellow-500'
        }`}
        strokeWidth={2}
      />
    </button>
  );
};
