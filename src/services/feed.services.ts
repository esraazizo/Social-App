import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getUserFeed() {
  const data = await axios.get(`${baseUrl}/posts?limit=40`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}
export async function getHomeFeed() {
  const data = await axios.get(`${baseUrl}/posts/feed?only=following&limit=40`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}

