"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const WalletContextProvider = dynamic(
  () =>
    import("./WalletContextProvider").then((mod) => mod.WalletContextProvider),
  { ssr: false }
);

interface Props {
  children: ReactNode;
}

export function ClientWalletProvider({ children }: Props) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}
