'use client';
import { CarbsName } from '@/components/Names/CarbName';
import { FatsName } from '@/components/Names/FatsName';
import { ProteinsName } from '@/components/Names/ProteinName';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input, SimpleGrid, FormLabel, useColorModeValue } from '@chakra-ui/react';
import { reciboConstNames, reciboSkeleton } from '../../../../../backend/src/dto/recibos.dto';
import { useEffect, useRef } from 'react';
import { esSoloNumeros } from '../../../GlobalHelper';
import InputField from '@/components/global/random/InputField';
import { CaloryIcon } from '@/components/icons/CaloryIcon';



export default function CalorGramsSelectCard(props: { calories:string, grams:string, setgrams:any }) 
{
   const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

    const cambiaGrams = async (grams:string) =>
    {
        let deja = esSoloNumeros(grams);
        if(deja == true || grams == "")
            props.setgrams(grams)
    };

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }}>
            <VStack >
                <InputField
                    mb="20px"
                    id="first"
                    value={props.grams}
                    label="Total grams:"
                    textAlign="center"
                    onChange={(e:any) => cambiaGrams(e.target.value)}
                />
                <Flex direction='column' mb={'10px'}>
                <FormLabel
                    display='flex'
                    ms='10px'
                    fontSize='sm'
                    color={textColorPrimary}
                    fontWeight='bold'
                
                    _hover={{ cursor: 'pointer' }}>
                        <HStack>
                            <CaloryIcon />
                            <Text fontSize="14px" whiteSpace="nowrap" flexShrink={0} w="100%">Total Calories:</Text>
                        </HStack>
                </FormLabel>
                <Input
                    border="1px solid gray"
                    borderRadius={"10px"}
                    fontWeight='500'
                    value={props.calories}
                    variant='main'
                    bg="gray.200"
                    cursor="default"
                    textAlign="center"
                    readOnly={true}
                    // value={"10px"}
                    _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                    h='44px'
                    maxH='44px'
                />
            </Flex> 
            </VStack>
        </SimpleGrid>

  );
}
