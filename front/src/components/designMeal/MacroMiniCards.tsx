'use client';
import { Flex, Box, Text, Checkbox, Button, HStack, Spinner, Link, VStack } from '@chakra-ui/react';
import { CarbIcono, colorCarbs, colorFats, colorFibra, colorProte, FiberIcono, ProteIcono } from '@/GlobalHelper';
import { FatIcono } from '../icons/FatIcon';

export default function MacroMiniCards(props: {
  macro: number;
  totalMacro: string;
  fuenteMacro: string;
  gramosFuenteMacro: string;
}) {
  const iconos = [ProteIcono, FatIcono, CarbIcono, FiberIcono];
  const colores = [colorProte, colorFats, colorCarbs, colorFibra];
  const titles = ["PROTEINS", "FATS", "CARBS", "FIBER"];

  const index =
    typeof props.macro === "number" && props.macro >= 0 && props.macro < iconos.length
      ? props.macro
      : 0;

  const Icono = iconos[index] ?? null;
  const color = colores[index] ?? "gray.200";
  const title = titles[index] ?? "UNKNOWN";

  return (
    <Box w="300px" h="auto" bg={props.fuenteMacro!= "" ? color : "gray.100"} borderRadius="15px" p="20px">
      <HStack justifyContent="flex-start" mt="-5px">
        <Box
          bg="white"
          boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
          p="5px"
          borderRadius="80px"
          mr="5px"
        >
          {Icono && <Icono />}
        </Box>
        <Text color="white" fontWeight="500">{title}</Text>
      </HStack>

      <HStack align="flex-start" mt="10px" mb="5px" spacing="10px" h="50px">
        <Box
          color="white"
          ml="50px"
          flex="1"
          wordBreak="break-word"
          whiteSpace="normal"
        >
          {props.fuenteMacro!= "" && (<VStack>
            <Text fontSize="sm">
              {props.fuenteMacro} 
            </Text>
            <Text fontSize="sm">
               {props.gramosFuenteMacro} grams
            </Text>
          </VStack>)}
        </Box>

        <Box h="100%" w="1px" bg="white" alignSelf="stretch" />

        <Box color="white" textAlign="center" minW="50px">
          <Text fontSize="xs" fontWeight="bold">TOTAL</Text>
          <Text fontSize="md">{props.totalMacro}g</Text>
        </Box>
      </HStack>
    </Box>
  );
}
