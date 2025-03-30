"use client";

import { ActionBar, Checkbox, Portal, Stack, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { type DAS } from "helius-sdk";
import { TokenTable } from "./TokenTable";
import { Pagination } from "./Pagination";
import { ActionBarContent } from "./ActionBarContent";
import { type TokenAsset } from "@/types";

const ITEMS_PER_PAGE = 50;

export const TokenTableContainer = ({ user }: { user: string }) => {
  const [selection, setSelection] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [allAssets, setAllAssets] = useState<TokenAsset[]>([]);
  const [showOnlyFungible, setShowOnlyFungible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [receiver, setReceiver] = useState("");

  const hasSelection = selection.length > 0;

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/assets?owner=${user}`);
        const data: DAS.GetAssetResponseList = await response.json();

        const newAssets = data.items.map((asset: DAS.GetAssetResponse) => ({
          id: asset.id,
          name: asset.content?.metadata?.name || "Unknown",
          image: asset.content?.links?.image,
          amount: asset.token_info?.balance
            ? asset.token_info?.balance /
              10 ** (asset.token_info?.decimals || 0)
            : 0,
          decimals: asset.token_info?.decimals || 0,
          interface: asset.interface,
          amountToSend: asset.token_info?.balance
            ? asset.token_info?.balance /
              10 ** (asset.token_info?.decimals || 0)
            : 0,
          associated_token_address: asset.token_info?.associated_token_address || "",
          token_program: asset.token_info?.token_program || "",
        }));

        setAllAssets(newAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [user]);

  const filteredAssets = showOnlyFungible
    ? allAssets.filter((asset) => asset.interface === "FungibleToken")
    : allAssets;

  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageAssets = filteredAssets.slice(startIndex, endIndex);

  const handleAmountChange = (id: string, value: number) => {
    setAllAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, amountToSend: value } : asset
      )
    );
    if (!selection.includes(id)) {
      setSelection((prev) => [...prev, id]);
    }
  };

  return (
    <Stack width="full" gap="5">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Checkbox.Root
          checked={showOnlyFungible}
          onCheckedChange={(changes) => {
            setShowOnlyFungible(changes.checked === true);
            setPage(1);
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label color="gray.700">Show tokens only</Checkbox.Label>
        </Checkbox.Root>
      </Box>

      <TokenTable
        assets={currentPageAssets}
        selection={selection}
        onSelectionChange={setSelection}
        onAmountChange={handleAmountChange}
        isLoading={isLoading}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrevPage={() => page > 1 && setPage(page - 1)}
        onNextPage={() => page < totalPages && setPage(page + 1)}
      />

      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBarContent
              receiver={receiver}
              onReceiverChange={setReceiver}
              onReceiverPaste={setReceiver}
              selectedAssets={allAssets.filter((asset) =>
                selection.includes(asset.id)
              )}
            />
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </Stack>
  );
};
