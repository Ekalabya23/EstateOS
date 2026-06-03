import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import api from '../../lib/axios';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIPropertyChatProps {
  propertyId: string;
  propertyName: string;
}

const toMessageText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value == null) return '';

  if (typeof value === 'object') {
    const maybeInsight = value as { title?: unknown; desc?: unknown; message?: unknown; text?: unknown };
    if (typeof maybeInsight.message === 'string') return maybeInsight.message;
    if (typeof maybeInsight.text === 'string') return maybeInsight.text;
    if (typeof maybeInsight.title === 'string' || typeof maybeInsight.desc === 'string') {
      return [maybeInsight.title, maybeInsight.desc].filter(Boolean).join('\n\n');
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return 'I received a response, but could not display it.';
    }
  }

  return String(value);
};

const SUGGESTED_QUESTIONS = [
  "What's the rental yield?",
  "Is this a good investment?",
  "What are similar properties nearby?",
  "What documents do I need?"
];

export default function AIPropertyChat({ propertyId, propertyName }: AIPropertyChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your AI assistant for ${propertyName}. Ask me anything about this property, the neighborhood, or investment potential.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/ai/chat', {
        message: text,
        propertyId,
        context: { previousMessages: messages.slice(-5) }
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: toMessageText(response.data.data)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get AI response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-charcoal)] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center text-[var(--color-champagne)] hover:scale-105 transition-transform z-50 group border border-[var(--color-champagne)]/20"
          >
            <Sparkles className="absolute w-4 h-4 text-[var(--color-champagne)] top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-full max-w-[380px] h-[550px] max-h-[calc(100vh-48px)] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[var(--color-mist)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[var(--color-charcoal)] text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-champagne)]/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[var(--color-champagne)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">EstateOS AI</h3>
                  <p className="text-[10px] text-white/60">Property Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-warm-white)]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === 'user' ? 'bg-[var(--color-charcoal)]' : 'bg-[var(--color-champagne)]'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-[var(--color-charcoal)]" />
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl text-[13px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[var(--color-charcoal)] text-white rounded-tr-none' 
                      : 'bg-white text-[var(--color-charcoal)] shadow-sm border border-[var(--color-mist)] rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-champagne)] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-[var(--color-charcoal)]" />
                  </div>
                  <div className="p-4 bg-white shadow-sm border border-[var(--color-mist)] rounded-2xl rounded-tl-none flex items-center gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-[var(--color-stone-light)] rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-[var(--color-stone-light)] rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-[var(--color-stone-light)] rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[var(--color-mist)] shrink-0">
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-[11px] px-3 py-1.5 bg-[var(--color-warm-white)] text-[var(--color-stone)] hover:bg-[var(--color-champagne)]/20 hover:text-[var(--color-charcoal)] rounded-full transition-colors border border-[var(--color-mist)] text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-[var(--color-warm-white)] border border-[var(--color-mist)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-champagne)] transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-[var(--color-charcoal)] text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-stone)] transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
