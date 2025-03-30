import { Helius } from 'helius-sdk';

// Create a singleton instance of Helius
let heliusInstance: Helius | null = null;

const getHeliusInstance = () => {
  if (!heliusInstance) {
    const url = process.env.NEXT_PUBLIC_RPC_URL || "";
    const apiKey = process.env.HELIUS_API_KEY || "";
    heliusInstance = new Helius(apiKey, url.includes('devnet') ? 'devnet' : 'mainnet-beta', undefined, url);
  }
  return heliusInstance;
};

export const helius = getHeliusInstance();