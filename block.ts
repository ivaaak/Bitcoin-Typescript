import crypto from 'crypto';
import { Transaction } from "./models/transaction";

// Block structure
export class Block {
    public nonce = 0;
    public hash: string;

    constructor(
        public timestamp: number,
        public transactions: Transaction[],
        public previousHash: string
    ) {
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        return crypto.createHash('sha256')
            .update(
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce
            ).digest('hex');
    }

    // Simplified mining with proof of work
    mine(difficulty: number) {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}
