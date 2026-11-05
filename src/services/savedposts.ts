import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
export async function getBookmarks() {
  const data = await axios.get(`${baseUrl}/users/bookmarks`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}

