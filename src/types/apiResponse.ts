import { Message } from '@/model/User.model';

export interface MessageStats {
    total: number;
    totalPositive: number;
    totalNeutral: number;
    totalNegative: number;
    weeklyTotal: number;
    positivePercentage: number;
    neutralPercentage: number;
    negativePercentage: number;
    totalPercentageChange: number;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
    MessageStats?: MessageStats;
}
