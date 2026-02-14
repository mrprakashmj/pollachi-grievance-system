export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ChatConversation {
    id: string;
    userId: string;
    userRole: string;
    complaintId?: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatRequest {
    messages: ChatMessage[];
    userRole: string;
    department?: string;
    complaintId?: string;
}

export interface ChatResponse {
    message: string;
    suggestions?: string[];
    detectedDepartment?: string;
}
