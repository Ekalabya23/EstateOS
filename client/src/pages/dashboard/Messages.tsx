import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, User as UserIcon } from 'lucide-react';
import { socketInstance } from '../../lib/socket';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'System',
      text: 'Welcome to the EstateOS Realtime Communications Hub. Send a message to simulate a conversation with a tenant.',
      timestamp: new Date(),
      isOwn: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socketInstance) return;

    const handleReceive = (data: any) => {
      setMessages((prev) => [...prev, {
        id: data.id,
        sender: data.sender,
        text: data.text,
        timestamp: new Date(data.timestamp),
        isOwn: data.isOwn
      }]);
    };

    socketInstance.on('receive_message', handleReceive);

    return () => {
      socketInstance?.off('receive_message', handleReceive);
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socketInstance) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: inputText,
      timestamp: new Date(),
      isOwn: true
    };

    // Update local UI
    setMessages((prev) => [...prev, newMessage]);
    
    // Emit to backend
    socketInstance.emit('send_message', { text: inputText });

    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-[var(--color-mist)] overflow-hidden shadow-sm">
      
      {/* Sidebar / Contacts List (Static for demo) */}
      <div className="w-80 border-r border-[var(--color-mist)] hidden md:flex flex-col bg-[var(--color-warm-white)]">
        <div className="p-5 border-b border-[var(--color-mist)]">
          <h2 className="text-[15px] font-bold text-[var(--color-charcoal)]">Active Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-[var(--color-mist)] bg-white cursor-pointer hover:bg-white transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-cream)] flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-[var(--color-champagne-dark)]" />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-[var(--color-charcoal)]">Tenant System</h3>
                <p className="text-[11px] text-[var(--color-stone)] mt-0.5">Online • Auto-Responder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#FAFAFA]">
        {/* Chat Header */}
        <div className="h-16 border-b border-[var(--color-mist)] px-6 flex items-center bg-white justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-[var(--color-champagne-dark)]" />
            </div>
            <span className="text-[14px] font-semibold text-[var(--color-charcoal)]">Tenant System</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-medium text-[var(--color-stone)]">Connected via WebSocket</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.isOwn 
                    ? 'bg-[var(--color-charcoal)] text-white rounded-br-sm' 
                    : 'bg-white border border-[var(--color-mist)] text-[var(--color-charcoal)] rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-[var(--color-stone-light)] mt-1.5 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[var(--color-mist)]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="w-full pl-4 pr-12 py-3 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-xl text-[13px] text-[var(--color-charcoal)] focus:outline-none focus:ring-1 focus:ring-[var(--color-champagne)] transition-all"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 p-2 bg-[var(--color-charcoal)] text-white rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
