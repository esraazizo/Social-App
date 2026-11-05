import React, { useState, useEffect } from 'react';
import { likeComment } from '../../services/comments.services';

interface CommentLikeButtonProps {
  postId : string;
  commentId: string;
  initialLikes: number;
  initialIsLiked: boolean;
  onLikeToggle?: (newLikesCount: number, isLikedNow: boolean) => void;
}

export const CommentLikeButton: React.FC<CommentLikeButtonProps> = ({
  postId,
  commentId,
  initialLikes,
  initialIsLiked,
  onLikeToggle,
}) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setLikes(initialLikes);
    setIsLiked(initialIsLiked);
  }, [initialLikes, initialIsLiked]);

  const handleLike = async () => {
    if (isLoading) return;

    const originalIsLiked = isLiked;
    const originalLikes = likes;

    const nextIsLiked = !originalIsLiked;
    const nextLikesCount = originalIsLiked ? originalLikes - 1 : originalLikes + 1;

    setIsLiked(nextIsLiked);
    setLikes(nextLikesCount);
    setIsLoading(true);

    if (onLikeToggle) {
      onLikeToggle(nextLikesCount, nextIsLiked);
    }

    try {
      await likeComment(postId ,commentId);
    } catch (error) {
      // console.error('Failed to toggle comment like:', error);
      setIsLiked(originalIsLiked);
      setLikes(originalLikes);
      if (onLikeToggle) {
        onLikeToggle(originalLikes, originalIsLiked);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 text-xs font-semibold transition hover:underline bg-transparent border-none cursor-pointer ${
        isLiked ? "text-[#1f6fe5]" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <span>{likes > 0 ? `${likes} ` : ""}Like</span>
    </button>
  );
};
