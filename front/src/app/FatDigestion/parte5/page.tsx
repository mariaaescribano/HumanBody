'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, Box, Text, Flex, Grid, VStack, Button, HStack, Wrap, WrapItem } from '@chakra-ui/react';
import DuodenumInterior from '../../../../public/FatDigestion/DuodenumInterior.png';

//fotos
import saturated from '../../../../public/FatDigestion/Parte5/saturated.png';
import chylomicrons from '../../../../public/FatDigestion/Parte5/chylomicrons.png';
import unsaturated from '../../../../public/FatDigestion/Parte5/unsat.png';
import transfat from '../../../../public/FatDigestion/Parte5/transfat.png';
import donut from '../../../../public/FatDigestion/Parte5/donut.png';
import cheese from '../../../../public/FatDigestion/Parte5/cheese.png';
import nuts from '../../../../public/FatDigestion/Parte5/nuts.png';

import dialogo from '../../../../public/dialogo.png';
import LeftRightButtons from '@/components/global/old/LeftRightButtons';
import PopUpMessage from '@/components/global/PopUpMessage';
import IzqPurpleMessage from '@/components/global/old/IzqPurpleMessage';
import DerPurpleMessage from '@/components/global/DerPurpleMessage';
import BarnerMorado from '@/components/global/BarnerMorado';
import { EscribirTextoDinamico, getTamanyoPantalla, handleMouseEndGlobalHelper, handleMouseStartGlobalHelper, handleMoveMouse, handleTouchEndGlobalHelper, handleTouchMoveGlobalHelper, handleTouchStartGlobalHelper, moveWithKey, moveWithKeyBucle, putDefaultKeys, stopMoveWithKey } from '../../../../GlobalHelper';
import { motion } from "framer-motion";
import CardFFA from '@/components/FatDigestion/CardFFA';

