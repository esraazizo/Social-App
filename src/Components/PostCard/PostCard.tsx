import { useContext, useEffect, useState } from "react";
import { FiMoreHorizontal, FiGlobe, FiMessageSquare } from "react-icons/fi";
import { FaThumbsUp } from "react-icons/fa";
import { BiShare } from "react-icons/bi";
import type { PostCardInterface, TopComment } from "../../types/PostCardType.types";
import moment from "moment";
import { Link } from "react-router";
import { deleteComment, getPostComments } from "../../services/comments.services";
import PostComment from "./PostComment";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import { CiBookmark, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UserContext, type UserContextType } from "../Context/UserContext";
import EditPost from "./EditPost";
import { BookmarkPost, deletePost } from "../../services/post.services";
import toast from "react-hot-toast";
import EditComment from "./EditComment";
import { LikeButton } from "./LikePost";
import { CommentItem } from './CommentItem';


function PostCard({ post, getAllPosts }: { post: PostCardInterface, getAllPosts: () => void }) {
  // console.log(post);
  const [allComments, setAllComments] = useState<TopComment[] | []>([])
  const [visibleComments, setVisibleComments] = useState(1)
  const { userData }: UserContextType = useContext(UserContext)
  const [showEditPost, setShowEditPost] = useState<boolean>(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(null);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(!!post.bookmarked);

  // savepost
  const handleBookmarkToggle = async () => {
    if (isBookmarkLoading) return;

    const originalIsSaved = isSaved;
    setIsSaved(!originalIsSaved); // Optimistic UI toggle
    setIsBookmarkLoading(true);

    try {
      const {data}= await BookmarkPost(post._id);
      // console.log(data);
    } catch (error) {
      console.error("Failed to update bookmark status:", error);
      setIsSaved(originalIsSaved); // Revert back if API fails
    } finally {
      setIsBookmarkLoading(false);
    }
  };

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
    getComments(post._id!)
  }, [post._id, allComments.length])

  async function deleteMyPost(postId: string) {
    try {
      const { data } = await deletePost(postId)
      // console.log(data.data.comments);
      toast.success(data.message)
      getAllPosts()

    } catch (error) {
      console.log(error);
    }
  }

  async function deleteMyComment(postId: string, commentId: string) {
    try {
      const { data } = await deleteComment(postId, commentId)
      toast.success(data.message)
      getComments(post._id)

    } catch (error) {
      // console.log(error);
    }
    finally {
      setCommentIdToDelete(null);
    }

  }
  // like post 
  const currentUserId = userData?._id;
  const [likesCount, setLikesCount] = useState<number>(post.likesCount);
  const [likesArray, setLikesArray] = useState<string[]>(post.likes || []);
  useEffect(() => {
    setLikesCount(post.likesCount);
    setLikesArray(post.likes || []);
  }, [post.likesCount, post.likes]);

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
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm text-slate-900 font-sans mb-5">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
            <img
              src={post.user.photo}
              alt={post.user.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* User Info */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] hover:underline cursor-pointer">{post.user.name} </span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
              <span className="hover:underline cursor-pointer">@{post.user.username} </span>
              <span>.</span>
              <span>{moment(post.createdAt).fromNow()}</span>
              <span>.</span>

              <FiGlobe className="w-3.5 h-3.5" title="Public" />
              <span>{post.privacy}</span>
            </div>
          </div>
        </div>
        {/* Header More Button */}
        {post.user._id === userData?._id ? <>
          <Dropdown>
            <Button aria-label="Menu" variant="ghost">
              <FiMoreHorizontal className="w-5 h-5" />
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                <Dropdown.Item
                  id="save-post"
                  textValue={isSaved ? "unsave-post" : "save-post"}
                  onClick={handleBookmarkToggle}
                >
                  <Label className="flex items-center gap-2 font-medium text-slate-700">
                    <CiBookmark
                      size={18}
                      className={isSaved ? "fill-yellow-500 text-yellow-500" : "text-slate-500"}
                    />
                    {isSaved ? "Unsave post" : "Save post"}
                  </Label>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowEditPost(true)}
                  id="edit-post" textValue="edit post">
                  <Label className="flex  items-center gap-2  font-semibold text-slate-700"> <CiEdit size={18} />Edit post</Label>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowDeleteAlert(true)} id="delete-post" textValue="Delete post" className="hover:bg-rose-50 ">
                  <Label className="flex items-center gap-2  font-semibold text-rose-600 hover:bg-rose-100"> <RiDeleteBin6Line size={18} /> Delete post</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </> : <>
          <Dropdown>
            <Button aria-label="Menu" variant="ghost">
              <FiMoreHorizontal className="w-5 h-5" />
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                <Dropdown.Item
                  id="save-post"
                  textValue={isSaved ? "unsave-post" : "save-post"}
                  onClick={handleBookmarkToggle}
                >
                  <Label className="flex items-center gap-2 font-medium text-slate-700">
                    <CiBookmark
                      size={18}
                      className={isSaved ? "fill-yellow-500 text-yellow-500" : "text-slate-500"}
                    />
                    {isSaved ? "Unsave post" : "Save post"}
                  </Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown></>}

      </div>
      {/* delete alert post */}
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
                  <Button onClick={() => deleteMyPost(post._id)}
                    slot="close" variant="danger">
                    Delete post
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </div>

      {/* edit form */}
      {showEditPost ? <EditPost postId={post._id} setShowEditPost={setShowEditPost} getAllPosts={getAllPosts} /> : <>
        {/* 2. Post Content Text */}
        <div className="px-4 pb-3 text-[15px] text-slate-800">
          <p>{post.body}</p>
        </div>
        {/* 3. Post Main Image */}
        {post.image && <>
          <div className="w-full overflow-hidden bg-black max-h-112.5 flex items-center justify-center">
            <img
              src={post.image}
              alt={post.body}
              className="w-full h-auto object-cover max-h-112.5"
            />
          </div>
        </>}
      </>}

      {/* 4. Engagement Stats / Counts Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-[13px] text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#1f6fe5] text-white p-0.5">
            <FaThumbsUp className="w-2.5 h-2.5" />
          </span>

          <span className="hover:underline cursor-pointer">{likesCount} likes</span>

        </div>
        <div className="flex items-center gap-3">
          <span className="hover:underline cursor-pointer">{post.sharesCount} shares</span>
          <span className="hover:underline cursor-pointer">{allComments.length > 0 ? allComments.length : post.commentsCount} comments</span>
          <Link to={`/postDetails/${post._id}`} className="text-[#1f6fe5] font-semibold hover:underline cursor-pointer text-[12px]">View details</Link>
        </div>
      </div>

      {/* 5. Action Buttons (Like, Comment, Share) */}
      <div className="grid grid-cols-3 gap-1 px-2 py-1 border-b border-gray-100">

        <LikeButton
          postId={post.id || post._id}
          initialLikes={likesCount}
          initialIsLiked={currentUserId ? likesArray.includes(currentUserId) : false}
          onLikeToggle={handleLikeToggle} // Pass the layout syncing function
        />

        <button type="button" className="flex items-center justify-center gap-2 py-2 text-gray-600 text-[14px] font-semibold rounded-lg transition hover:bg-gray-50">
          <FiMessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-2 py-2 text-gray-600 text-[14px] font-semibold rounded-lg transition hover:bg-gray-50">
          <BiShare className="w-4.5 h-4.5 scale-x-[-1]" />
          <span>Share</span>
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
          <div key={comment._id}>
            <div className="p-3 bg-[#F7F8FA]">
              <div className="flex gap-2.5 items-start">
                {/* Commenter Profile Pic */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-gray-300">
                  <img
                    src={comment.commentCreator?.photo}
                    alt={comment.commentCreator?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Comment Bubble Content */}
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

                      {/* Edit comment */}
                      {comment.commentCreator._id === userData?._id ? <>
                        <Dropdown>
                          <Button aria-label="Menu" variant="ghost" className="p-1 min-w-0 h-auto hover:bg-gray-100 rounded-full">
                            <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Dropdown.Popover>
                            <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                              <Dropdown.Item onClick={() => setEditingCommentId(comment._id)} id="edit-comment" textValue="edit comment">
                                <Label className="flex  items-center gap-2  font-semibold text-slate-700">
                                  <CiEdit size={16} />Edit comment
                                </Label>
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => setCommentIdToDelete(comment._id)}
                                id="delete-comment" textValue="Delete comment" className="hover:bg-rose-50">
                                <Label className="flex  items-center gap-2  font-semibold text-rose-600 hover:bg-rose-100">
                                  <RiDeleteBin6Line size={16} /> Delete comment
                                </Label>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown></> :
                        <>
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

                              <Button onClick={() => deleteMyComment(post._id, comment._id)}
                                slot="close" variant="danger">
                                Delete comment
                              </Button>
                            </AlertDialog.Footer>
                          </AlertDialog.Dialog>
                        </AlertDialog.Container>
                      </AlertDialog.Backdrop>
                    </AlertDialog>
                  </div>

                  {editingCommentId === comment._id ? <EditComment postId={post._id} commentId={comment._id} setEditingCommentId={setEditingCommentId}
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

              <div className="">

                <CommentItem
                  comment={comment}
                  currentUserId={userData?._id}
                  postId={post._id}
                />
              </div>
            </div>
          </div>
        )
        : <></>}
      {/* click btn  */}
      {visibleComments < allComments.length &&
        <div className="px-4 pb-4 bg-[#F7F8FA]">
          <button
            onClick={() => setVisibleComments(allComments.length)}
            className="text-blue-600 font-semibold text-xs hover:underline block cursor-pointer"
          >
            View all {allComments.length} comments
          </button>
        </div>
      }
      <div className="px-4 bg-[#F7F8FA] rounded-b-xl">
        <PostComment postId={post._id} getComments={getComments} />
      </div>
    </div>
  );
}

export default PostCard;
