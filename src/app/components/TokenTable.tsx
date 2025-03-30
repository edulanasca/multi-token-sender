"use client";

import {
  Checkbox,
  Table,
  Box,
} from "@chakra-ui/react";
import { TokenRow } from "./TokenRow";
import { type TokenAsset } from "@/types";

interface TokenTableProps {
  assets: TokenAsset[];
  selection: string[];
  onSelectionChange: (ids: string[]) => void;
  onAmountChange: (id: string, value: number) => void;
  isLoading: boolean;
}

export const TokenTable = ({ assets = [], selection = [], onSelectionChange, onAmountChange, isLoading }: TokenTableProps) => (
  <Box overflowX="auto" width="full">
    <Table.Root variant="outline" bg="white" minW="800px">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader w="6">
            <Checkbox.Root
              size="sm"
              top="0.5"
              aria-label="Select all rows"
              checked={selection.length > 0}
              onCheckedChange={(changes) => 
                onSelectionChange(changes.checked ? assets.map(asset => asset.id) : [])
              }
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
          </Table.ColumnHeader>
          <Table.ColumnHeader color="gray.700" minW="200px">Token</Table.ColumnHeader>
          <Table.ColumnHeader color="gray.700" minW="150px">Amount</Table.ColumnHeader>
          <Table.ColumnHeader color="gray.700" minW="150px">Amount to Send</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isLoading ? (
          <Table.Row>
            <Table.Cell colSpan={4} textAlign="center" color="gray.600">Loading...</Table.Cell>
          </Table.Row>
        ) : assets.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={4} textAlign="center" color="gray.600">No tokens found</Table.Cell>
          </Table.Row>
        ) : (
          assets.map((item) => (
            <TokenRow
              key={item.id}
              item={item}
              isSelected={selection.includes(item.id)}
              onSelectionChange={(checked) => {
                const newSelection = checked
                  ? [...selection, item.id]
                  : selection.filter(id => id !== item.id);
                onSelectionChange(newSelection);
              }}
              onAmountChange={(value) => {
                const cleanValue = value.replace(/^0+/, "") || "0";
                const numValue = parseFloat(cleanValue);
                if (!isNaN(numValue)) {
                  onAmountChange(item.id, numValue);
                }
              }}
            />
          ))
        )}
      </Table.Body>
    </Table.Root>
  </Box>
);
