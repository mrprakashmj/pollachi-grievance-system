import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODELS } from '@/lib/groq/client';
import { getSystemPrompt } from '@/lib/groq/prompts';
import { UserRole } from '@/types/user';

export async function POST(req: NextRequest) {
    try {
        const { messages, role } = await req.json();

        const systemPrompt = getSystemPrompt(role);

        const response = await groq.chat.completions.create({
            model: GROQ_MODELS.LLAMA_3_3_70B,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages,
            ],
            temperature: 0.7,
            max_tokens: 1024,
            stream: true,
        });

        // Create a streaming response
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                }
                controller.close();
            },
        });

        return new NextResponse(stream);
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
