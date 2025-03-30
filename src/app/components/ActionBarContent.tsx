import { ActionBar, Button, CloseButton, Input, Link } from "@chakra-ui/react";
import { type TokenAsset } from "@/types";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TokenAccountNotFoundError,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { toaster } from "@/components/ui/toaster";
import { LuExternalLink } from "react-icons/lu";

interface ActionBarContentProps {
  receiver: string;
  onReceiverChange: (value: string) => void;
  onReceiverPaste: (value: string) => void;
  selectedAssets: TokenAsset[];
}

export const ActionBarContent = ({
  receiver,
  onReceiverChange,
  onReceiverPaste,
  selectedAssets,
}: ActionBarContentProps) => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const sendAssets = async () => {
    if (!publicKey) return;
    const receiverPk = new PublicKey(receiver);

    const allInstructions: TransactionInstruction[] = [];

    for (const asset of selectedAssets) {
      const mint = new PublicKey(asset.id);
      const tokenProgram = new PublicKey(asset.token_program);

      const receiverTokenAddress = getAssociatedTokenAddressSync(
        mint,
        receiverPk,
        false,
        tokenProgram
      );

      try {
        await getAccount(connection, receiverTokenAddress);
        await sleep(300);
      } catch (error: unknown) {
        if (error instanceof TokenAccountNotFoundError) {
          allInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              receiverTokenAddress,
              receiverPk,
              mint,
              tokenProgram
            )
          );
        } else {
          throw error;
        }
      }

      if (!asset.amountToSend) continue;

      allInstructions.push(
        createTransferInstruction(
          new PublicKey(asset.associated_token_address!),
          receiverTokenAddress,
          publicKey,
          asset.amountToSend * 10 ** (asset.decimals || 0),
          [],
          tokenProgram
        )
      );
    }

    // Split instructions into chunks that fit within transaction size limit
    const chunkSize = 8; // Adjust this number based on your needs
    const latestBlockhash = await connection.getLatestBlockhash();
    for (let i = 0; i < allInstructions.length; i += chunkSize) {
      const chunk = allInstructions.slice(i, i + chunkSize);
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: chunk,
      }).compileToV0Message();

      const transaction = new VersionedTransaction(messageV0);

      if (signTransaction) {
        try {
          const signedTransaction = await signTransaction(transaction);
          const signature = await connection.sendTransaction(signedTransaction);

          toaster.create({
            title: "Transaction sent",
            description: (
              <Link href={`https://solscan.io/tx/${signature}`}>
                See transaction <LuExternalLink />
              </Link>
            ),
            type: "success",
          });
        } catch (error: unknown) {
          toaster.create({
            title: "Error sending transaction",
            description: error?.toString() ?? "",
            type: "error",
          });
        }
      }
    }
  };

  return (
    <ActionBar.Content>
      <Input
        placeholder="Wallet to send"
        value={receiver.length >= 19 ? formatAddress(receiver) : receiver}
        onChange={(e) => onReceiverChange(e.target.value)}
        onPaste={(e) => {
          e.preventDefault();
          onReceiverPaste(e.clipboardData.getData("text"));
        }}
      />
      <ActionBar.Separator />
      <Button variant="outline" size="sm" onClick={sendAssets}>
        Send
      </Button>
      <ActionBar.CloseTrigger asChild>
        <CloseButton size="sm" />
      </ActionBar.CloseTrigger>
    </ActionBar.Content>
  );
};
