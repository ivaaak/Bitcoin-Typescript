// Basic structure for transactions
export interface Transaction {
    fromAddress: string | null;  // null for mining rewards
    toAddress: string;
    amount: number;
    timestamp: number;
    signature?: string;
}