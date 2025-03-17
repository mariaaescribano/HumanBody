'use client';
// Chakra imports
import { Box, Avatar, Text } from '@chakra-ui/react';
import CustomCard from '../global/cards/CustomCard';
import PencilIconOnTop from '../icons/PencilIconOnTop';

export default function AvatarPart(props: { }) {

  return (
    <Box position="relative" w="100%" display="flex" justifyContent="center">
        <CustomCard mt="20px" hijo={ 
          <>
           <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar src="./aceite.png" size="xl"/>
              <Text mt="10px" textAlign="center" fontWeight={"bolds"}>Nombre</Text>
          </Box>

          </>}>
        </CustomCard>

        {/* Box positioned bottom-right */}
        <PencilIconOnTop setEmpezarAEditar={undefined} editando={false} function={undefined}></PencilIconOnTop>
    </Box>
  );
}
