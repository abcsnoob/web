"use client";
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "model", text: data.text }]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Chat với Abc's Noob #FreeAbcsnoobhelper</h1>
      <div className="h-96 overflow-y-auto border p-4 my-4 bg-gray-900 text-green-400 font-mono">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-blue-300' : 'text-green-400'}`}>
            <strong>{m.role === 'user' ? 'You: ' : "Abc's Noob: "}</strong> {m.text}
          </div>
        ))}
      </div>
      <input 
        className="border p-2 w-full text-black" 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Hỏi về Bedwars hoặc Bitcoin..."
      />
      <button onClick={sendMessage} className="bg-orange-500 p-2 mt-2 w-full">Gửi (Tốn Satoshi lắm đấy)</button>
    </div>
  );
}