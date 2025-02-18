import React from 'react';
import { HStack, Text } from '@chakra-ui/react'; 
import { FatIcono } from '../../../GlobalHelper';

export const FatsName = (props:{fontSize:string}) => {
  return (
    <HStack>
      <FatIcono />
      <Text mb="5px" fontWeight={"bold"}  fontSize={props.fontSize} >FATS</Text>
    </HStack>
  );
};
