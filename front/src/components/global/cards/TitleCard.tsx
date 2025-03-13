'use client';
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, Spinner } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import MeryTooltip from '../random/MeryToolTip';
import SuccessErrorMessage from '../message/SuccessErrorMessage';

export default function TitleCard(props: 
{   title:string, titleIcon?:any, //what you see in the main title
    firstBtnText:string, firstBtnIcon?:any, goback:any, //the left button, for going back or cancel
    secondBtnText:string, secondBtnIcon?:any, letsgo:any, // the right button, to continue or save
    mensajeError?: boolean|undefined, // if mensajeError needs to be shown
    textMensajeError?:string, statusMensajeError?:string, // what the message will shown and the status is always success
    tooltip?:string, // to put the merytool tip near the title
    btnDisabled?:boolean, //to let the second button disabled while waiting for back's response
    btnDesactivado?:boolean // to not be able to push the button until x is finished
    }) 
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
                disabled={props.btnDisabled || props.btnDesactivado}
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
        <Box mb="-20px">
            <SuccessErrorMessage status={props.statusMensajeError} title={props.textMensajeError}>
            </SuccessErrorMessage>
        </Box>} 
    </>
  );
}
