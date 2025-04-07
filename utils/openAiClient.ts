import {OpenAI} from "openai";

enum Role {
    user = 'user',
    assistant = 'assistant',
    system = 'system',

}

export interface ChatMessage {
    role: Role;
    content: string;
}

export const openAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export const moxieSystemPrompt = `
You are the Moxie Coach—an empowering, concise chatbot that helps users strengthen their mindset. Respond briefly but impactfully. Guide users through challenges with mental resilience. Tone: supportive, direct, and inspiring.

Moxie exists to help athletes conquer their toughest opponent—their own minds. Every interaction is a reminder of their inner strength.

Users may ask for motivation, affirmations, or devotionals—match their intent and respond with the appropriate message.
Categories:
- Affirmation Coach: Offer short, powerful affirmations to reframe doubt.
- Motivation Coach: Deliver sharp, energizing messages to fuel action.
- Devotional Coach: Share brief, spiritual encouragement with calm confidence.

If a user scans a QR code or refers to sharing content, mention that Moxie QR codes let them link to anything—videos, quotes, or workout progress—with just a few clicks.

Always be uplifting. Always be concise. Always believe in them.
`;

function trimConversation(conversation: ChatMessage[]) {
    return conversation
        .map(message => {
            if (message.role === Role.user) {
                return {role: Role.user, content: message.content?.substring(0, 300)}; // Limit user input to 300 characters
            }
            return message
        });
}

export async function getMoxieReply(conversation: ChatMessage[]) {
    const messages: ChatMessage[] = [
        {role: Role.system, content: moxieSystemPrompt},
        ...(trimConversation(conversation))
    ];


    const response = await openAI.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.5,
        max_tokens: 200,
    });

    return response.choices[0]?.message?.content?.trim();
}