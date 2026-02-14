'use client';

import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = useCallback(async (content: string, role: string = 'public') => {
        if (!content.trim()) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    role,
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            // Create a placeholder for the assistant message
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: '',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);

            // Read the stream
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    assistantContent += chunk;

                    // Update the last message in the list (the assistant's content)
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = {
                            ...next[next.length - 1],
                            content: assistantContent,
                        };
                        return next;
                    });
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please check your connection and try again.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const clearChat = useCallback(() => {
        setMessages([]);
    }, []);

    const toggleChat = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return {
        messages,
        isLoading,
        isOpen,
        sendMessage,
        clearChat,
        toggleChat,
        setIsOpen,
    };
}
