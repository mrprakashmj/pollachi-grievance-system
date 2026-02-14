import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
    console.warn('Missing GROQ_API_KEY environment variable');
}

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'dummy_key',
});

export const GROQ_MODELS = {
    LLAMA_3_3_70B: 'llama-3.3-70b-versatile',
    LLAMA_3_1_8B: 'llama-3.1-8b-instant',
};

export default groq;
