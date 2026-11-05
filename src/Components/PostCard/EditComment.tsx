import axios from "axios";
import { ImagePlus, X } from "lucide-react"
import { useState } from "react";
import toast from "react-hot-toast";
import { updateComment } from "../../services/comments.services";
import { Spinner } from "@heroui/react";

function EditComment({ commentId, postId, setEditingCommentId, getComments, commentBody }: { getComments: (arg0: string) => void, postId: string, commentBody: string, commentId: string, setEditingCommentId: (id: string | null) => void}) {

    const [body, setBody] = useState<string>(commentBody || "");
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const formData = new FormData();
    const [isloading, setIsloading] = useState<boolean>(false)

    // console.log(postId);
    // function to submit data
    async function handleEditComment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsloading(true)
        const hasText = body && body.trim().length > 0;
        const hasPhoto = !!image;
        if (!hasText && !hasPhoto) {
            toast.error("Cannot submit an empty comment.")
            return;
        }
        if (hasText) {
            formData.append("content", body.trim());
        }
        if (hasPhoto) {
            formData.append("image", image);
        }
        try {
            const { data } = await updateComment(postId, commentId, formData);
            toast.success(data.message);
            getComments(postId);
            setBody("");
            setImage(null);
            setImagePreview(null);
            getComments(postId)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to post comment");
            }
        }
        finally {
            setEditingCommentId(null)
        }
    }

    // function to handle image
    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        // console.log(e.target.files?.[0]);
        const file = e.target.files?.[0];
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }
    // close image preview 
    function closeImagePreview() {
        setImagePreview(null)
    }

    return (
        <>
            <form onSubmit={handleEditComment} className="pt-6 flex flex-col gap-2 pb-5 overflow-hidden">
                <div className="flex items-center gap-2.5">

                    <div className=" overflow-hidden flex min-w-0 flex-1 items-center rounded-full bg-sec pr-1.5 transition-all duration-500 ease-in-out focus-within:ring-2 focus-within:ring-blue-200 focus-within:bg-white">
                        <span className="sr-only">${commentBody}</span>

                        <input
                            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500 "
                            id="post-details-comment"
                            placeholder="Write a comment..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <label className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100">
                            <span className="sr-only">Add an image</span>
                            <input
                                accept="image/*"
                                className="sr-only"
                                type="file"
                                onChange={handleImage}
                            />
                            <ImagePlus size={16} />
                        </label>
                        <div className="flex justify-between gap-1.5">
                            <button
                                aria-label="Post comment"
                                className="cursor-pointer rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60"
                                onClick={() => handleEditComment}
                            >
                                {isloading ? <Spinner className='text-white' /> : "Edit"}
                            </button>
                            <button
                                aria-label="Post comment"
                                className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 "
                                onClick={() => setEditingCommentId(null)}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                </div>

            </form>
            {imagePreview && <>
                <div className="overflow-hidden relative w-55 h-55 mb-3">
                    <X className="absolute top-0 right-0 cursor-pointer" onClick={closeImagePreview} />
                    <img src={imagePreview} alt="" className="w-50 h-50 object-cover rounded-lg absolute left-0 bottom-0" />
                </div>
            </>}

        </>
    )
}

export default EditComment