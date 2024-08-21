import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      // Emitir el nombre de usuario al backend
      socket.emit("setUsername", username);
    }
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      // Emitir el mensaje al backend (ya no lo añadimos directamente a la lista de mensajes aquí)
      socket.emit("message", message);
      setMessage(""); // Limpiar el campo de mensaje
    }
  };

  useEffect(() => {
    const receiveMessage = (msg) => {
      setMessages((state) => [...state, msg]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  return (
    <div className="h-screen bg-zinc-800 text-white flex flex-col items-center justify-center">
      <form onSubmit={handleUsernameSubmit} className="bg-zinc-900 p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Enter Your Name</h2>
        <input
          type="text"
          placeholder="Your name..."
          className="border-2 border-zinc-500 p-2 text-black w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="mt-2 p-2 bg-green-500 rounded">
          Set Name
        </button>
      </form>

      <form onSubmit={handleMessageSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Chat</h1>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          className="border-2 border-zinc-500 p-2 text-black w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ul>
          {messages.map((msg, i) => (
            <li
              key={i}
              className={`my-2 p-2 table rounded-md ${
                msg.from === username ? "bg-sky-700" : "bg-green-400 ml-auto"
              }`}
            >
              <span className="text-xs text-slate-300 block">
                {msg.from}
              </span>
              <span className="text-md">{msg.body}</span>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
