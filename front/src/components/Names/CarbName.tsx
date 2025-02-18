import React from 'react';
import { HStack, Text } from '@chakra-ui/react'; 
import { CarbIcono } from '../../../GlobalHelper';

export const CarbsName = (props:{fontSize:string}) => {
  return (
    <HStack>
      <CarbIcono />
      <Text mb="5px" fontWeight={"bold"}  fontSize={props.fontSize}>CARBS</Text>
    </HStack>
  );
};

