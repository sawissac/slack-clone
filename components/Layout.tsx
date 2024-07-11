import Link from "next/link";
import { ReactNode, useContext } from "react";
import UserContext from "@/lib/UserContext";
import TrashIcon from "@/components/TrashIcon";
import {
  addChannel,
  deleteChannel,
  SupabaseChannelsResponse,
  SupabaseUserResponse,
} from "@/lib/Store";
import { User } from "@supabase/supabase-js";
import { IconHash, IconLogout2, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { USER_NETWORK_STATUS } from "@/lib/constants";

const SidebarItem: React.FC<{
  channel: SupabaseChannelsResponse;
  isActiveChannel: boolean;
  user: User | null | undefined;
  userRoles: string[] | undefined;
}> = ({ channel, isActiveChannel, user, userRoles }) => (
  <>
    <li className="flex items-center justify-between py-1">
      <Link
        href="/channels/[id]"
        as={`/channels/${channel.id}`}
        className=" w-full"
      >
        <span className={isActiveChannel ? "font-bold" : ""}>
          {channel.slug}
        </span>
      </Link>
      {channel.id !== 1 &&
        (channel.created_by === user?.id || userRoles?.includes("admin")) && (
          <button onClick={() => deleteChannel(channel.id)}>
            <TrashIcon />
          </button>
        )}
    </li>
  </>
);

function getActiveUser(payload: Map<string, SupabaseUserResponse | null>) {
  if (!payload) return payload;
  let active = 0;
  payload.forEach((values, keys) => {
    if (values?.status === USER_NETWORK_STATUS.ONLINE) {
      active++;
    }
  });
  return active;
}

const Layout: React.FC<{
  channels: SupabaseChannelsResponse[];
  children: ReactNode;
  activeChannelId: number;
  users: Map<string, SupabaseUserResponse | null>;
}> = (props) => {
  const { signOut, user, userRoles } = useContext(UserContext);
  const email = user?.email;

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  const newChannel = async () => {
    const slug = prompt("Please enter your name");
    if (user && slug) {
      addChannel(slugify(slug), user.id);
    }
  };

  const handleLogout = () => {
    const flag = confirm("Are you sure want to logout");
    if (flag && signOut) signOut();
  };

  return (
    <main className="main flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <nav
        className="flex overflow-y-scroll "
        style={{ maxWidth: "30%", minWidth: 350, maxHeight: "100vh" }}
      >
        <div className="flex flex-col justify-start items-start p-3 h-full bg-primary gap-3">
          <button className="w-[45px] h-[45px] bg-white grid place-items-center rounded-md">
            <Image
              src={"/slack-clone-logo.jpg"}
              loading="lazy"
              width={40}
              height={40}
              alt="app logo"
            />
          </button>
          <button className="w-[45px] h-[45px] bg-white grid place-items-center rounded-md backdrop-blur-sm bg-opacity-35">
            <IconHash width={25} height={25} className="text-gray-200" />
          </button>
          <button
            className="w-[45px] h-[45px] bg-white grid place-items-center rounded-md backdrop-blur-sm bg-opacity-35 mt-auto"
            onClick={handleLogout}
          >
            <IconLogout2 width={25} height={25} className="text-gray-200" />
          </button>
        </div>
        <div className="p-3 w-full bg-gray-100">
          <div className="flex justify-between h-[45px] items-center">
            <div className="text-[20px] font-bold"># Channels</div>
            <button
              className="hover:bg-primary hover:bg-opacity-10 text-white p-2 rounded max-w-fit transition duration-150"
              onClick={() => newChannel()}
            >
              <IconPlus width={18} height={18} className="text-primary" />
            </button>
          </div>
          <hr className="my-2" />
          <ul className="channel-list">
            {props.channels.map((x) => (
              <SidebarItem
                channel={x}
                key={x.id}
                isActiveChannel={x.id === props.activeChannelId}
                user={user}
                userRoles={userRoles}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 bg-white h-screen relative">
        <div className="absolute left-0 right-0 top-0 h-[69px] shadow-md bg-white border-b border-solid border-gray-100 flex justify-between items-center px-4">
          <span className="font-bold text-xl">ACTIVE - {getActiveUser(props.users)}</span>
          <span className="text-gray-500">{email}</span>
        </div>
        {props.children}
      </div>
    </main>
  );
};

export default Layout;
