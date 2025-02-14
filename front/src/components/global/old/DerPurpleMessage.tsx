'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, VStack } from '@chakra-ui/react';
import router from 'next/router';

// Assets
import { MdOutlineShoppingBasket } from 'react-icons/md';
import LeftRightButtons from './LeftRightButtons';

export default function DerPurpleMessage(props: { gameText: string, urlLeft: string, urlRight: string }) {

  return (
    <Flex justifyContent="center" alignItems="center" w="100%">
        <VStack spacing="10px" align="center" w="100%" mt={{base:"0px", md:"200px"}}>
            {/* Card */}
            <Card
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            bg="purple.100"
            w="100%"
            h="200px"
            borderRadius="20px"
            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
            >
            <Text
                fontFamily="Times New Roman, serif"
                fontSize="16px"
                textAlign="center"
                px="10px"
                style={{ whiteSpace: "pre-line" }} // para q lea \n como salto de linea
            >
                {props.gameText}
            </Text>
            </Card>

            {/* Botón debajo del Card */}
            <LeftRightButtons urlLeft={props.urlLeft} urlRight={props.urlRight}></LeftRightButtons>
        </VStack>
    </Flex>
  );
}
