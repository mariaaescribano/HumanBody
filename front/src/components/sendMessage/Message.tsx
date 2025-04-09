'use client';
import { Box, Button, Flex, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { API_URL, colorNutricionist, colorNutricionistBg} from '@/GlobalHelper';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CustomCard from '../global/cards/CustomCard';
import { messageSkeleton } from '../../../../backend/src/dto/message.dto';
import { NutritionistIcon } from '../icons/NutritionistIcon';

export default function Message(props: {object: messageSkeleton, ref:any, nutri:boolean, diaId?:string})
{

    return (
        <CustomCard mt="0px" p="20px" bgColor={ props.object.sendBy == 0? "white" : colorNutricionistBg }
        hijo={
        <Flex direction="column" ref={ props.ref } >

            {/* btn to go directly a design a day */}
            {props.object.designameal == 1 && 
            <Flex mb="5px">    
                <VStack>
                    <Button onClick={()=> props.nutri == true ? location.href = `./designameal?idDia=${props.diaId}&patientNom=${sessionStorage.getItem("patientTratando")}`:
                    location.href = `./designMeal/lastPage`} 
                    bg={ props.nutri== false ? "purple.100" : colorNutricionist }>
                        Look Design a Day
                    </Button> 
                    <Text whiteSpace="pre-wrap" wordBreak="break-word">{props.object.message}</Text>
                </VStack>
            </Flex>}

            {/* message body */}
            {(props.object.designameal === 0) && 
            <Flex mb="5px">
                {/* message has pic */}
                {props.object.foto != "" && 
                    <VStack w="100%" h="100%">
                        <img 
                            src={props.object.foto} 
                            alt="icon" 
                            style={{
                                maxWidth: "150px", // Increase size
                                maxHeight: "150px", 
                                objectFit: "cover", // Prevent distortion
                                borderRadius: "10px" // Optional: Add rounded corners
                            }} 
                        />
                    {props.object.sendBy==1 && 
                    <HStack>
                            <NutritionistIcon></NutritionistIcon>
                            <Text whiteSpace="pre-wrap" wordBreak="break-word">{": "+props.object.message}</Text>
                    </HStack>} 
                   {props.object.sendBy == 0 && <Text whiteSpace="pre-wrap" wordBreak="break-word">{props.object.message}</Text>} 
                </VStack>}

                {props.object.foto == "" && (
                <>
                    {props.object.sendBy === 1 ? (
                    <HStack>
                        <NutritionistIcon />
                        <Text whiteSpace="pre-wrap" wordBreak="break-word">{": " + props.object.message}</Text>
                    </HStack>
                    ) : (
                    <Text whiteSpace="pre-wrap" wordBreak="break-word">{props.object.message}</Text>
                    )}
                </>
                )}
            </Flex>}

            {/* hora and check */}
            <Flex 
                position="absolute" 
                bottom="5px" 
                right="5px"
                justifyContent="flex-start" 
                alignItems="flex-end"
            >
                <HStack>
                {((props.object.sendBy == 0 && props.nutri == false) || (props.object.sendBy == 1 && props.nutri == true)) &&
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" 
                        viewBox="0 -960 960 960" width="18px" 
                        fill={props.object.vistoPorLaOtraPersona == 0 ? "#CFCFCF" : "#90E0EF"}>
                        <path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/>
                    </svg>
                }

                    <Text fontSize="12px" mr="10px" color="gray.500">
                        {props.object.hora}
                    </Text>
                </HStack>
            </Flex>
        </Flex>
        }></CustomCard>
        
    );
}