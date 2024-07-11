import { IconSend2 } from "@tabler/icons-react";
import { KeyboardEvent, useState } from "react";

const MessageInput: React.FC<{ onSubmit: (payload: string) => void }> = ({
  onSubmit,
}) => {
  const [messageText, setMessageText] = useState("");

  const submitOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code.toLowerCase() === "enter" && messageText.length) {
      onSubmit(messageText);
      setMessageText("");
    }
  };

  const submitOnClick = () => {
    onSubmit(messageText);
    setMessageText("");
  };

  return (
    <div className="shadow appearance-none border rounded-md w-full overflow-hidden">
      <input
        type="text"
        className="leading-tight py-4 px-3 focus:outline-none focus:shadow-outline text-gray-700 w-full"
        placeholder="Send a message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => submitOnEnter(e)}
      />
      <div className="flex justify-end items-center py-3 px-3 pr-5">
        <button className="grid place-items-center" onClick={submitOnClick}>
          <IconSend2 className="text-gray-400 hover:text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
