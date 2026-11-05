import React, { useContext, useEffect, useState } from "react";
import {
    ArrowLeft,
    MessageCircle,
    Share2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { deletePost, getSinglePost } from "../../services/post.services";
import type { PostCardInterface, TopComment } from "../../types/PostCardType.types";
import { FiGlobe, FiMoreHorizontal } from "react-icons/fi";
import moment from "moment";
import { deleteComment, getPostComments } from "../../services/comments.services";
import PostComment from "../PostCard/PostComment";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import { CiBookmark, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UserContext, type UserContextType } from "../Context/UserContext";
import EditPost from "../PostCard/EditPost";
import toast from "react-hot-toast";
import EditComment from "../PostCard/EditComment";
import { FaThumbsUp } from "react-icons/fa";
import { LikeButton } from "../PostCard/LikePost";
import { CommentItem } from "../PostCard/CommentItem";

function PostDetails() {
    const { id } = useParams()
    // console.log(id);
    const [details, setDetails] = useState<PostCardInterface | null>(null)
    const [allComments, setAllComments] = useState<TopComment[] | []>([])
    const [visibleComments, setVisibleComments] = useState(1)
    const { userData }: UserContextType = useContext(UserContext)
    const [showEditPost, setShowEditPost] = useState<boolean>(false)
    const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
    const navigate = useNavigate();
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

    // const [showEditComment, setShowEditComment] = useState<boolean>(false)

    const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(null);

    async function getPostDetails(postId: string) {
        try {
            const { data } = await getSinglePost(postId)
            // console.log(data);
            setDetails(data.data.post)
            // console.log(data.data.post);
        } catch (error) {
            console.log(error);
        }

    }

    async function getComments(postId: string) {
        try {
            const { data } = await getPostComments(postId)
            // console.log(data.data.comments);
            setAllComments(data.data.comments)

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getPostDetails(id!);
        getComments(id!)
    }, [allComments.length, id, details?.image])

    async function deleteMyPost(postId: string) {
        try {
            const { data } = await deletePost(postId)
            // console.log(data.data.comments);
            toast.success(data.message)
            //   getAllPosts()
            navigate("/feed");

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteMyComment(postId: string, commentId: string) {
        try {
            const { data } = await deleteComment(postId, commentId)
            toast.success(data.message)
            getComments(details?._id!)

        } catch (error) {
            console.log(error);
        }
        finally {
            setCommentIdToDelete(null);
        }

    }

    // like post
    const currentUserId = userData?._id;

    const [likesCount, setLikesCount] = useState<number>(details?.likesCount || 0);
    const [likesArray, setLikesArray] = useState<string[]>(details?.likes || []);

    useEffect(() => {
        setLikesCount(details?.likesCount || 0);
        setLikesArray(details?.likes || []);
    }, [details?.likesCount, details?.likes]);

    const handleLikeToggle = (newLikesCount: number, isLikedNow: boolean) => {
        setLikesCount(newLikesCount);

        if (currentUserId) {
            setLikesArray((prev) =>
                isLikedNow
                    ? [...prev, currentUserId]
                    : prev.filter((id) => id !== currentUserId)
            );
        }
    };


    return (
        <>
            <div className="min-h-screen bg-[#f4f7fa] pb-12">
                <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pt-6">
                    <div className="mb-4">
                        <Link
                            className="inline-flex min-h-12 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200 hover:text-gray-900 bg-white border"
                            to="/feed"
                        >
                            <ArrowLeft aria-hidden="true" size={17} />
                            Back to feed
                        </Link>
                    </div>
                    <div>
                        {details && <>
                            <article className="mx-auto mb-2 mt-2 w-full  overflow-hidden rounded-xl border border-gray-200 bg-white 
                            shadow-sm ">
                                {/* 1. Header Section */}
                                <div className="flex items-center p-3 pb-2 justify-between ">
                                    <div className="flex items-center gap-3">
                                        {/* User Avatar */}
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                                            <img
                                                src={details.user.photo}
                                                alt={details.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* User Info */}
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-[15px] hover:underline cursor-pointer">{details.user.name} </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                                                <span className="hover:underline cursor-pointer">@{details.user.username} </span>
                                                <span>.</span>
                                                <span>{moment(details.createdAt).fromNow()}</span>
                                                <span>.</span>

                                                <FiGlobe className="w-3.5 h-3.5" title="Public" />
                                                <span>{details.privacy}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Header More Button */}
                                    {details.user._id === userData?._id ? <>
                                        <Dropdown>
                                            <Button aria-label="Menu" variant="ghost">
                                                <FiMoreHorizontal className="w-5 h-5" />
                                            </Button>
                                            <Dropdown.Popover>
                                                <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                                                    <Dropdown.Item id="save-post" textValue="save post">
                                                        <Label className="flex items-center gap-2 font-semibold text-slate-700">
                                                            <CiBookmark size={18} />Save post</Label>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => setShowEditPost(true)} id="edit-post" textValue="edit post">
                                                        <Label className="flex  items-center gap-2  font-semibold text-slate-700"> <CiEdit size={18} />Edit post</Label>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => setShowDeleteAlert(true)} id="delete-post" textValue="Delete post" className="hover:bg-rose-50 ">
                                                        <Label className="flex items-center gap-2  font-semibold text-rose-600 hover:bg-rose-100"> <RiDeleteBin6Line size={18} /> Delete post</Label>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown.Popover>
                                        </Dropdown></> : <>
                                        <Dropdown>
                                            <Button aria-label="Menu" variant="ghost">
                                                <FiMoreHorizontal className="w-5 h-5" />
                                            </Button>
                                            <Dropdown.Popover>
                                                <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                                                    <Dropdown.Item id="save-post" textValue="save post">
                                                        <Label className="flex items-center gap-2 font-semibold text-slate-700">
                                                            <CiBookmark size={18} />Save post</Label>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown.Popover>
                                        </Dropdown></>}

                                </div>

                                {/* delete alert */}
                                <div>
                                    <AlertDialog isOpen={showDeleteAlert}>
                                        <AlertDialog.Backdrop>
                                            <AlertDialog.Container>
                                                <AlertDialog.Dialog className="sm:max-w-100">
                                                    <AlertDialog.CloseTrigger />
                                                    <AlertDialog.Header>
                                                        <AlertDialog.Icon status="danger" />
                                                        <AlertDialog.Heading>Delete post permanently?</AlertDialog.Heading>
                                                    </AlertDialog.Header>
                                                    <AlertDialog.Body>
                                                        <p>
                                                            This will permanently delete <strong>My Awesome post</strong> and all of its
                                                            data. This action cannot be undone.
                                                        </p>
                                                    </AlertDialog.Body>
                                                    <AlertDialog.Footer>
                                                        <Button onClick={() => setShowDeleteAlert(false)}
                                                            slot="close" variant="tertiary">
                                                            Cancel
                                                        </Button>
                                                        <Button onClick={() => deleteMyPost(details._id)}
                                                            slot="close" variant="danger">
                                                            Delete post
                                                        </Button>
                                                    </AlertDialog.Footer>
                                                </AlertDialog.Dialog>
                                            </AlertDialog.Container>
                                        </AlertDialog.Backdrop>
                                    </AlertDialog>
                                </div>
                                {/* edit post  */}
                                {showEditPost ? <EditPost postId={details._id} setShowEditPost={setShowEditPost}
                                    getAllPosts={() => {
                                        if (details._id) {
                                            getPostDetails(details._id);
                                        }
                                    }}
                                /> : <>
                                    {/* 2. Post Content Text */} {/* 3. Post Main Image */}
                                    <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
                                        <p>{details.body}</p>
                                    </div>
                                    {details.image && <img className="block max-h-130 w-full bg-gray-100 object-cover"
                                        src={details.image}
                                        alt={details.body} />
                                    }

                                </>}

                                <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
                                    <div className="flex items-center gap-2">

                                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#1f6fe5] text-white p-0.5">
                                            <FaThumbsUp className="w-2.5 h-2.5" />
                                        </span>

                                        <span className="hover:underline cursor-pointer"> {likesCount} likes</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span>{details.commentsCount} comments</span>
                                        <span>{details.sharesCount} shares</span>
                                    </div>
                                </div>
                                <div className="mx-4 flex border-y border-gray-200 sm:mx-5">

                                    <LikeButton
                                        postId={details.id || details._id}
                                        initialLikes={likesCount}
                                        initialIsLiked={currentUserId ? likesArray.includes(currentUserId) : false}
                                        onLikeToggle={handleLikeToggle}
                                    />

                                    <button
                                        className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                                        type="button"
                                    >
                                        <MessageCircle size={18} />
                                        Comment
                                    </button>
                                    <button
                                        className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                                        type="button"
                                    >
                                        <Share2 size={18} />
                                        Share
                                    </button>
                                </div>

                                {/* mapping */}

                                {visibleComments === 1 && allComments.length > 0 && <>
                                    <span className="text-[12px]  bg-[#F7F8FA] font-semibold text-gray-500 tracking-wide uppercase block pb-3 px-4 pt-4 ">
                                        Top Comment
                                    </span>
                                </>
                                }

                                {/* 3. Map through the comments limited by visibleComments count */}
                                {allComments.length > 0 ?
                                    allComments.slice(0, visibleComments).map((comment) =>
                                        <React.Fragment key={comment._id}>
                                            <div className="p-3 bg-[#F7F8FA]">
                                                <div className="flex gap-2.5 items-start">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-300">
                                                        <img
                                                            src={comment.commentCreator?.photo}
                                                            alt={comment.commentCreator?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="bg-sec shadow-sm rounded-2xl px-4 py-2 max-w-[85%] text-[14px]">

                                                        <div className="flex justify-between items-start gap-8">

                                                            <div className="flex flex-col min-w-0 leading-tight">
                                                                <p className="font-bold text-[13px] hover:underline cursor-pointer text-slate-900 leading-normal">
                                                                    {comment.commentCreator?.name}
                                                                </p>
                                                                <div className="text-[11px] font-normal text-gray-500 flex items-center gap-1.5 mt-0">
                                                                    <span className="truncate">@{comment.commentCreator?.username}</span>
                                                                    <span className="text-gray-400">•</span>
                                                                    <span className="shrink-0">{moment(comment.createdAt).fromNow()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="shrink-0 -mt-1 -mr-2">
                                                                {comment.commentCreator._id === userData?._id ? <>
                                                                    <Dropdown>
                                                                        <Button aria-label="Menu" variant="ghost" className="p-1 min-w-0 h-auto hover:bg-gray-100 rounded-full">
                                                                            <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
                                                                        </Button>
                                                                        <Dropdown.Popover>
                                                                            <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                                                                                <Dropdown.Item onClick={() => setEditingCommentId(comment._id)} id="edit-comment" textValue="edit comment">
                                                                                    <Label className="flex items-center gap-2 font-semibold text-slate-700">
                                                                                        <CiEdit size={16} />Edit comment
                                                                                    </Label>
                                                                                </Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => setCommentIdToDelete(comment._id)}
                                                                                    id="delete-comment" textValue="Delete comment" className="hover:bg-rose-50">
                                                                                    <Label className="flex items-center gap-2 font-semibold text-rose-600 hover:bg-rose-100">
                                                                                        <RiDeleteBin6Line size={16} /> Delete comment
                                                                                    </Label>
                                                                                </Dropdown.Item>
                                                                            </Dropdown.Menu>
                                                                        </Dropdown.Popover>
                                                                    </Dropdown>
                                                                </> : <>
                                                                </>}
                                                            </div>
                                                        </div>
                                                        {/* delete alert  comment */}
                                                        <div>
                                                            <AlertDialog isOpen={commentIdToDelete === comment._id}>
                                                                <AlertDialog.Backdrop>
                                                                    <AlertDialog.Container>
                                                                        <AlertDialog.Dialog className="sm:max-w-100">
                                                                            <AlertDialog.CloseTrigger />
                                                                            <AlertDialog.Header>
                                                                                <AlertDialog.Icon status="danger" />
                                                                                <AlertDialog.Heading>Delete comment permanently?</AlertDialog.Heading>
                                                                            </AlertDialog.Header>
                                                                            <AlertDialog.Body>
                                                                                <p>
                                                                                    This will permanently delete <strong>My Awesome comment</strong> and all of its
                                                                                    data. This action cannot be undone.
                                                                                </p>
                                                                            </AlertDialog.Body>
                                                                            <AlertDialog.Footer>
                                                                                <Button onClick={() => setCommentIdToDelete(null)}
                                                                                    slot="close" variant="tertiary">
                                                                                    Cancel
                                                                                </Button>

                                                                                <Button onClick={() => deleteMyComment(details._id, comment._id)}
                                                                                    slot="close" variant="danger">
                                                                                    Delete comment
                                                                                </Button>
                                                                            </AlertDialog.Footer>
                                                                        </AlertDialog.Dialog>
                                                                    </AlertDialog.Container>
                                                                </AlertDialog.Backdrop>
                                                            </AlertDialog>
                                                        </div>
                                                        {/* edit comment  */}
                                                        {editingCommentId === comment._id ? <EditComment postId={details._id} commentId={comment._id}
                                                            setEditingCommentId={setEditingCommentId}
                                                            getComments={getComments} commentBody={comment.content} /> : <>
                                                            {/* Comment Body Text */}
                                                            {comment.content && (
                                                                <div className="mt-2 text-slate-800 leading-snug">
                                                                    <p>{comment.content}</p>
                                                                </div>
                                                            )}

                                                            {/* Attached Media Photo */}
                                                            {comment.image && (
                                                                <div className="mt-2 pb-1">
                                                                    <img
                                                                        src={comment.image}
                                                                        alt="Comment attachment"
                                                                        className="max-w-full max-h-60 object-cover rounded-lg border border-gray-100"
                                                                    />
                                                                </div>
                                                            )}
                                                        </>}

                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-[12px] font-semibold text-gray-500 mt-1  select-none ">

                                                    <CommentItem
                                                        comment={comment}
                                                        currentUserId={userData?._id}
                                                        postId={details._id}
                                                    />
                                                </div>
                                            </div>

                                        </React.Fragment>
                                    )
                                    : <></>}

                                {/* load all comments */}
                                {visibleComments < allComments.length &&
                                    <div className="px-8 bg-[#F7F8FA]">
                                        <button
                                            onClick={() => setVisibleComments(allComments.length)}
                                            className="text-blue-600 font-semibold text-xs hover:underline block cursor-pointer"
                                        >
                                            View all {allComments.length} comments
                                        </button>
                                    </div>
                                }
                                {/* form  */}
                                <div className="px-4 bg-[#F7F8FA] rounded-b-xl">
                                    <PostComment postId={details._id} getComments={getComments} />
                                </div>

                            </article>
                        </>

                        }
                    </div>
                </div>

            </div>
        </>
    );
}

export default PostDetails;
