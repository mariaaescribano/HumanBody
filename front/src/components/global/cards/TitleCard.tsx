'use client';
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, Spinner } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import MeryTooltip from '../random/MeryToolTip';

export default function TitleCard(props: { title:string, letsgo:any, goback:any, tooltip:string, btnDisabled?:boolean}) {
   const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <>
        <HStack justify="start" gap="5px" align="start" mb="10px">
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
                leftIcon={<Icon as={MdArrowBack} />}
            >
                No, go back
            </Button>
            <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={'auto'}
                h="46px"
                disabled={props.btnDisabled}
                onClick={props.letsgo}
                _hover={{ bg: "gray.100" }}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z"/></svg>}
            >
                Yes, let's go!
                 {props.btnDisabled==true && (
                    <Spinner
                    thickness="4px"
                    ml={4}
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="white"
                    borderRadius="50%" 
                    size="sm"
                    />
                    )}
            </Button>
        </HStack>
    </>

  );
}
