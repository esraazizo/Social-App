import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getPostComments(postId: string) {
  const data = await axios.get(`${baseUrl}/posts/${postId}/comments`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}

export async function createPostComment(postId: string , formdata : FormData) {
  const data = await axios.post(`${baseUrl}/posts/${postId}/comments`, formdata,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}


export async function updateComment(postId: string , commentId : string , formdata : FormData) {
  const data = await axios.put(`${baseUrl}/posts/${postId}/comments/${commentId}`, formdata,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}


export async function deleteComment( postId: string , commentId : string ) {
  const data = await axios.delete(`${baseUrl}/posts/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}

export async function likeComment( postId: string , commentId : string) {
  const data = await axios.put(`${baseUrl}/posts/${postId}/comments/${commentId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });
  return data;
}

export async function createReply(postId: string, commentId: string, formData: FormData) {
  const { data } = await axios.post(
    `${baseUrl}/posts/${postId}/comments/${commentId}/replies`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
      },
    }
  );
  return data;
}

export async function getCommentReplies(postId: string, commentId: string) {
  const { data } = await axios.get(
    `${baseUrl}/posts/${postId}/comments/${commentId}/replies`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
      },
    }
  );
  return data;
}

