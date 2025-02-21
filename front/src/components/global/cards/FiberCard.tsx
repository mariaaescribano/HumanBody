'use client';
import { CarbsName } from '@/components/Names/CarbName';
import { FatsName } from '@/components/Names/FatsName';
import { ProteinsName } from '@/components/Names/ProteinName';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input } from '@chakra-ui/react';
import { reciboConstNames, reciboSkeleton } from '../../../../../backend/src/dto/recibos.dto';
import { useEffect, useRef } from 'react';
import { esSoloNumeros } from '../../../../GlobalHelper';
import InputField from '../random/InputField';
import EBookButton from '../random/EBookButton';
import { showEbook } from '../../../../../backend/src/dto/ebook.dto';
import { FiberName } from '@/components/Names/FiberName';
import MeryTooltip from '../random/MeryToolTip';



export default function FiberCard(props: { edit:boolean, totalFiber?:string, screenSize:string, ebooklista?:showEbook[]  }) 
{

  return (
    <Flex direction="column" w="100%">
        <HStack>
            <FiberName fontSize="2xl" /> 
            <Text mb="5px" fontSize="2xl" fontWeight={"bold"}>{props.edit == true && (props.screenSize=="sm" ?  "PER 100 G": "PER 100 GRAMS")}
            </Text>
        </HStack>

        { props.edit == false && props.ebooklista &&
        <>
          <Box w="100%" borderBottom="2px solid black" my="20px" />
          <Flex justify="center" gap="20px" mb="30px" w="100%" fontSize="xl" fontWeight="bold" wrap="wrap">
              {props.ebooklista.map((item, index) => (
                  <EBookButton key={index} texto={item.title} />
              ))}
          </Flex>
        </> }

        <Box w="100%" borderBottom="2px solid black" my="20px" />

            

          {props.edit && <Flex justify="center" w="100%" fontSize="xl" fontWeight={"bold"} gap="20px">
            <Text mt="10px">TOTAL FIBER: </Text>
            <InputField />
            <Text mt="10px">grams</Text>
          </Flex>} 


              
        {props.edit == false  &&
          <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"} gap="10px"> 
            <Text>TOTAL FIBER</Text>
            <MeryTooltip texto={"Fiber is a carb but it isn't summed with the carbohydrates."} />

          <HStack>
              <Text> {props.totalFiber} </Text>
              <Text>grams </Text>
          </HStack></Flex>}
   
    </Flex>

  );
}
