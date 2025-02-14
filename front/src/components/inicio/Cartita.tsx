'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image } from '@chakra-ui/react';
import router from 'next/router';

// Assets
import { MdOutlineShoppingBasket } from 'react-icons/md';

export default function Cartita(props: { url?: string, foto?:any, setfotoPrincipal?:any, setUrlPlay?:any }) {

  return (
    <Card
      w="120px"
      h="120px"
      onClick={() => {props.setfotoPrincipal(props.foto); props.setUrlPlay(props.url);}}
      borderRadius="20px"
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
      _hover={{
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",  // Sombra más oscura al hacer hover
        transform: "scale(1.05)"  // Le da un pequeño efecto de zoom al hacer hover
      }}
    >
        <Flex
          justifyContent="center"   // Centra horizontalmente
          alignItems="center"       // Centra verticalmente
          h="100%"                  // Ocupa todo el alto del Card
        >
          <Image src={props.foto} />
        </Flex>
    </Card>
  );
}
