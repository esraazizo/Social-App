import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;


export async function getNotifications() {
  const data = await axios.get(`${baseUrl}/notifications?unread=false&page=1&limit=40`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });

  return data;
}