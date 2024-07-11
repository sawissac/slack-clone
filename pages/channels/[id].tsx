import Layout from "@/components/Layout";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";
import { useRouter } from "next/router";
import { useStore, addMessage, supabase } from "@/lib/Store";
import { useContext, useEffect, useRef } from "react";
import UserContext from "@/lib/UserContext";
import { Auth } from "@/components/Auth";
import { twMerge } from "tailwind-merge";

export default function ChannelsPage() {
  const router = useRouter();
  const { id: channelId } = router.query;
  const chId = channelId ? parseInt(channelId as string) : 0;
  const { user } = useContext(UserContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, channels, users } = useStore({ channelId: chId });

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!channels.some((channel) => channel.id === chId)) {
      router.push("/channels/1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, channelId]);

  return (
    <Auth>
      <Layout channels={channels} activeChannelId={chId} users={users}>
        <div className="relative h-screen">
          <div className="Messages h-full pb-[150px] px-4">
            <div className="p-2 overflow-y-auto">
              {messages.map((x) => {
                const self = user?.id === x.user_id;
                return (
                  <div
                    key={x.id}
                    className={twMerge(["w-full", self && "flex justify-end"])}
                  >
                    <Message message={x} self={self} />
                  </div>
                );
              })}
              <div ref={messagesEndRef} style={{ height: 0 }} />
            </div>
          </div>
          <div className="px-5 pb-8 pt-4 absolute bottom-0 left-0 w-full">
            <MessageInput
              onSubmit={async (text) => addMessage(text, chId, user?.id)}
            />
          </div>
        </div>
      </Layout>
    </Auth>
  );
}