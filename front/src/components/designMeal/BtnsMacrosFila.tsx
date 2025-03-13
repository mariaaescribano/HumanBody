'use client';
import { Flex, Box, Text, Checkbox, Button, HStack, Spinner, Link } from '@chakra-ui/react';
import { CarbIcono, colorCarbs, colorFats, colorFibra, colorProte, FiberIcono, ProteIcono } from '@/GlobalHelper';
import { FatIcono } from '../icons/FatIcon';

export default function BtnsMacrosFila(props:{ macroViendo:number, setmacroViendo:any }) 
{
    return (
      <Box w={{ base: "60%", md: "100%" }} ml={{ base: "105px", md: "0px" }}>

      <HStack spacing="10px">

        <Button
          w={props.macroViendo == 0 ? "110px" : "100px"}
          h={props.macroViendo == 0 ? "50px" : "40px"}
          borderRadius="10px"
          bg={ colorProte}
          boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
          _hover={props.macroViendo == 0 ? {} : { bg: "gray.200" }}
          display="flex"
          onClick={() => props.setmacroViendo(0)}
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg="white"
            boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
            p="5px"
            borderRadius="80px"
            mr="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ProteIcono />
          </Box>
        </Button>

        <Button
          w={props.macroViendo == 1 ? "110px" : "100px"}
          h={props.macroViendo == 1 ? "50px" : "40px"}
          onClick={() => props.setmacroViendo(1)}
          _hover={props.macroViendo == 1 ? {} : { bg: "gray.200" }}
          borderRadius="10px"
          boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
          bg={ colorFats}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p="0"
        >
          <Box
            bg="white"
            boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
            p="5px"
            borderRadius="80px"
            mr="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FatIcono />
          </Box>
        </Button>

        <Button
          w={props.macroViendo == 2 ? "110px" : "100px"}
          h={props.macroViendo == 2 ? "50px" : "40px"}
          onClick={() => props.setmacroViendo(2)}
          _hover={props.macroViendo == 2 ? {} : { bg: "gray.200" }}
          borderRadius="10px"
          boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
          bg={colorCarbs}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p="0"
        >
          <Box
            bg="white"
            boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
            p="5px"
            borderRadius="80px"
            mr="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CarbIcono />
          </Box>
        </Button>

        <Button
          w={props.macroViendo == 3 ? "110px" : "100px"}
          h={props.macroViendo == 3 ? "50px" : "40px"}
          onClick={() => props.setmacroViendo(3)}
          _hover={props.macroViendo == 3 ? {} : { bg: "gray.200" }}
          borderRadius="10px"
          bg={colorFibra}
          boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p="0"
        >
          <Box
            bg="white"
            boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
            p="5px"
            borderRadius="80px"
            mr="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiberIcono />
          </Box>
        </Button>
      </HStack>  
    </Box>
    );
}