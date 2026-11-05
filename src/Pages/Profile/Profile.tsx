import { useContext, useEffect, useRef, useState } from "react"
import { UserContext, type UserContextType } from "../../Components/Context/UserContext";
import { Bookmark, ImageIcon, Mail} from "lucide-react";
import { LuUsers } from "react-icons/lu";
import type { PostCardInterface } from "../../types/PostCardType.types";
import axios from "axios";
import PostCard from "../../Components/PostCard/PostCard";
import { getBookmarks } from "../../services/savedposts";
import { Button, Modal, Spinner } from "@heroui/react";
import MyPosts from "./MyPosts";
import { IoExpandOutline } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { getMyProfile, UploadProfilePhoto } from "../../services/Profile.services";
import toast from "react-hot-toast";

function Profile() {
  const [savedPosts, setSavedPosts] = useState<PostCardInterface[] | []>([])
  const [isloading, setIsloading] = useState(false)
  const { userData , setUserData }: UserContextType = useContext(UserContext)
  const [activeTab, setActiveTab] = useState("posts");
  const [myPostsCount, setMyPostsCount] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  async function getAllSavedPosts() {
    setIsloading(true);
    try {
      const { data } = await getBookmarks()
      // console.log(data.data.bookmarks);
      setSavedPosts(data.data.bookmarks)
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

  useEffect(() => {
    getAllSavedPosts()
    
  }, [userData?.photo])
  // upload profile photo
  async function handleProfilePhoto() {
    const formData = new FormData();
    if (image) {
      formData.append("photo", image);
      setIsSaving(true);
    }
    try {
      const { data } = await UploadProfilePhoto(formData)
      toast.success(data.message)
      const res = await getMyProfile()
      // console.log(res.data.data.user); 
      setUserData(res.data.data.user)
      // console.log(data);
      closeImagePreview()
    } catch (error) {
      // console.log(error);
    }
    finally {
      setIsSaving(false);
    }
  }
  // function to handle image
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {

    // console.log(e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setIsOpen(true)
    }

  }
  // close image preview 
  function closeImagePreview() {
    setImage(null)
    setImagePreview(null)
    setIsOpen(false)
    if (fileRef.current) {
      fileRef.current.value = ""
    }
  }

  return (<>
    {userData && <>
      <main className="min-h-screen bg-sec py-6">
        <div className="container mx-auto max-w-6xl px-4">
          <section className="relative">
            <div className="h-36 rounded-3xl bg-linear-to-r from-slate-900 via-blue-950 to-slate-700 sm:h-44" />

            <div className="relative mx-2 -mt-16 rounded-3xl bg-white p-5 shadow-sm sm:mx-4 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="group/avatar relative shrink-0">

                    <button type="button" className="cursor-pointer rounded-full">
                      <img alt={userData?.name}
                        className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                        src={userData?.photo} />
                    </button>
                    {/* modal for full photo */}
                    <Modal >
                      <Button
                        variant="secondary"
                        aria-label="View profile photo"
                        className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#1877f2] opacity-100 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:bg-slate-50 sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100"
                      >
                        <IoExpandOutline />
                      </Button>
                      <Modal.Backdrop>
                        <Modal.Container>
                          <Modal.Dialog className="sm:max-w-125 overflow-hidden rounded-2xl bg-white p-0">
                            <div className="relative w-full aspect-square flex items-center justify-center bg-white">
                              <img
                                src={userData?.photo}
                                alt={userData?.name || "Profile Photo"}
                                className="w-full h-full object-cover"
                              />
                              <Modal.CloseTrigger className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition cursor-pointer" />
                            </div>
                          </Modal.Dialog>
                        </Modal.Container>
                      </Modal.Backdrop>
                    </Modal>

                    <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-100 shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100">
                      <GrGallery />
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImage}

                      />
                    </label>
                  </div>
                  {/* image preview */}
                  {/* modal */}
                  <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) closeImagePreview(); }} >
                    <Modal.Backdrop>
                      <Modal.Container>
                        <Modal.Dialog className="sm:max-w-200 overflow-hidden rounded-2xl flex items-center">
                          <h3 className="mb-2">Update photo</h3>
                          {imagePreview && <>
                            <div className="h-100 w-150 overflow-hidden flex items-center justify-center ">
                              <img src={imagePreview}
                                alt={userData?.name || "Profile Photo"}
                                className="w-100 h-100 object-cover rounded-full" />
                            </div>
                          </>}
                          <div className="mt-4 flex gap-2 justify-end">
                            <Button variant="secondary"
                              onPress={closeImagePreview} >
                              Cancel
                            </Button>
                            <Button variant="secondary"
                              onPress={handleProfilePhoto} isDisabled={!image || isSaving} >
                              {isSaving ? " Saving" : "Save"}
                            </Button>
                          </div>
                        </Modal.Dialog>
                      </Modal.Container>
                    </Modal.Backdrop>
                  </Modal>
                  <div>
                    <h1 className="text-2xl font-bold capitalize text-gray-900">
                      {userData.name}
                    </h1>
                    <p className="text-sm text-gray-500">@{userData.username}</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                      <LuUsers size={12} />
                      Route Posts member
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 lg:min-w-80">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                      Followers
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {userData.followersCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                      Following
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {userData.followingCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                      Bookmarks
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {userData.bookmarksCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <h2 className="text-sm font-semibold text-gray-900">About</h2>
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    {userData.email}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <LuUsers size={16} className="text-gray-400" />
                    Active on Route Posts
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                      My Posts
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {myPostsCount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                      Saved Posts
                    </p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {userData.bookmarksCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${activeTab === "posts"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
                  }`}
              >
                <ImageIcon size={16} />
                My Posts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={` cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${activeTab === "saved"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
                  }`}
              >
                <Bookmark size={16} />
                Saved
              </button>
            </div>
            <span className="grid size-7 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
              {activeTab === "posts" ? myPostsCount : savedPosts.length}
            </span>
          </section>

          <div className="mt-4 space-y-4 w-full">
            {activeTab === "posts" ? (
              <MyPosts onPostsLoaded={setMyPostsCount} />
            ) : (
              <div>
                {isloading ? (
                  <div className="flex justify-center py-6">
                    <Spinner />
                  </div>
                ) : savedPosts.length > 0 ? (
                  savedPosts.map((savedPost) => (
                    <PostCard
                      key={savedPost._id}
                      post={savedPost}
                      getAllPosts={getAllSavedPosts}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-6 text-sm font-semibold">
                    You have no saved posts.
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </main >
    </>}
  </>

  );
}

export default Profile