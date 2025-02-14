'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, VStack } from '@chakra-ui/react';
import router from 'next/router';

// Assets
import { MdOutlineShoppingBasket } from 'react-icons/md';
import LeftRightButtons from './LeftRightButtons';

export default function BarnerMorado(props: { title:string }) {

  return (
    <Card
        background="purple.100"
        boxShadow="xs"
        h={{base: "100px", md: '70px'}}
        padding="6"
        w="100%"
        fontWeight="700"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontFamily="Times New Roman, serif" fontSize="3xl">{props.title}</Text>
    </Card>
  );
}
