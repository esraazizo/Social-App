import React, { useState, useEffect } from 'react';
import { IoSend } from 'react-icons/io5'; 
import { BiImage, BiSmile } from 'react-icons/bi';
import { createReply, getCommentReplies } from '../../services/comments.services';

interface CommentReplyProps {
    postId: string;
    commentId: string;
    commentCreatorName?: string; 
    userData: any;
    onClose?: () => void;
    onRepliesCountChange?: (count: number) => void;
}

export function CommentReply({ postId, commentId, commentCreatorName = "User", userData, onRepliesCountChange }: CommentReplyProps) {
    const [replies, setReplies] = useState<any[]>([]);
    const [replyText, setReplyText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchReplies();
    }, [postId, commentId]);

    const fetchReplies = async () => {
        setIsLoading(true);
        try {
            const response = await getCommentReplies(postId, commentId);
            const fetchedReplies = response?.data?.replies || [];
            setReplies(fetchedReplies);
            // console.log(response.data.replies);
            if (onRepliesCountChange) {
                onRepliesCountChange(fetchedReplies.length);
            }

        } catch (error) {
            // console.error('Failed to load replies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!replyText.trim() || isSubmitting) return;

        const formData = new FormData();
        formData.append('content', replyText);

        try {
            const response = await createReply(postId, commentId, formData);
            const newReply = response?.reply || response?.data || {
                _id: Math.random().toString(),
                content: replyText,
                commentCreator: {
                    name: userData?.name || 'Me',
                    profileImg: userData?.profileImg
                },
                createdAt: new Date().toISOString()
            };

            setReplies((prev) => [...prev, newReply]);
            setReplyText('');
            fetchReplies()
        } catch (error) {
            // console.error('Could not submit reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pl-4 mt-2 border-l-2 border-gray-200 dark:border-zinc-800 space-y-4 w-full">

            {/* 1. Replies List Display Layout */}
            <div className="space-y-2">
                {isLoading ? (
                    <p className="text-xs text-gray-400 animate-pulse">Loading replies...</p>
                ) : replies.length === 0 && !isSubmitting ? (
                    <p className="text-xs text-gray-400 italic pl-2">No replies yet.</p>
                ) : (
                    replies.map((reply, index) => (
                        <div
                            key={`${reply._id || reply.id || 'reply'}-${index}`}
                            className="flex gap-2 items-start text-xs w-full"
                        >
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-[10px] text-gray-600 mt-1">
                                {reply.commentCreator?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-2xl max-w-[85%]">
                                <span className="font-bold text-gray-900 dark:text-zinc-200 block text-[12px]">
                                    {reply.commentCreator?.name || 'User'}
                                </span>
                                <p className="text-gray-700 dark:text-zinc-300 wrap-break-word mt-0.5 text-sm">
                                    {reply.content}
                                </p>
                                
                            </div>
                        </div>
                    ))
                )}

                {isSubmitting && (
                    <div className="flex gap-2 items-start text-xs opacity-70 animate-pulse pl-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[10px] text-blue-600 mt-1">
                            {userData?.name?.charAt(0).toUpperCase() || 'M'}
                        </div>
                        <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-2xl">
                            <span className="font-bold text-gray-400 text-[11px] block">Sending reply...</span>
                            <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-700 rounded mt-1" />
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Replying to contextual text indicator */}
            <p className="text-[11px] text-gray-400 font-medium pl-8 pt-1">
                Replying to <span className="font-semibold text-gray-600 dark:text-zinc-300">{commentCreatorName}</span>
            </p>

            {/* 3. Modern Polished Rounded Form Layout matching Screenshot 2 */}
            <div className="flex gap-2 items-start">
                {userData?.profileImg ? (
                    <img src={userData.profileImg} alt="" className="w-8 h-8 rounded-full object-cover mt-1" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-1">
                        {userData?.name?.charAt(0).toUpperCase() || 'M'}
                    </div>
                )}

                <form onSubmit={handleSubmitReply} className="flex-1 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-800 p-2 flex flex-col justify-between min-h-17.5 shadow-sm">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        rows={1}
                        className="w-full resize-none text-xs px-2 py-1 focus:outline-none bg-transparent text-gray-800 dark:text-zinc-100 placeholder-gray-400"
                    />

                    <div className="flex justify-between items-center pt-2 px-1 border-t border-gray-50 dark:border-zinc-800/50">
                        <div className="flex gap-2 text-gray-400">
                            <button type="button" className="hover:text-gray-600 transition p-1"><BiImage size={16} /></button>
                            <button type="button" className="hover:text-gray-600 transition p-1"><BiSmile size={16} /></button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !replyText.trim()}
                            className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition disabled:opacity-30 disabled:hover:bg-blue-500"
                        >
                            <IoSend size={14} />
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}


