import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getMyProfile() {
  const data = await axios.get(`${baseUrl}/users/profile-data`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}

export async function getUserPosts(userId: string) {
  const data = await axios.get(`${baseUrl}/users/${userId}/posts/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}

export async function UploadProfilePhoto(formdata : FormData) {

  const data = await axios.put(`${baseUrl}/users/upload-photo`, formdata,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}