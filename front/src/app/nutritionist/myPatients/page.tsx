'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components

import React, { useEffect, useRef, useState } from 'react';
import { API_URL, colorNutricionist, redirigirSiNoHayNutriNom, StringIsNull, tryAgain } from '../../../GlobalHelper';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import InputField from '@/components/global/random/InputField';
import BarraMenuNutri from '@/components/nutritionist/BarraMenuNutri';
import CustomCard from '@/components/global/cards/CustomCard';


export default function MyPatients() 
{
    const [nom, setnom] = useState<string>("");
    const [contra, setcontra] = useState<string>("");
    const errorText = useRef<string>("");

    // 0: si no hay nombre de nutri vuelve a inicio
    useEffect(() => 
    {
        redirigirSiNoHayNutriNom();
    }, []);


  return (
    <Flex
        direction="column"
        align="center"
        bg={colorNutricionist}
        w="100%"
        h="100%"
        justify="center"
        minH="100vh"
        position={"relative"}
    >
       <BarraMenuNutri rellena={"patients"} />

       {/* title */}
       <CustomCard mt="0px" p="20px" hijo={
            <HStack>
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Z"/></svg>
                <Text fontSize="xl" fontWeight={"bold"}>MY PATIENTS</Text>
            </HStack>
        }></CustomCard>



    </Flex>);

}
