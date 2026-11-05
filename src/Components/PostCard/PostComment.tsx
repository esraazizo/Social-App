import { ImagePlus, Send, X } from "lucide-react";
import { useContext, useState } from "react";
import { createPostComment } from "../../services/comments.services";
import toast from "react-hot-toast";
import { UserContext, type UserContextType } from "../Context/UserContext";
import axios from "axios";

function PostComment({ postId, getComments }: { postId: string, getComments: (postId: string) => void }) {
    const [body, setBody] = useState<string>("");
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const formData = new FormData();
    const { userData }: UserContextType = useContext(UserContext)

    // console.log(postId);
    // function to submit data
    async function submitComment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
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
            const { data } = await createPostComment(postId, formData);
            toast.success(data.message);
            getComments(postId);
            setBody("");
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to post comment");
            }
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
            <form  onSubmit={submitComment} className="pt-6 flex flex-col gap-2 pb-5 overflow-hidden">
                <div className="flex items-center gap-2.5">
                    <img
                        alt={userData?.name}
                        className="size-8 shrink-0 rounded-full object-cover"
                        src={userData?.photo}
                    />
                    <div className=" overflow-hidden flex min-w-0 flex-1 items-center rounded-full bg-sec pr-1.5 transition-all duration-500 ease-in-out focus-within:ring-2 focus-within:ring-blue-200 focus-within:bg-white">
                        <span className="sr-only">Write a comment</span>
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
                        <button
                            aria-label="Post comment"
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-100 disabled:text-gray-400 disabled:hover:bg-transparent"
                        >
                            <Send size={16} />
                        </button>
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

    );
}

export default PostComment;
