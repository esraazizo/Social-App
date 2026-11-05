import { useContext, useEffect, useState } from "react";
import { UserContext, type UserContextType } from "../../Components/Context/UserContext";
import type { PostCardInterface } from "../../types/PostCardType.types";
import { getUserPosts } from "../../services/Profile.services";
import axios from "axios";
import PostCard from "../../Components/PostCard/PostCard";
import { Spinner } from "@heroui/react";

interface MyPostsProps {
    onPostsLoaded?: (count: number) => void;
}

function MyPosts({ onPostsLoaded }: MyPostsProps) {
    const { userData }: UserContextType = useContext(UserContext)
    // console.log(userData);
    const [isloading, setIsloading] = useState(false)
    const [myPosts, setMyPosts] = useState<PostCardInterface[] | []>([])

    async function getmyPosts(userId: string) {
        setIsloading(true);
        try {
            const { data } = await getUserPosts(userData?.id)
            // console.log(data);
            setMyPosts(data.data.posts)
            const fetchedPosts = data.data.posts || [];
            if (onPostsLoaded) {
                onPostsLoaded(fetchedPosts.length);
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                // console.log(error.response?.data.message);
            }
        }
        finally {
            setIsloading(false)
        }
    }

    useEffect(() => { getmyPosts(userData?.id) }, [userData?._id])

    return (
        <div className="space-y-4 w-full">
            {/* 1. First, check if it's currently loading */}
            {isloading ? (
                <div className="flex justify-center py-10">
                    <Spinner />
                </div>
            ) : // 2. If loading is done, check if there are posts
                myPosts.length > 0 ? (
                    myPosts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            getAllPosts={() => {
                                if (userData?._id) getmyPosts(userData._id);
                            }}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-400 py-6 text-sm">
                        No posts found.
                    </p>
                )}
        </div>
    );


}

export default MyPosts