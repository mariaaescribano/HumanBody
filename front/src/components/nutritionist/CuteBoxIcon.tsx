import React from 'react';
import { Flex, Card, Box, Text } from '@chakra-ui/react'; // Chakra UI para estilos
import { useRouter } from 'next/navigation';
import { colorNutricionist } from '@/GlobalHelper';

export function CuteBoxIcon(props:{icono:any, mt?:string, messagesWithoutRead?:number} ) 
{
  return (
    <Box
        display="flex"
        ml="0px"
        mt={props.mt ? props.mt : "20px"}
        cursor="pointer"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%" // Make the box round
        borderWidth="3px" // Border thickness
        borderStyle="solid"
        borderColor={colorNutricionist}
        w={{ base: "40px", md: "40px" }} 
        h={{ base: "40px", md: "40px" }}
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" // Shadow for depth
        >
        {props.icono}
        
        {props.messagesWithoutRead && props.messagesWithoutRead != 0 &&
        <Box
          position="absolute"
          w="12px" // Width of the small icon
          h="12px" // Height of the small icon
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb="20px"
          ml="15px"
          borderRadius={"10px"}
          bg="red.500"
          p="8px"
        >
          <Text color="white"> {props.messagesWithoutRead}</Text>
        </Box>}
    </Box>

  );
}

