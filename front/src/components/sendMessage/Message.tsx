'use client';
import { Box, Flex, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { API_URL, colorNutricionist, colorNutricionistBg} from '@/GlobalHelper';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CustomCard from '../global/cards/CustomCard';
import { messageSkeleton } from '../../../../backend/src/dto/message.dto';
import { NutritionistIcon } from '../icons/NutritionistIcon';

export default function Message(props: {object: messageSkeleton, ref:any})
{

    return (
        <CustomCard mt="0px" p="20px" bgColor={ props.object.sendBy == 0? "white" : colorNutricionistBg }
        hijo={
        <Flex direction="column" ref={ props.ref } >
            <Flex mb="5px">
                
                {/* messag ehas pic */}
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

            </Flex>
            <Flex 
                position="absolute" 
                bottom="5px" 
                right="5px"
                justifyContent="flex-start" 
                alignItems="flex-end"
            >
                <HStack>
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill={props.object.vistoPorLaOtraPersona== 0?"#CFCFCF": "#90E0EF"}><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>
                    <Text fontSize="12px" mr="10px" color="gray.500">
                        12:30 PM
                    </Text>
                </HStack>
            </Flex>
        </Flex>
        }></CustomCard>
        
    );
}