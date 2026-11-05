import { useEffect, useState } from "react";
import PostSkeleton from "../../Components/PostCard/PostSkeleton";
import PostCard from "../../Components/PostCard/PostCard";
import SavedPosts from "../../Components/SavedPosts/SavedPosts";
import Sidebar from "../../Components/Sidebar/Sidebar";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";
import Feed from "../../Components/Feed/Feed";
import { getUserFeed } from "../../services/feed.services";
import axios from "axios";
import type { PostCardInterface } from "../../types/PostCardType.types";
import CreateNewPost from "../../Components/PostCard/CreateNewPost";
import MyPosts from "../Profile/MyPosts";

export function Newsfeed() {
  const [activeLink, setActiveLink] = useState<string>("feed");

  const [isloading, setIsloading] = useState<boolean>(true);

  const [posts, setPosts] = useState<PostCardInterface[] | []>([])

  async function getAllPosts() {
    try {
      const { data } = await getUserFeed()
      // console.log(data);
      setPosts(data.data.posts)
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

    getAllPosts()
  }, [])

  const renderMainContent = () => {
    switch (activeLink) {
      case "feed":
        return <Feed />;
      case "posts":
        function setMyPostsCount(_count: number): void {
          throw new Error("Function not implemented.");
        }
        // return <MyPosts />;
        return (
          <>
            <CreateNewPost getAllPosts={getAllPosts} />
            <MyPosts onPostsLoaded={setMyPostsCount} />
          </>
        );
      case "community":
        return isloading ? (
          <PostSkeleton />
        ) : (
          <>
            <CreateNewPost getAllPosts={getAllPosts} />

            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} getAllPosts={getAllPosts} />
              ))}
            </div>
          </>
        );
      case "saved":
        return <SavedPosts />;
      // default:
      //    return <Feed />;
    }
  };

  return (
    <div className="container mx-auto w-full px-4 sm:px-6 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl pt-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Sidebar gets state and setter */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />
        </div>

        {/* Dynamic Center Column Content */}
        <div className="col-span-1 md:col-span-8 lg:col-span-6 xl:col-span-7">
          {renderMainContent()}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 md:col-span-12 lg:col-span-3">
          <SuggestedFriends />
        </div>

      </div>
    </div>
  );
}
