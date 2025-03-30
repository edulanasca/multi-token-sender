import { type Interface } from "helius-sdk";

export interface TokenAsset {
  id: string;
  associated_token_address: string;
  name: string;
  image?: string;
  amount: number;
  decimals: number;
  interface: Interface;
  amountToSend?: number;
  token_program: string;
}
