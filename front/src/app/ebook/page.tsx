'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
// fotos
import simple1 from '../../../public/Ebooks/simple1.png';
import simple2 from '../../../public/Ebooks/simple2.png';
import fats1 from '../../../public/Ebooks/fats1.png';
import fats2 from '../../../public/Ebooks/fats2.png';
import fats3 from '../../../public/Ebooks/fats3.png';
import proteins from '../../../public/Ebooks/proteins.png';
import aminoacids1 from '../../../public/Ebooks/aminoacids1.png';
import aminoacids2 from '../../../public/Ebooks/aminoacids2.png';
import complex from '../../../public/Ebooks/complex.png';
import fiber from '../../../public/Ebooks/fiber.png';
import fasting1 from '../../../public/Ebooks/fasting1.png';
import hunger from '../../../public/Ebooks/hunger.png';
import fasting2 from '../../../public/Ebooks/fasting2.png'
import fasting3 from '../../../public/Ebooks/fasting3.png';import { getTamanyoPantalla } from '@/GlobalHelper';

export default function Ebook() {

  const [foto, setfoto] = useState<string>("");
  const [screensize, setscreenSize] = useState<string>();
  const [verBotones, setverBotones] = useState<boolean>(false); // para mostar botones al lado
  const type = useRef<string>("");
    const [btnContador, setbtnContador] = useState<number>(0); //contra donde estamos
    const [botones, setbotones] = useState<string[]>([]);
 
    useEffect(() => 
  {
    getTamanyoPantalla(setscreenSize)

    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type');
   
    if(typeParam)
    {   
        type.current = typeParam;
        if(typeParam == "1")
        {
            setverBotones(false);
            setfoto(proteins.src);
        }
        if(typeParam == "2")
        {
            setverBotones(true);
            setbotones([aminoacids1.src, aminoacids2.src]);
            setfoto(aminoacids1.src);
        }
        if(typeParam == "3")
        {
            setverBotones(true);
            setbotones([fats1.src, fats2.src, fats3.src]);
            setfoto(fats1.src);
        }
        if(typeParam == "4")
        {
            setfoto(complex.src);
        }
        if(typeParam == "5")
        {
            setverBotones(true);
            setbotones([simple1.src, simple2.src]);
            setfoto(simple1.src);
        }
        if(typeParam == "6")
        {
            setverBotones(true);
            setbotones([hunger.src, fasting1.src, fasting2.src, fasting3.src]);
            setfoto(hunger.src);
        }
        if(typeParam == "7")
        {
            setfoto(fiber.src);
        }
    }
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   const pasarFotoIzq = () => 
    {
        if(btnContador > 0)
        {
            setbtnContador(btnContador-1);
            setfoto(botones[btnContador-1]);
        }    
    };

    const pasarFotoDer = () => 
    {
        if(btnContador < botones.length-1)
        {
            setbtnContador(btnContador+1);
            setfoto(botones[btnContador+1]);
        }    
    };


  return (<>
    {foto!= "" && <Flex
    direction="column"
    align="center"
    bg="#D8F3F8"
    w="100%"
    h="100%"
    justify="center"
    p="10px"
    minH="100vh"
    position="relative"
    >
        {screensize == "sm" &&
        <VStack>
            { verBotones == true && <Button bg="#D8F3F8" w="100%" mb="20px" onClick={pasarFotoIzq} border="1px solid" borderColor="black" _hover={{ bg: "gray" }} >←</Button>} 
            <Image src={foto} />
            { verBotones == true && <Button bg="#D8F3F8" w="100%" mt="20px" onClick={pasarFotoDer} border="1px solid" borderColor="black"  _hover={{ bg: "gray" }} >→</Button>} 
        </VStack>}

        {screensize !== "sm" &&
        <HStack>
            { verBotones == true && <Button w="100%" mr="20px" bg="#D8F3F8" onClick={pasarFotoIzq} border="1px solid" borderColor="black" _hover={{ bg: "gray" }}>←</Button>} 
            <Image src={foto} />
            { verBotones == true && <Button w="100%" ml="20px" bg="#D8F3F8" border="1px solid" onClick={pasarFotoDer} borderColor="black" _hover={{ bg: "gray" }}>→</Button>} 
        </HStack>}
    </Flex>}

    {foto== "" && 
        <Box
            height= {"100vh" }    
            display="flex"
            alignItems="center"   
            justifyContent="center"  
        >
            <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="black"
            size="xl"
            />
        </Box>}
    </>
    );
}
