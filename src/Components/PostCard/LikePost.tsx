import React, { useState, useEffect } from 'react';
import { likePost } from '../../services/post.services';
import { FiThumbsUp } from 'react-icons/fi';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialIsLiked?: boolean;
  onLikeToggle?: (newLikesCount: number, nextIsLikedState: boolean) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikes,
  initialIsLiked = false,
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
      await likePost(postId);
    } catch (error) {
      // console.error('Failed to update like status on server:', error);
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
      className={`flex items-center justify-center gap-2 py-2 text-[14px] font-semibold rounded-lg transition hover:bg-gray-50 `}
      aria-label={isLiked ? "Unlike post" : "Like post"}
    >
         <FiThumbsUp className={`w-4 h-4 ${isLiked ? "fill-[#1f6fe5]" : ""}`} />
     
      <span className={isLiked ? 'text-[#1f6fe5]' : 'text-gray-600'}>Like</span>

    </button>
  );
};


