import { Block } from './block';
import { Transaction } from './models/transaction';

class Blockchain {
    private chain: Block[] = [];
    private difficulty = 4;  // Number of leading zeros required
    private pendingTransactions: Transaction[] = [];
    private miningReward = 6.25;  // Current BTC reward
    private maxSupply = 21000000;
    private currentSupply = 0;

    constructor() {
        // Genesis block
        this.chain.push(new Block(Date.now(), [], '0'));
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(minerAddress: string) {
        // Check if max supply reached
        if (this.currentSupply >= this.maxSupply) {
            return false;
        }

        const rewardTx: Transaction = {
            fromAddress: null,
            toAddress: minerAddress,
            amount: this.miningReward,
            timestamp: Date.now()
        };

        this.pendingTransactions.push(rewardTx);

        const block = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );

        block.mine(this.difficulty);
        this.chain.push(block);
        
        this.currentSupply += this.miningReward;
        this.pendingTransactions = [];

        // Halving logic (simplified)
        if (this.chain.length % 210000 === 0) {
            this.miningReward /= 2;
        }

        return true;
    }

    addTransaction(transaction: Transaction) {
        // Basic validation
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Invalid transaction');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalance(address: string): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}