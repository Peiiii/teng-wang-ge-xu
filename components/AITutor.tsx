
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../geminiService.ts';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { FULL_TEXT } from '../constants.tsx';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: '你好！我是你的助教。对《滕王阁序》中的字词、典故或意境有任何疑问，都可以问我哦。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gemini = new GeminiService();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const context = FULL_TEXT.map(p => p.content).join('\n');
      const response = await gemini.askTutor(userMsg, context);
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: '抱歉，我现在有点走神，请再试一次。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e8dcc4]">
      {/* Chat Header */}
      <div className="p-4 bg-[#4a3227] text-[#e8dcc4] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-bold">古文学堂 AI 导师</span>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'bot', content: '对话已重置。有什么我可以帮你的吗？' }])}
          className="p-1 hover:bg-white/10 rounded"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] bg-opacity-10">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#8b7355]' : 'bg-[#e8dcc4]'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-[#4a3227]" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#4a3227] text-white rounded-tr-none' : 'bg-[#f4f1ea] text-[#2c1810] border border-[#e8dcc4] rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f4f1ea] p-4 rounded-2xl flex items-center gap-2">
              <Loader2 className="animate-spin text-[#8b7355]" size={16} />
              <span className="text-xs text-[#8b7355]">正在查阅古籍...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#e8dcc4] bg-white">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="例如：解释一下'龙光射牛斗之墟'的典故..."
            className="flex-1 px-4 py-2 bg-[#fdfaf5] border border-[#e8dcc4] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8b7355] text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-[#4a3227] text-white rounded-full flex items-center justify-center hover:bg-[#2c1810] disabled:opacity-50 transition-all shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
