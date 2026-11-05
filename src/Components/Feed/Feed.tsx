import {  useEffect, useState } from 'react';
import CreateNewPost from '../PostCard/CreateNewPost';
import PostCard from '../PostCard/PostCard';
import { getHomeFeed } from '../../services/feed.services';
import type { PostCardInterface} from '../../types/PostCardType.types';
import axios from 'axios';
import { Spinner } from '@heroui/react';



export default function Feed() {

  const [posts, setPosts] = useState<PostCardInterface[] | []>([])
  const [isloading, setIsloading] = useState<boolean>(true);


  async function getFeed() {
    try {
      const { data } = await getHomeFeed()
      // console.log(data);
      setPosts(data.data.posts)
      // console.log(data.data.posts);
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

  useEffect(() => { getFeed() }, [])

  return (
    <>
      <CreateNewPost
        getAllPosts={getFeed}
      />

      <div>
        {isloading ? <Spinner /> : <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} getAllPosts={getFeed} />
          ))}</>}

      </div>

    </>
  );
}
