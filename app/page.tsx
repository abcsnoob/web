"use client";
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống khi có tin nhắn mới cho mượt UI
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: "user", text: userMsg }].map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "model", text: data.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "model", text: "Lag vcl rồi ông ơi, hoặc hết Satoshi trả tiền API rồi... #FreeAbcsnoobhelper" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl border-2 border-[#00ff00] p-4 bg-zinc-900 shadow-[0_0_15px_rgba(0,255,0,0.3)]">
        <header className="border-bottom border-[#00ff00] mb-4 pb-2 flex justify-between items-center">
          <h1 className="text-xl font-bold blink">ABCC'S NOOB TERMINAL v1.0</h1>
          <span className="text-xs bg-[#00ff00] text-black px-2">#FreeAbcsnoobhelper</span>
        </header>

        <div ref={scrollRef} className="h-[60vh] overflow-y-auto mb-4 space-y-4 p-2 custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-zinc-500 italic">--- System: Đang đợi lệnh từ pháp sư... Đừng rủ đi Bedwars, đang lag vcl! ---</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-2 rounded ${m.role === 'user' ? 'bg-[#004400] text-white' : 'bg-[#111] border border-[#00ff00]'}`}>
                <span className="text-[10px] block opacity-50">{m.role === 'user' ? 'YOU' : 'NOOB'}</span>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && <div className="animate-pulse text-[#00ff00]">Noob đang gõ thuật toán...</div>}
        </div>

        <div className="flex gap-2">
          <span className="text-[#00ff00] py-2">{'>'}</span>
          <input 
            className="flex-1 bg-transparent border-none outline-none text-[#00ff00] placeholder:text-[#004400]"
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Hỏi về BTC, JS hoặc Fireball..."
          />
          <button 
            onClick={sendMessage}
            className="bg-[#00ff00] text-black px-4 py-1 hover:bg-white transition-colors font-bold"
          >
            PUSH
          </button>
        </div>
      </div>
      <footer className="mt-4 text-[10px] text-zinc-600">
        Deploy by Vercel | Gas: Satoshi | Project: #FreeAbcsnoobhelper
      </footer>
    </div>
  );
}
