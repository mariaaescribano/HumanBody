




'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, Progress, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import CustomCard from '../global/cards/CustomCard';
import { CircProgressMini } from './CircProgressMini';
import MacroCalView from './MacroCalView';
import EBookButton from '../global/random/EBookButton';
import { AddIcon } from '@chakra-ui/icons';
import { macroPorcentajes } from '../../../../backend/src/dto/recibos.dto';

export default function Adive(props: {soymacro: string }) 
{
    const [quieroVer, setquieroVer] = useState<boolean>(false);

 
  return (
   <>
    <Box ml={{base:"0px", md:"8px"}} onClick={()=> setquieroVer(!quieroVer)} cursor="pointer" position="relative">
        {/* Mostrar texto con posición absoluta */}
        {quieroVer && (
        <Box position="absolute" zIndex="10" top="100%" whiteSpace={{sm: "wrap", md:"nowrap"}}  h="auto" left="0" mt="4px" bg="black" p="2px" borderRadius="4px">
            <Text color="white" fontSize="sm"  p="4px">
            You ate too much {props.soymacro}
            </Text>
        </Box>
        )}
        {quieroVer== true && <svg cursor="pointer" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480.21-359q25.17 0 41.98-17.32Q539-393.65 539-418.82q0-25.18-16.82-41.68T480.49-477q-24.86 0-42.18 16.14Q421-444.73 421-419.18q0 25.18 17.02 42.68 17.03 17.5 42.19 17.5ZM427-524h106v-248H427v248ZM34-30v-765q0-57.13 39.44-96.56Q112.88-931 170-931h620q57.13 0 96.56 39.44Q926-852.13 926-795v459q0 57.12-39.44 96.56Q847.13-200 790-200H204L34-30Zm132-306h624v-459H170v456l-4 3Zm4 0v-459 459Z"/></svg>}
        {quieroVer== false&& <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M34-30v-765q0-57.13 39.44-96.56Q112.88-931 170-931h620q57.13 0 96.56 39.44Q926-852.13 926-795v459q0 57.12-39.44 96.56Q847.13-200 790-200H204L34-30Zm446.21-329Q505-359 522-376.32q17-17.33 17-42.5 0-25.18-17.01-41.68t-41.5-16.5q-24.49 0-41.99 16.32-17.5 16.33-17.5 41.5 0 25.18 17.21 42.68t42 17.5ZM427-524h106v-248H427v248Z"/></svg>}
    </Box>
   </>

  );
}
