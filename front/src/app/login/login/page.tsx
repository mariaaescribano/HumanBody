'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components

import React, { useEffect, useRef, useState } from 'react';
import { API_URL, colorNutricionist, StringIsNull, tryAgain } from '../../../GlobalHelper';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import InputField from '@/components/global/random/InputField';


export default function login() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white'); 
  const [nom, setnom] = useState<string>("");
  const [contra, setcontra] = useState<string>("");

  // si alguno esta mal
  // 1- no nombre, 2- no contra, 3- ambos
  const [datosMal, setdatosMal] = useState<number>(0);

  // gestionar errores del back
  const [hayError, sethayError] = useState<boolean>(false);
  const errorText = useRef<string>("");

  // pulsado boton y se esta haciendo llamada al back
  const [btnPulsado, setbtnPulsado] = useState<boolean>(false);



  useEffect(() => {
    const nomInput = document.getElementById("first") as HTMLInputElement;
    const contraInput = document.getElementById("last") as HTMLInputElement;

    if (nomInput) setnom(nomInput.value);
    if (contraInput) setcontra(contraInput.value);
  }, []);


  const existeUser = async () => 
  {
    setbtnPulsado(true);

    const isNomEmpty = StringIsNull(nom);
    const isContraEmpty = StringIsNull(contra);
  
    if (isNomEmpty && isContraEmpty) {
      setbtnPulsado(false);
      return setdatosMal(3);
    }
    if (isNomEmpty) {
      setbtnPulsado(false);
      return setdatosMal(1);
    }
    if (isContraEmpty) {
      setbtnPulsado(false);
      return setdatosMal(2);
    }
    
  
    try {
      const response = await axios.post(
        `${API_URL}/usuarios/login`,
        { nom, pass: contra },
        { headers: { "Content-Type": "application/json" } }
      );
  
      setbtnPulsado(false);
  
      if (response.data?.exists) {
        sessionStorage.clear();
        sessionStorage.setItem("userNom", nom);
        location.href = "../../myday"
      } else {
        errorText.current = "User doesn't exist";
        sethayError(true);
        setdatosMal(3);
      }
    } 
    catch (error: any) 
    {
      setbtnPulsado(false);
      sethayError(true);
  
      if (!error.response) {
        errorText.current = "Network error, please check your connection";
      } else if (error.response.status === 404) {
        setdatosMal(3);
        errorText.current = "Wrong password or user name";
      } else if (error.response.status === 500) {
        errorText.current = tryAgain;
      } else {
        setdatosMal(3);
        errorText.current = "User doesn't exist";
      }
    }
  };


  const writingName = (value:any) =>
  {
    if(datosMal == 1 || datosMal == 3)
    {
      sethayError(false)
      if(datosMal == 1)
        setdatosMal(0)
      else if(datosMal == 3)
        setdatosMal(2)
    }

    let nom = value;
    setnom(nom)
  };

  const writingContra = (value:any) =>
  {
    if(datosMal == 2 || datosMal == 3)
    {
      sethayError(false)
      if(datosMal == 2)
        setdatosMal(0)
      else if(datosMal == 3)
        setdatosMal(1)
    }

    let nom = value;
    setcontra(nom)
  };




  return (
    <Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        minH="100vh"
        position={"relative"}
    >
        {hayError == true && <PopUpErrorMessage cancel={hayError} setCancel={sethayError} title={'Error'} texto={errorText.current} ></PopUpErrorMessage>}
        
        
        <Card p="30px" width={{base:"80%", md: "100%"}} maxWidth={"500px"} mt="90px" align="center" justify="center" borderRadius={"20px"}>
            <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
            LOG IN
            </Text>
            <Flex direction="column" w="100%">
            <Stack direction="column" spacing="20px">
                <SimpleGrid columns={{ base: 1, md: 1 }} gap="20px">
                <InputField
                    mb="0px"
                    id="first"
                    value={nom}
                    bg={datosMal==1 || datosMal == 3 ? "red.200": ""}
                    placeholder="eg. Esthera"
                    label="User name"
                    onChange={(e:any) => writingName(e.target.value)}
                />
                <InputField
                    mb="0px"
                    id="last"
                    bg={datosMal==2 || datosMal == 3 ? "red.200": ""}
                    type="password"
                    placeholder="eg. ****"
                    label="Password"
                    value={contra}
                    onChange={(e:any) => writingContra(e.target.value)}
                />
                </SimpleGrid>
            </Stack>

            <VStack>
            <Flex justify="space-between" mt="24px">
                <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                disabled={btnPulsado}
                ms="auto"
                _hover={{bg:"gray.100"}}
                onClick={existeUser}
                >
                Next
                {btnPulsado==true && (
                  <Spinner
                    size="sm"
                    ml={4}
                    color="white"
                  />
                )}
                </Button>
            </Flex>


            <Link href="../login/signup/parte1" w="150px" ml="30px">
              <Text color="purple.200" as="span" cursor="pointer">
                Not registered yet?
              </Text>
            </Link>

            <Link href="../../nutritionist/login" w="150px" ml="50px">
              <Text color={colorNutricionist} as="span" cursor="pointer">
                I'm nutritionist
              </Text>
            </Link>
            </VStack>
            
            </Flex>
        </Card>
    </Flex>);

}
