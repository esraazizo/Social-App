import type { Dispatch, SetStateAction } from "react";
import { CiBookmark, CiGlobe } from "react-icons/ci";
import { HiOutlineSparkles } from "react-icons/hi2";
import { LuNewspaper } from "react-icons/lu";

const links = [
  { id: "feed", label: "Feed", icon: LuNewspaper  },
  { id: "posts", label: "My Posts", icon: HiOutlineSparkles },
  { id: "community", label: "Community", icon: CiGlobe  },
  { id: "saved", label: "Saved", icon: CiBookmark },
];

interface SidebarProps {
  activeLink: string;
  setActiveLink: Dispatch<SetStateAction<string>>;
}

export default function Sidebar({ activeLink, setActiveLink }: SidebarProps) {
  // const activeLink = "feed";
  return (
    <aside className="bg-white rounded-2xl p-3 shadow-sm ">
      <ul className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.id === activeLink;

          return (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => setActiveLink(link.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-blue-100 text-blue-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}


