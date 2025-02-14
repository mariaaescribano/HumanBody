import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { Box, ChakraProvider, Spinner } from '@chakra-ui/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body id="root">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
