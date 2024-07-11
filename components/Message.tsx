import { useContext } from "react";
import UserContext from "@/lib/UserContext";
import { deleteMessage, SupabaseMessageResponse } from "@/lib/Store";
import TrashIcon from "@/components/TrashIcon";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { Roles } from "@/lib/constants";

function parseEmail(email: string | null) {
  if (!email) return "";
  let parsedAtSign = email.split("@")?.at(0);
  let parsePlusSign = parsedAtSign?.split("+");
  let parsedPlusSign = parsePlusSign?.at(0);
  return parsedPlusSign;
}

const Message: React.FC<{
  message: SupabaseMessageResponse;
  self: boolean;
}> = ({ message, self }) => {
  const { user, userRoles } = useContext(UserContext);
  const superUser = [Roles.ADMIN, Roles.MODERATOR] as string[];

  return (
    <div
      className={twMerge([
        "layout__message-chat group",
        !self && "layout__message-chat--self",
      ])}
    >
      {(user?.id === message.user_id ||
        userRoles?.some((role) => superUser.includes(role))) && (
        <button
          onClick={() => deleteMessage(message?.id)}
          className="layout__channel-chat-icon"
        >
          <TrashIcon />
        </button>
      )}

      <div className={"layout__channel-chat-message"}>
        <p
          className={twMerge([
            "layout__channel-chat-title",
            self && "layout__channel-chat-title--right",
          ])}
        >
          {parseEmail(message?.author?.username)}
          <span>{moment(message?.inserted_at).format("hh:mmA")}</span>
        </p>
        <p
          className={twMerge([
            "layout__channel-chat-message-info",
            self && "layout__channel-chat-message-info--right",
          ])}
        >
          {message.message}
        </p>
      </div>
    </div>
  );
};

export default Message;
