'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from "next-themes"
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function ClientChakraProvider({ children }: Props) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
} 