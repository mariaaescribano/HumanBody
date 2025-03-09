'use client';
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, Spinner } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import MeryTooltip from '../random/MeryToolTip';
import SuccessErrorMessage from '../message/SuccessErrorMessage';

export default function TitleCard(props: 
{ title:string, titleIcon?:any, 
    firstBtnText:string, firstBtnIcon?:any, letsgo:any,
    secondBtnText:string, secondBtnIcon?:any, goback:any,
    mensajeError?: boolean|undefined, textMensajeError?:string, statusMensajeError?:string,
    tooltip?:string, btnDisabled?:boolean}) 
{
   const textColor = useColorModeValue('secondaryGray.900', 'white');

    return (
    <>
        <HStack justify="start" gap="5px" align="start" mb="10px">   
            <Box mt="7px">
             {props.titleIcon && props.titleIcon}
            </Box>
            <Text color={textColor} fontSize="2xl" fontWeight="700">
            {props.title}
            </Text>
            {props.tooltip!= null && <MeryTooltip texto={props.tooltip} />}
        </HStack>

        <Box w="100%" borderBottom="2px solid black" my="20px" />

        <HStack 
        bottom="0" 
        align="center"
        justify="center" 
        spacing="40px"
        >
            <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                _hover={{ bg: "gray.100" }}
                onClick={props.goback}
                leftIcon={props.firstBtnIcon}
            >
                {props.firstBtnText}
            </Button>
            <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                disabled={props.btnDisabled}
                onClick={props.letsgo}
                _hover={{ bg: "gray.100" }}
                leftIcon={props.secondBtnIcon}
            >
                {props.secondBtnText}
                {props.btnDisabled==true && (
                 <Spinner
                    size="sm"
                    ml={4}
                    color="white"
                    />
                )}
            </Button>
        </HStack>
        
        {props.mensajeError!= undefined && props.statusMensajeError && props.textMensajeError && props.statusMensajeError != "" &&
        <SuccessErrorMessage status={props.statusMensajeError} title={props.textMensajeError}></SuccessErrorMessage>} 
    </>
  );
}
