import { useContext } from "react";
import UserContext from "@/lib/UserContext";
import { deleteMessage, SupabaseMessageResponse } from "@/lib/Store";
import TrashIcon from "@/components/TrashIcon";
import { twMerge } from "tailwind-merge";
import moment from "moment";

function parseEmail(email: string | null){
  if(!email) return "";
  let parsedAtSign = email.split("@")?.at(0)
  let parsePlusSign = parsedAtSign?.split("+");
  let parsedPlusSign = parsePlusSign?.at(0);
  return parsedPlusSign
}

const Message: React.FC<{
  message: SupabaseMessageResponse;
  self: boolean;
}> = ({ message, self }) => {
  const { user, userRoles } = useContext(UserContext);
  return (
    <div className={twMerge(["relative py-2 px-5 gap-2 flex-shrink-0 rounded-md flex-grow-0 flex items-center space-x-2 bg-white my-5 w-[45%] border border-solid border-primary border-opacity-20 shadow-md", !self && "flex-row-reverse"])}>
      {(user?.id === message.user_id ||
        userRoles?.some((role) => ["admin", "moderator"].includes(role))) && (
        <button
          onClick={() => deleteMessage(message?.id)}
          className="text-primary min-w-10 min-h-10 rounded-md bg-white flex justify-center items-center border border-solid border-primary border-opacity-20 shadow-md"
        >
          <TrashIcon />
        </button>
      )}

      <div className={"w-full overflow-hidden"}>
        <p
          className={twMerge([
            "text-primary font-medium truncate",
            self && "text-right",
          ])}
        >
          {parseEmail(message?.author?.username)}
          <span className="ml-2 text-gray-500">{moment(message?.inserted_at).format("hh:mmA")}</span>
        </p>
        <p
          className={twMerge([
            "text-gray-900 font-normal",
            self && "text-right",
          ])}
        >
          {message.message}
        </p>
      </div>
    </div>
  );
};

export default Message;
