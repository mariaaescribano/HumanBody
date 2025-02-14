'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image } from '@chakra-ui/react';
import router from 'next/router';

// Assets
import { MdOutlineShoppingBasket } from 'react-icons/md';

export default function IzqPurpleMessage(props: { scienceText: string }) {

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      w="100%"
    >
      <Card
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        bg="purple.100"
        w="100%"
        h="200px"
        borderRadius="20px"
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)">
            {/* <Text fontFamily="Times New Roman, serif" fontSize="xl">VIDEOGAME</Text> */}
            <Text fontFamily="Times New Roman, serif" fontSize="16px" style={{ whiteSpace: "pre-line" }}
            textAlign="center" px="20px">{props.scienceText}</Text>
      </Card>
      
    </Flex>
  );
}
