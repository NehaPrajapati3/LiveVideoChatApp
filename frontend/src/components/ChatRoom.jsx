import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  MessageSquareDashed,
} from "lucide-react";

const ChatRoom = ({ socketRef, userId }) => {
  const [users, setUsers] = useState([]); // list of { socketId, userId }
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("all"); // 'all' means group chat
  const [messages, setMessages] = useState([]); // { from, to, text, timestamp }

  useEffect(() => {
    if (!socketRef.current) return;

    // Listen for updated user list
    socketRef.current.on("all-users", (usersList) => {
      setUsers(usersList);
      console.log("usersList:", usersList);
    });

    // Listen for incoming chat messages
    socketRef.current.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Request the current user list on mount
    socketRef.current.emit("get-users");
    console.log("after emit get users")

    // Cleanup on unmount
    return () => {
      socketRef.current.off("all-users");
      socketRef.current.off("chat-message");
    };
  }, [socketRef, chatOpen]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const message = {
      from: userId,
      to: selectedUserId, // 'all' or specific userId
      text,
      timestamp: Date.now(),
    };

    socketRef.current.emit("send-chat-message", message);
    // setMessages((prev) => [...prev, message]);
  };

  return (
    <div>
      <button
        // onClick={handleChatToggle}
        onClick={() => setChatOpen((prev) => !prev)}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        {chatOpen ? (
          <MessageSquareDashed size={24} />
        ) : (
          <MessageSquare size={24} />
        )}
      </button>

      {chatOpen && (
        <div className="chat-container border p-2 mt-2 rounded w-80 bg-white shadow-md">
          <h3>Users in room</h3>
          <ul className="user-list mb-2 max-h-32 overflow-y-auto">
            <li
              key="all"
              onClick={() => setSelectedUserId("all")}
              className={`cursor-pointer p-1 rounded ${
                selectedUserId === "all" ? "bg-blue-200" : ""
              }`}
            >
              Chat with All
            </li>
            {users.map(({ socketId, userId: uId }) => (
              <li
                key={socketId}
                onClick={() => setSelectedUserId(uId)}
                className={`cursor-pointer p-1 rounded ${
                  selectedUserId === uId ? "bg-blue-200" : ""
                }`}
              >
                {uId}
              </li>
            ))}
          </ul>

          <ChatMessages
            messages={messages}
            userId={userId}
            selectedUserId={selectedUserId}
          />
          <ChatInput onSend={sendMessage} />
        </div>
      )}
    </div>
  );
};

const ChatMessages = ({ messages, userId, selectedUserId }) => {
  // Filter messages to show only relevant chats (private or all)
  const filteredMessages = messages.filter((msg) => {
    if (selectedUserId === "all") {
      return msg.to === "all";
    }
    // show messages either sent or received by selectedUserId and current user
    return (
      (msg.from === selectedUserId && msg.to === userId) ||
      (msg.from === userId && msg.to === selectedUserId)
    );
  });

  return (
    <div className="chat-messages h-48 overflow-y-auto border p-2 mb-2 rounded bg-gray-50">
      {filteredMessages.map((msg, i) => (
        <div
          key={i}
          className={`mb-1 ${
            msg.from === userId ? "text-right text-blue-600" : "text-left"
          }`}
        >
          <span className="font-bold">
            {msg.from === userId ? "You" : msg.from}
          </span>
          : {msg.text}
          <br />
          <small className="text-gray-400 text-xs">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </small>
        </div>
      ))}
    </div>
  );
};

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Type message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
};

export default ChatRoom;
