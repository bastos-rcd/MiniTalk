export type Importance = 'normal' | 'important' | 'urgent';

export interface Message {
    id: number;
    user: string;
    text: string;
    importance: Importance;
    color: string;
    timestamp: string;
    delivered?: boolean;
}