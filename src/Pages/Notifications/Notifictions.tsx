import { useEffect, useState } from "react";
import { getNotifications } from "../../services/notification.services"
import type { NotificationInterface } from "../../types/notification.type";
import { Spinner } from "@heroui/react";
import { useNotificationCount } from "../../Components/Context/NotificationContext";
import { FiMessageCircle } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";

function Notifictions() {
  const [allNotifications, setAllNotifications] = useState<NotificationInterface[]>([])
  const [isloading, setIsloading] = useState<boolean>(false);
  const { setUnreadCount } = useNotificationCount();

  async function getMyNotifications() {
    setIsloading(true)
    try {
      const { data } = await getNotifications()
      // console.log(data);
      console.log(data.data.notifications);
      setAllNotifications(data.data.notifications);
      setUnreadCount(allNotifications.length);


    } catch (error) {
      console.log(error);

    }
    finally {
      setIsloading(false)
    }
  }

  useEffect(() => { getMyNotifications() }, [allNotifications.length])


  return <>
    {isloading ? <Spinner /> : <>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
            <div className="border-b border-slate-200 p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                  Notifications</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Realtime updates for likes, comments, shares, and follows.</p>
              </div>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-check" aria-hidden="true">
                  <path d="M18 6 7 17l-5-5" />
                  <path d="m22 10-7.5 7.5L13 16" />
                </svg>Mark all as read
              </button>
            </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button type="button" className="rounded-full px-4 py-1.5 text-sm font-bold transition bg-[#1877f2] text-white">All</button>
                <button type="button" className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition bg-slate-100 text-slate-700 hover:bg-slate-200"> Unread
                  <span className="rounded-full px-2 py-0.5 text-xs bg-white text-[#1877f2]"> {allNotifications.length}</span>
                </button>
              </div>
            </div>
            
            <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
              {allNotifications.map((notification: NotificationInterface) => {
                const isComment = notification.type === "comment_post";
                return (
                  <article
                    key={notification._id}
                    className={`mt-3 group relative flex gap-3 rounded-xl border p-4 transition sm:rounded-2xl sm:p-4 ${notification.isRead
                      ? "border-gray-200 bg-white"
                      : "border-[#dbeafe] bg-[#edf4ff]"
                      }`}
                  >
                   
                    <div className="relative shrink-0">
                      <button type="button" className="block cursor-pointer">
                        <img
                          alt={notification.actor?.name || "User Avatar"}
                          className="h-11 w-11 rounded-full object-cover"
                          src={notification.actor?.photo}
                        />
                      </button>

                      <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white">
                        {isComment ? <FiMessageCircle className="text-blue-400" /> : <FaRegHeart className="text-red-500" />}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
                        <p className="text-sm leading-6 text-slate-800">
                          {/* Dynamic Actor Name Action Button Link */}
                          <button type="button" className="font-extrabold hover:text-[#1877f2] hover:underline mr-1">
                            {notification.actor?.name}
                          </button>
                          {isComment ? "commented on your post" : "liked your post"}
                        </p>

                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-500">
                          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {notification.entity?.content && (
                        <p className="mt-1 text-md text-gray-600 dark:bg-zinc-900/50 p-1.5 rounded-lg border border-dashed border-gray-100 dark:border-zinc-800">
                          {notification.entity.content}
                        </p>
                      )}

                      {!notification.isRead && (
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#1877f2] ring-1 ring-[#dbeafe] transition hover:bg-[#e7f3ff]"
                          >

                            <IoCheckmark className="text-blue-600 " />
                            Mark as read
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}

            </div>


          </section>
        </main>
      </div>


    </>}
  </>


}

export default Notifictions