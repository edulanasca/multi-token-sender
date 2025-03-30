"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenTableContainer } from "@/app/components/TokenTableContainer";
import { Toaster } from "@/components/ui/toaster";
import { Box, Container, Heading, VStack, Text, Spinner } from "@chakra-ui/react";

export default function Home() {
  const { publicKey, connected, connecting } = useWallet();

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4} color="gray.800">
              Solana Multi Token Sender
            </Heading>
            <Text color="gray.600" mb={6}>
              Send multiple tokens to any Solana address in one transaction
            </Text>
            <Box display="flex" justifyContent="center" mb={8}>
              <WalletMultiButton />
            </Box>
          </Box>
          
          {connecting ? (
            <Box display="flex" justifyContent="center" py={12}>
              <Spinner size="xl" color="blue.500" />
            </Box>
          ) : connected && publicKey ? (
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <TokenTableContainer user={publicKey.toString()}/>
            </Box>
          ) : (
            <Box textAlign="center" py={12}>
              <Text color="gray.600">
                Connect your wallet to view and send your tokens
              </Text>
            </Box>
          )}
          
          <Toaster/>
        </VStack>
      </Container>
    </Box>
  );
}
