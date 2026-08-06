"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Download, 
  Send, 
  Lightbulb, 
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

const defaultMockupMessages: Message[] = [
    {
        id: 'mock-user-1',
        role: 'user',
        content: "Which region had the highest total revenue in our sales data last month? Can you show me a chart?"
    },
    {
        id: 'mock-agent-1',
        role: 'agent',
        content: (
            <>
                <p className="mb-4">
                    I analyzed the <strong>Q3_Sales_Data.xlsx</strong> dataset. 
                    The region with the highest total revenue last month was the <strong>West Coast</strong>, generating <strong>$1.24 Million</strong> in sales.
                </p>
                
                <p className="mb-4 text-text-secondary font-medium text-sm">Revenue breakdown by region:</p>
                
                {/* Visual Chart Mockup */}
                <div className="w-full bg-white border border-border rounded-xl p-5 shadow-sm mb-4">
                    <div className="space-y-4">
                        {/* Bar 1 */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-text-primary">West Coast</span>
                                <span className="font-semibold text-primary">$1.24M</span>
                            </div>
                            <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden">
                                <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration:0.8, delay:0.4}} className="h-full bg-primary rounded-full"></motion.div>
                            </div>
                        </div>
                        
                        {/* Bar 2 */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-text-secondary">East Coast</span>
                                <span className="font-semibold text-text-primary">$0.98M</span>
                            </div>
                            <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden">
                                <motion.div initial={{width:0}} animate={{width:'79%'}} transition={{duration:0.8, delay:0.6}} className="h-full bg-text-tertiary rounded-full"></motion.div>
                            </div>
                        </div>
                        
                        {/* Bar 3 */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-text-secondary">Midwest</span>
                                <span className="font-semibold text-text-primary">$0.65M</span>
                            </div>
                            <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden">
                                <motion.div initial={{width:0}} animate={{width:'52%'}} transition={{duration:0.8, delay:0.8}} className="h-full bg-text-tertiary rounded-full"></motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary-light/40 border border-primary-light p-4 rounded-xl flex items-start gap-3">
                    <Lightbulb size={18} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-text-primary leading-relaxed">
                        The West Coast region saw a 14% increase compared to the previous month, driven primarily by enterprise software subscriptions.
                    </p>
                </div>
            </>
        )
    }
];

export default function AgentConsolePage() {
    const selectedDataset = usePlatformStore(state => state.selectedDataset);
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!selectedDataset) {
            setMessages([{
                id: 'no-dataset',
                role: 'agent',
                content: "Please upload and select a dataset in the Data Hub before starting a chat."
            }]);
        } else {
            setMessages(defaultMockupMessages);
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
        "Explain why XGBoost was selected.",
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
                        onClick={() => setMessages(!selectedDataset ? [{ id: 'no-dataset', role: 'agent', content: "Please upload and select a dataset in the Data Hub before starting a chat." }] : defaultMockupMessages)}
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
