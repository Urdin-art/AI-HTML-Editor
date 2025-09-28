
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import SendIcon from './icons/SendIcon';
import TrashIcon from './icons/TrashIcon';
import LoadingSpinner from './LoadingSpinner';

const COOLDOWN_SECONDS = 30;

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClearMemory: () => void;
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, onClearMemory, isLoading }) => {
  const [input, setInput] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  const handleSend = () => {
    if (input.trim() && !isLoading && cooldown === 0) {
      onSendMessage(input);
      setInput('');
      setCooldown(COOLDOWN_SECONDS);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-stone-light">
      <div className="p-4 border-b border-stone-light flex justify-between items-center">
        <h2 className="text-xl font-bold text-clay-dark">Chat de Asistencia</h2>
        <button
          onClick={onClearMemory}
          className="p-2 text-stone-DEFAULT hover:text-rust hover:bg-rust/10 rounded-full transition-colors"
          title="Borrar memoria"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-stone-light/50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow ${{
                [MessageAuthor.USER]: 'bg-accent text-white rounded-br-none',
                [MessageAuthor.GEMINI]: 'bg-white text-stone-dark rounded-bl-none',
                [MessageAuthor.SYSTEM]: 'bg-stone-200 text-stone-dark rounded-none text-sm text-center w-full max-w-full',
              }[msg.author]}`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start mb-4">
                 <div className="max-w-xs px-4 py-2 rounded-2xl bg-white text-stone-dark rounded-bl-none shadow">
                    <LoadingSpinner />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-stone-light bg-white">
        <div className="relative">
          <textarea
            className="w-full p-3 pr-24 border-2 border-clay rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none transition-shadow"
            rows={2}
            placeholder="Pide un cambio o haz una pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || cooldown > 0}
          />
          <button
            onClick={handleSend}
            className="absolute right-3 bottom-3 p-2 bg-accent text-white rounded-full hover:bg-rust disabled:bg-stone-DEFAULT disabled:cursor-not-allowed transition-all duration-300"
            disabled={isLoading || !input.trim() || cooldown > 0}
          >
            {cooldown > 0 ? (
                <span className="text-sm font-bold w-5 h-5 flex items-center justify-center">{cooldown}</span>
            ) : (
                <SendIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
