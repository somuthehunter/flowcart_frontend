export type AIAgentTone =
    | "professional"
    | "friendly"
    | "formal"
    | "enthusiastic";

export interface AIAgentConfigResponse {
    assistantName: string;
    tone: AIAgentTone;
    responseLength: number;
    useEmojis: boolean;
    systemPrompt: string;
    salesPrompt: string;
    servicePrompt: string;
}
