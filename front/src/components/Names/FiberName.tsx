import React from 'react';
import { HStack, Text } from '@chakra-ui/react'; 
import { FiberIcono } from '../../GlobalHelper';

export const FiberName = (props:{fontSize:string}) => {
  return (
    <HStack>
      <FiberIcono />
      <Text mb="5px" fontWeight={"bold"}  fontSize={props.fontSize}>FIBER</Text>
    </HStack>
  );
};

