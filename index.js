import React, { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Welcome to Smart Rwanda Hub. How can I assist you today?' },
  ]);
  const [language, setLanguage] = useState('en');

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: 'user', text: input }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, language }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { from: 'ai', text: 'Sorry, something went wrong.' }]);
    }

    setInput('');
  };

  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'rw' : 'en'));

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-3xl mx-auto flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{language === 'en' ? 'Smart Rwanda Hub' : 'Urubuga Rwubwenge rwa Rwanda'}</h1>
        <button
          onClick={toggleLanguage}
          className="bg-blue-600 text-white px-3 py-1 rounded"
          aria-label="Toggle language"
        >
          {language === 'en' ? 'Kinyarwanda' : 'English'}
        </button>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex flex-col space-y-2 mb-4 overflow-y-auto max-h-96 p-2 border rounded bg-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded max-w-xs ${
                msg.from === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'
              }`}
            >
              <strong>{msg.from === 'user' ? (language === 'en' ? 'You' : 'Wowe') : language === 'en' ? 'Smart Hub' : 'Urubuga'}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            aria-label="Type your question"
            className="flex-1 p-2 border rounded"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'en' ? 'Ask about Rwanda services...' : 'Babaza serivisi za Rwanda...'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 rounded"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}