const Parte5FatDigestion = () => 
{
  const [screenSize, setScreenSize] = useState(null);
  const [contador, setcontador] = useState<number>(0);

  const [verChylom, setverChylom] = useState<boolean>(false);



  // tamaño pantalla
  useEffect(() => 
  {
    getTamanyoPantalla(setScreenSize);
  }, []);



  //comprobar si contador ya es 4
  useEffect(() => 
  {
    if(contador == 4)
      {
        const timer = setTimeout(() => 
        {
            // Si breakTry es true, establece el finish después de 3 segundos
            setTimeout(() => {
              setverChylom(true);
            }, 1000);
        }, 1000);
        
        // Limpieza de temporizadores al desmontar o cambiar breakTry
        return () => clearTimeout(timer); 
      }
  }, [contador]);






  // textos
  const textScience = "The food you eat is composed of different free fatty acids. \n With these FFA (free fatty acids), I will be formed, and the density of my structure will change accordingly!";
  const textGame = "To form a Chylomicron, drag all the atoms until the open box and see what happens.";

  const [scienceText, setscienceText] = useState(""); // State for visible text
  const [gameText, setgameText] = useState(""); // State for visible text
  const [index, setIndex] = useState(0); // Tracks the current letter
  const [orden, setorden] = useState(0); // Tracks the current letter

  useEffect(() => 
  {
    if(orden == 0)
    {
      EscribirTextoDinamico(textScience, setscienceText , setIndex, index, orden, setorden);
    }
    else
    {
      EscribirTextoDinamico(textGame, setgameText , setIndex, index, orden, setorden);
    }

  }, [index, orden]);



  return (

    <Box pt={{ base: '20px', md: '20px', xl: '20px' }}>
    
    {/* Barner morado*/}
    <BarnerMorado title={'HUMAN BODY: FAT DIGESTION V'}></BarnerMorado>

    {/* Dialogo de chylomicron */}
    <Flex
        direction="column"
        width="100%"
        p="30px"
        mt="-10px"
        justifyContent="center"
        alignItems="center"
        position="relative" // Hace que VStack se posicione dentro del contexto del Flex
        minHeight="250px" // Asegura espacio para VStack
    >
       
        <Card
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            w="100%"
            h={{ base: "150px", md: "150px" }}
            borderRadius="30px"
            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
            position="relative"
        >
            <Text
                fontFamily="Times New Roman, serif"
                fontSize={screenSize == "sm" ? "16px" : "20px"}
                textAlign="center"
                px="20px"
                w="65%"
                whiteSpace="pre-line"
            >
                {scienceText}
            </Text>
        </Card>

        {/* Envolver VStack en un Box con posición relativa para que no se sobreponga el Flex*/}
        <Box position="relative" width="100%">
            <VStack
                position="absolute" /* Lo saca del flujo normal */
                bottom={screenSize == "sm" ? "-20px" : "-100px"}
                left={screenSize == "sm" ? "-20px" : "0px"}
                transform="translate(0, -10%)"
                zIndex={1}
                width={screenSize == "sm" ? "100px" : "200px"}
                height={screenSize == "sm" ? "100px" : "200px"}
            >
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    backgroundImage={`url(${chylomicrons.src})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    backgroundRepeat="no-repeat"
                    filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5))"
                />
            </VStack>
        </Box>
    </Flex>

    {/* Grid colocado debajo */}
    <Grid
        width="100%"
        p="40px"
        mt={screenSize == "sm" ? "-10px" : "40px" }
        mb={screenSize == "sm" ? "-10px" : "50px" }
        gridTemplateColumns={{
            base: "1fr",
            md: "1fr 1fr 1fr",
            "2xl": "1fr 1fr 1fr",
        }}
        justifyItems="center"
        alignItems="center"
        gap="20px"
    >
        <CardFFA title={"I'M A SATURATED FFA"} img={saturated.src} height={"90px"} img2={cheese.src} height2={"80px"}
        texto={"I can pack myself very densely because my carbon atom chains are linear. \n If there are too many of me in your blood, we can accumulate on the walls of blood vessels, forming plaques, which can lead to cardiovascular problems."}></CardFFA>

        <CardFFA title={"I'M A UNSATURATED FFA"} img={unsaturated.src} height={"200px"} img2={nuts.src} height2={"80px"}
        texto={ "I have curves in my carbon chain that create a less dense structure.\n This makes my packing more relaxed, which allows for more efficient transport through the blood. \n I help you think, breathe, heal and look better!"}></CardFFA>

        <CardFFA title={"I'M A TRANS FFA"} img={transfat.src} height={"120px"} img2={donut.src} height2={"70px"}
        texto={ "I'm an unsaturated fat that went through partial hydrogenation.\n This process changed my double bonds, making me more rigid and slower to move.\n Now, I lower HDL (the good cholesterol), I can cause cardiovascular problems and I can make you have depression and anxiety. I'm sorry!"}></CardFFA>


        
    </Grid>


    <Flex
        direction="column"
        width="100%"
        p="30px"
        mb="10px"
        mt="-10px"
        justifyContent="center"
        alignItems="center"
        position="relative" // Hace que VStack se posicione dentro del contexto del Flex
        minHeight="250px" // Asegura espacio para VStack
    >
       
        <Card
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            w="100%"
            h={{ base: "150px", md: "150px" }}
            borderRadius="30px"
            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
            position="relative"
        >
            <Text
                fontFamily="Times New Roman, serif"
                fontSize={screenSize == "sm" ? "16px" : "20px"}
                textAlign="center"
                px="20px"
                w="65%"
                whiteSpace="pre-line"
            >
                As you've seen, depending on my structure and density, I travel differently through the blood, affecting your body in various ways. So, choose wisely!
            </Text>
        </Card>

        {/* Envolver VStack en un Box con posición relativa para que no se sobreponga el Flex*/}
        <Box position="relative" mb={screenSize == "sm" ? "0px" : "50px" } width="100%" >
            <VStack
                position="absolute" /* Lo saca del flujo normal */
                bottom={screenSize == "sm" ? "-20px" : "-100px"}
                left={screenSize == "sm" ? "-20px" : "0px"}
                transform="translate(0, -10%)"
                zIndex={1}
                width={screenSize == "sm" ? "100px" : "200px"}
                height={screenSize == "sm" ? "100px" : "200px"}
            >
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    backgroundImage={`url(${chylomicrons.src})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    backgroundRepeat="no-repeat"
                    filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5))"
                />
            </VStack>
        </Box>

        <LeftRightButtons urlLeft={"../FatDigestion/parte4"} urlRight={"../FatDigestion/parte6"}></LeftRightButtons>

    </Flex>

    </Box>
  );
};

export default Parte5FatDigestion;
