import { useState, useEffect, useContext } from 'react';
import { getCommentReplies, likeComment } from '../../services/comments.services';
import { CommentReply } from './CommentReply';
import { UserContext, type UserContextType } from '../Context/UserContext';
import moment from 'moment';

interface CommentItemProps {
    comment: any;
    currentUserId: string | undefined;
    postId: string;
}

export function CommentItem({ comment, currentUserId, postId }: CommentItemProps) {
    // const [repliesCount, setRepliesCount] = useState<number>(0);
    const [repliesCount, setRepliesCount] = useState<number>(comment.replies?.length || 0);
    const { userData }: UserContextType = useContext(UserContext)
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(comment.likes?.length || 0);
    const [likesArray, setLikesArray] = useState<string[]>(comment.likes || []);

    useEffect(() => {
        setLikesCount(comment.likes?.length || 0);
        setLikesArray(comment.likes || []);
    }, [comment.likes]);

    const isLiked = currentUserId ? likesArray.includes(currentUserId) : false;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLike = async () => {
        if (isLoading) return;
        const originalLikesArray = [...likesArray];
        const originalLikesCount = likesCount;
        const willBeLiked = !isLiked;
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

        if (currentUserId) {
            setLikesArray((prev) =>
                willBeLiked
                    ? [...prev, currentUserId]
                    : prev.filter((id) => id !== currentUserId)
            );
        }
        setIsLoading(true);

        try {
            await likeComment(postId, comment._id || comment.id);
        } catch (error) {
            // console.error('Failed to toggle comment like layout on server:', error);
            setLikesArray(originalLikesArray);
            setLikesCount(originalLikesCount);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialCount = async () => {
            try {
                const response = await getCommentReplies(postId, comment._id || comment.id);
                const fetchedReplies = response?.data?.replies || [];
                setRepliesCount(fetchedReplies.length);
            } catch (error) {
                // console.error("Error loading initial replies count:", error);
            }
        };

        if (comment._id || comment.id) {
            loadInitialCount();
        }
    }, [postId, comment._id, comment.id]);


    return (
        <div className="flex flex-col w-full mb-3">
            <div className="flex items-start gap-2 max-w-full"> 
            </div>
            <div className="pl-12 w-full mt-1">
                <div className="flex items-center gap-4 text-[12px] font-semibold text-gray-500">
                    <span className="font-normal text-gray-400">
                        {moment(comment.createdAt).fromNow(true)
                            .replace("a minute", "1m")
                            .replace("minutes", "m")
                            .replace("hours", "h")
                            .replace("days", "d")}
                    </span>

                    <button
                        type="button"
                        onClick={handleLike}
                        className={`hover:underline cursor-pointer font-semibold ${isLiked ? "text-[#1f6fe5]" : "text-gray-500"
                            }`}
                    >
                        Like ({likesCount})
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowReplies(!showReplies)}
                        className="hover:underline cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                        {showReplies ? "Hide replies" : `Reply (${repliesCount})`}
                    </button>
                </div>

                {showReplies && (
                    <div className="w-full mt-2">
                        <CommentReply
                            postId={postId}
                            commentId={comment._id || comment.id}
                            commentCreatorName={comment.commentCreator?.name}
                            userData={userData}
                            onRepliesCountChange={(newCount) => setRepliesCount(newCount)} 
                        />
                    </div>
                )}
            </div>
        </div>
    );


};


