"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  Download,
  Send,
  Loader2,
  Bot
} from 'lucide-react';
import { usePlatformStore } from '@/store/platformStore';

type Message = {
    id: string;
    role: 'user' | 'agent';
    content: React.ReactNode;
    isError?: boolean;
};

export default function AgentConsolePage() {
    const selectedDataset = usePlatformStore(state => state.datasetName);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!selectedDataset) {
            setMessages([{
                id: 'no-dataset',
                role: 'agent',
                content: "Please upload and select a dataset in Datasets before starting a chat."
            }]);
        } else {
            setMessages([{
                id: 'ready',
                role: 'agent',
                content: `Ready to answer questions about ${selectedDataset}. Ask me anything about the pipeline results.`
            }]);
        }
    }, [selectedDataset]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);
    
    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || inputValue;
        if (!textToSend.trim()) return;
        
        if (!selectedDataset) {
            setMessages(prev => [...prev, 
                { id: Date.now().toString(), role: 'user', content: textToSend.trim() },
                { id: Date.now().toString() + '-err', role: 'agent', content: "Please upload and select a dataset first.", isError: true }
            ]);
            setInputValue('');
            return;
        }

        const query = textToSend.trim();
        setInputValue('');
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: query }]);
        setIsTyping(true);
        
        try {
            const response = await usePlatformStore.getState().chat(query);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'agent', content: response }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'agent', content: error.message || "An error occurred while communicating with the agent.", isError: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    const suggestedPrompts = [
        "Summarize today's findings.",
        "Explain how the model was chosen.",
        "Suggest improvements.",
        "Create an executive report.",
        "Predict next month's sales."
    ];

    return (
        <div className="flex flex-col w-full h-[calc(100vh-80px)] relative bg-background">
            
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-border bg-white/80 backdrop-blur-md z-10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shadow-sm">
                        <Bot size={22} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-text-primary leading-tight font-heading">AI Analyst</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                            <span className="text-xs text-text-secondary font-medium">Ready to assist</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMessages(!selectedDataset ? [{ id: 'no-dataset', role: 'agent', content: "Please upload and select a dataset in Datasets before starting a chat." }] : [{ id: 'ready', role: 'agent', content: `Ready to answer questions about ${selectedDataset}. Ask me anything about the pipeline results.` }])}
                        className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors flex items-center gap-2 bg-white"
                    >
                        <Trash2 size={14} /> Clear
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors flex items-center gap-2 bg-white">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 flex flex-col gap-8 w-full max-w-4xl mx-auto scroll-smooth pb-48">
                
                {messages.map((msg) => (
                    msg.role === 'user' ? (
                        <motion.div key={msg.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="flex flex-col items-end w-full">
                            <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] text-[15px] shadow-md leading-relaxed">
                                {msg.content}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key={msg.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="flex gap-4 w-full items-start">
                            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                                <Bot className="text-primary" size={18} />
                            </div>
                            
                            <div className="flex-1 max-w-[90%] space-y-5">
                                <div className={`text-[15px] leading-relaxed ${msg.isError ? 'text-red-500 font-medium' : 'text-text-primary'}`}>
                                    {typeof msg.content === 'string' ? (
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                ))}

                {isTyping && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex gap-4 w-full items-start">
                        <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                            <Loader2 className="text-primary animate-spin" size={18} />
                        </div>
                        <div className="bg-white border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-hover animate-bounce"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-hover animate-bounce" style={{animationDelay: '0.15s'}}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-hover animate-bounce" style={{animationDelay: '0.3s'}}></span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-12 pb-6 px-4 z-20 backdrop-blur-[2px]">
                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                    
                    {/* Suggested Prompts */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {suggestedPrompts.map((prompt, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleSend(prompt)}
                            className="whitespace-nowrap px-4 py-2.5 rounded-xl border border-border bg-white text-text-secondary text-[13px] font-medium hover:bg-surface-hover hover:text-text-primary hover:border-primary-light transition-all shadow-sm flex-shrink-0"
                          >
                              {prompt}
                          </button>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="relative bg-white rounded-2xl border border-border shadow-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all flex items-end overflow-hidden">
                        <textarea 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="w-full bg-transparent border-none focus:ring-0 resize-none py-4 pl-4 pr-16 text-[15px] text-text-primary placeholder-text-tertiary min-h-[60px] max-h-40" 
                            placeholder="Message Agentix Analyst..." 
                            rows={1}
                        />

                        <div className="absolute right-3 bottom-3">
                            <button 
                              disabled={!inputValue.trim() || isTyping}
                              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${inputValue.trim() && !isTyping ? 'bg-primary text-white hover:bg-primary-hover shadow-md hover:-translate-y-[1px]' : 'bg-surface-hover text-text-tertiary'}`} 
                              onClick={() => handleSend()}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-[11px] text-text-tertiary font-medium">Agentix is an AI and can make mistakes. Please verify critical outputs.</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
