"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // adjust if needed

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; message: string }[]>([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    const data = { sender: "Me", message };
    socket.emit("message", data);
    setMessage("");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Real-time Chat</h1>
      <div style={{ height: 200, overflowY: "scroll", border: "1px solid #ccc" }}>
        {chat.map((msg, i) => (
          <p key={i}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say something..." />
      <button onClick={sendMessage}>Send</button>
    </main>
  );
}
