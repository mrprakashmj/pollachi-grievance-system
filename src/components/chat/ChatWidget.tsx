'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, X, Send, Trash2, Minimize2, Sparkles } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/date-formatter';
import { cn } from '@/lib/utils/cn';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
    const { messages, isLoading, isOpen, sendMessage, clearChat, setIsOpen } = useChat();
    const { userData } = useAuth();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(input.trim(), userData?.role || 'public');
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className={styles.chatWindow}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerInfo}>
                            <div className={styles.botIcon}>
                                <Sparkles size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className={styles.botName}>PMC Assistant</h3>
                                <p className={styles.botSubtitle}>AI-Powered Help</p>
                            </div>
                        </div>
                        <div className={styles.headerActions}>
                            <button
                                onClick={clearChat}
                                className={styles.headerBtn}
                                title="Clear chat"
                            >
                                <Trash2 size={16} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={styles.headerBtn}
                            >
                                <Minimize2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        className={styles.messagesArea}
                    >
                        {messages.length === 0 && (
                            <div className={styles.welcomeScreen}>
                                <Sparkles size={32} className="mx-auto mb-3 text-primary" />
                                <p className={styles.welcomeTitle}>
                                    Hi! I&apos;m your PMC Assistant
                                </p>
                                <p className={styles.welcomeText}>
                                    I can help you file complaints, track status, and answer questions about civic services.
                                </p>
                                <div className="mt-4 space-y-2">
                                    {['I have a water supply issue', 'Track my complaint status', 'What departments are available?'].map(
                                        (suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => {
                                                    setInput(suggestion);
                                                    sendMessage(suggestion, userData?.role || 'public');
                                                }}
                                                className={styles.suggestionBtn}
                                            >
                                                {suggestion}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    styles.messageRow,
                                    msg.role === 'user' ? styles.messageRowUser : styles.messageRowBot
                                )}
                            >
                                <div
                                    className={cn(
                                        styles.messageBubble,
                                        msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot
                                    )}
                                >
                                    <p className={styles.messageText}>{msg.content}</p>
                                    <p className={styles.messageTime}>
                                        {formatTimeAgo(msg.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className={styles.loadingBubble}>
                                <div className={styles.typingIndicator}>
                                    <div className={styles.dots}>
                                        <div className={styles.dot} style={{ animationDelay: '0ms' }} />
                                        <div className={styles.dot} style={{ animationDelay: '150ms' }} />
                                        <div className={styles.dot} style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className={styles.inputArea}>
                        <div className={styles.inputWrapper}>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className={styles.input}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className={styles.sendBtn}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.floatingBtn}
            >
                {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
            </button>
        </>
    );
}
