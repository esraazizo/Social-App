import { useEffect, useState } from "react";
import { getBookmarks } from "../../services/savedposts";
import type { PostCardInterface } from "../../types/PostCardType.types";
import axios from "axios";
import CreateNewPost from "../PostCard/CreateNewPost";
import PostCard from "../PostCard/PostCard";
import { Spinner } from "@heroui/react";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState<PostCardInterface[] | []>([])
  const [isloading, setIsloading] = useState(false)

  async function getAllSavedPosts() {
    setIsloading(true);
    try {
      const { data } = await getBookmarks()
      console.log(data.data.bookmarks);
      setSavedPosts(data.data.bookmarks)
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
    finally {
      setIsloading(false)
    }
  }

  useEffect(() => {

    getAllSavedPosts()
  }, [])



  return (
    <>
      {/* 🛠️ Render the creation block box right at the very top of your feed layout stream */}
      <CreateNewPost
        getAllPosts={getAllSavedPosts}
      />

      <div>
        {isloading ? <Spinner /> : <>
          {savedPosts.map((savedPost) => (
            <PostCard key={savedPost._id} post={savedPost} getAllPosts={getAllSavedPosts} />
          ))}</>}

      </div>

    </>
  );
}
