import React from 'react';
import { HStack, Text } from '@chakra-ui/react'; 
import { ProteIcono } from '../../GlobalHelper';

export const ProteinsName = (props:{fontSize:string}) => {
  return (
    <HStack>
      <ProteIcono />
      <Text mb="5px" fontWeight={"bold"}  fontSize={props.fontSize}>PROTEINS</Text>
    </HStack>
  );
};