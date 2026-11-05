import { Button, Dropdown, Label, Tabs } from "@heroui/react";
import logo from "../../assets/images/route.png"
import { FiHome, FiMessageCircle, FiUser } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { HiMiniBars3 } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { TokenContext } from "../Context/TokenContext";
import { useContext } from "react";
import { UserContext, type UserContextType } from "../Context/UserContext";
import { useNotificationCount } from "../Context/NotificationContext";
function Navbar() {
  const navigate = useNavigate();
  const { setToken }: any = useContext(TokenContext)
  const { userData }: UserContextType = useContext(UserContext)
  const { unreadCount } = useNotificationCount();

  return (
    <>
      <nav className="bg-white">
        <div className="container mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 sm:gap-3 sm:px-3 py-3">
          <div className="nav-logo flex items-center gap-3">
            <img src={logo} alt="app-logo" className="h-9 w-9 rounded-xl object-cover" />
            <p className="hidden text-xl font-extrabold text-slate-900 sm:block">Route Posts</p>
          </div>
          <div className="nav-link">
            <Tabs className="w-full max-w-md">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="Feed" className="group" onPress={() => navigate("/feed")}>
                    <div className="flex gap-2 items-center justify-center text-slate-600 group-data-[selected=true]:text-[#1f6fe5] ">
                      <FiHome />
                      <span className="hidden md:inline">Feed</span>
                    </div>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="Profile" className="group" onPress={() => navigate("/profile")}>
                    <div className="flex gap-2 items-center justify-center text-slate-600 group-data-[selected=true]:text-[#1f6fe5] ">
                      <FiUser />
                      <span className="hidden md:inline">Profile</span>
                    </div>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="Notifications" className="group" onPress={() => navigate("/notification")}>
                   
                    <div className="flex gap-2 items-center justify-center text-slate-600 group-data-[selected=true]:text-[#1f6fe5]">
                      <div className="relative inline-block">
                        <FiMessageCircle size={18} />
                        {unreadCount > 0 && (
                          <span className="absolute -right-2 -top-2 inline-flex min-w-[16px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-black leading-4 text-white select-none">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <span className="hidden md:inline">Notifications</span>
                    </div>

                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>
          <div className="nav-action">
            <Dropdown>
              <Button aria-label="Menu" variant="secondary" className="text-slate-600">
                <img src={userData?.photo} alt="personal-photo" className="h-6 w-6 rounded-xl object-cover" />
                {userData?.name}
                <HiMiniBars3 />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => {
                    switch (key) {
                      case "Profile":
                        navigate("/profile");
                        break;
                      case "Settings":
                        navigate("/settings");
                        break;
                      case "Logout":
                        localStorage.removeItem("UserToken")
                        setToken(null)
                        // navigate("/Auth");
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  <Dropdown.Item id="Profile" textValue="Profile">
                    <FiUser className="text-slate-600" />
                    <Label className="text-slate-600">Profile</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="Settings" textValue="Settings">
                    <IoSettingsOutline className="text-slate-600" />
                    <Label className="text-slate-600">Settings</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="Logout" textValue="Logout" variant="danger" className="hover:bg-red-100">
                    <Label >Logout</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>

        </div>
      </nav>
    </>
  );
}

export default Navbar;
