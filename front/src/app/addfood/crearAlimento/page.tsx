'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Icon,
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
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import SelectSignIn from '@/components/signin/SelectSignIn';
import PopUpMessage from '@/components/global/PopUpMessage';
import PopUpErrorMessage from '@/components/global/PopUpErrorMessage';
import PurpleSpinner from '@/components/global/Spinner';
import CustomCard from '@/components/global/CustomCard';
import { API_URL, getTamanyoPantalla } from '../../../../GlobalHelper';
import { miniCartaAlimento } from '../../../../../backend/src/dto/alimentos.dto';
import InputField from '@/components/global/InputField';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { PieChardMacroNutr } from '@/components/global/PieChardMacroNutr';
import MacroNutrCardEdit from '@/components/addfood/crearAlimento/MacroNutrCardEdit';
import { MdCheck } from 'react-icons/md';

export default function CrearAlimento() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [screenSize, setscreenSize ] = useState<string>("");

  useEffect(() => 
  {
    getTamanyoPantalla(setscreenSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 



  return (
   <Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        p="20px"
        minH="100vh"
        position={"relative"}
    >

    
    <CustomCard hijo={ 
         <>
       <Flex justify="start" gap="5px" align="center" mb="10px">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
                style={{ verticalAlign: 'middle' }} // Asegura que el SVG se alinee con el texto
            >
                <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
            </svg>

            <Text color={textColor} fontSize="2xl" fontWeight="700">
                CREATE A FOOD
            </Text>
            </Flex>


        <Box w="100%" borderBottom="2px solid black" my="20px" />

        <Button
            variant="darkBrand"
            fontSize="sm"
            borderRadius="16px"
            bg="purple.100"
            w={{ base: '128px', md: '148px' }}
            h="46px"
            _hover={{ bg: "gray.100" }}
            // onClick={props.goback}
            leftIcon={<Icon as={MdCheck} />}
        >
           FINISHED
        </Button>
    </> }></CustomCard>



    <CustomCard hijo={ 
        <>
        <Box mb={{ base: '20px', md: '20px' }}>
      {/* SimpleGrid ajusta las columnas según el tamaño de la pantalla */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
        <VStack >
            <InputField
            mb="20px"
            
            id="first"
            placeholder="Apple"
            label="Food Name"
            />
            <HStack ml="30px">
                <InputField
                mb="0px"
                id="second"
                placeholder="57"
                label="Calories per 100 grams"
                />
                <Text mt="30px">kcal</Text>
            </HStack>
       
        </VStack>

        <Box w={{ base: '200px', md: '100%' }} ml={{ base: "30px", md: "0px" }}>
          <PieChardMacroNutr />
        </Box>
      </SimpleGrid>

      {/* Centrar el componente CircProgressMacroEdit */}
     
    </Box>

    </>}></CustomCard>

    {screenSize != "" && <CustomCard hijo={ <MacroNutrCardEdit title={"PROTEINS"} totalMacro={'PROTEINS'} total={'22'} screenSize={screenSize} infoLista={["Complete", "Incomplete"]}></MacroNutrCardEdit>}></CustomCard>}
    
    {screenSize != "" && <CustomCard hijo={ <MacroNutrCardEdit title={'FATS'} totalMacro={'FATS'} total={'22'} screenSize={screenSize} infoLista={["Monounsaturated", "Polyunsaturated", "Saturated"]}></MacroNutrCardEdit>}></CustomCard>}

    {screenSize != "" &&  <CustomCard hijo={  <MacroNutrCardEdit title={'CARBS'} totalMacro={'CARBS'} total={'22'} screenSize={screenSize} infoLista={["Fiber", "Complex", "Simples"]}></MacroNutrCardEdit>}></CustomCard>}

    </Flex>);

}
