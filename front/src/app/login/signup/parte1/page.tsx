'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  Select,
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
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import InputField from '../../../../components/global/InputField';
import React, { useEffect, useState, useRef } from 'react';
import SelectSignIn from '@/components/signin/SelectSignIn';
import { API_URL } from '../../../../../GlobalHelper';
import { StringIsNull } from '../../../../../GlobalHelper';
import PopUpMessage from '@/components/global/PopUpMessage';
import PopUpErrorMessage from '@/components/global/PopUpErrorMessage';
import { createUserSkeleton } from '../../../../../../backend/src/dto/usuarios.dto';
import PurpleSpinner from '@/components/global/Spinner';

export default function SignUp1() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [peso, setPeso] = useState<string>("");
  const [altura, setAltura] = useState<string>("");
  const [exerciseFrequency, setexerciseFrequency] = useState<string>("");
  const [objetivo, setObjetivo] = useState<string>("");
  const [nom, setnom] = useState<string>("");
  const [contra, setcontra] = useState<string>("");
  const [genero, setgenero] = useState<string>("");
  const [edad, setedad] = useState<string>("");

  const [filled, setfilled] = useState<boolean>(true);
  const [nomExiste, setnomExiste] = useState<boolean>(false);
  const [datosAntes, setDatosAntes] = useState<boolean | undefined>(undefined);

  useEffect(() => 
  {
    const userStr = sessionStorage.getItem("user");
    if (userStr) 
    {
      const user = JSON.parse(userStr); 
      if(user)
      {
        setPeso(user.peso)
        setAltura(user.altura)
        setexerciseFrequency(user.exerciseFrequency)
        setObjetivo(user.objetivo)
        setnom(user.nombre)
        setcontra(user.contra)
        setedad(user.edad)

        setDatosAntes(true);
      }
      else
      {
        setDatosAntes(false);
      }
    }
    else
    {
      setDatosAntes(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const comprobarSiPoderPaso2 = () =>
  {
    if(!StringIsNull(peso)
    && !StringIsNull(altura)
    && !StringIsNull(exerciseFrequency)
    && !StringIsNull(objetivo)
    && !StringIsNull(nom)
    && !StringIsNull(contra)
    && !StringIsNull(genero) && nomExiste== false)
    {
        // quitar comillas
        let pesoSinComillas = peso.replace(/^"|"$/g, '');
        let alturaSinComillas = altura.replace(/^"|"$/g, '');
        let edadSinComillas = edad.replace(/^"|"$/g, '');
        let generoSinComillas = genero.replace(/^"|"$/g, '');
        let nombreSinComillas = nom.replace(/^"|"$/g, '');
        let contraSinComillas = contra.replace(/^"|"$/g, '');

       const user:createUserSkeleton = {
        nombre:nombreSinComillas,
        contra:contraSinComillas,
        peso:pesoSinComillas,
        altura:alturaSinComillas,
        nivel_actividad:exerciseFrequency,
        calorias_objetivo:"",
        objetivo:objetivo,
        recibo: NaN,
        genero: generoSinComillas,
        edad:edadSinComillas
      };

      sessionStorage.clear();
      sessionStorage.setItem("user", JSON.stringify(user));

      location.href = "./parte2";

    }
    else
    {
      setfilled(false);
    }
  };

  const writingName = (e:any) =>
  {
    let nom =e.target.value;
    setnom(nom)
    if(nom!= "")
      existeName(nom);
  };

  const existeName = async (nombre:string) =>
  {
    try{
    const response = await axios.get(
      `${API_URL}/usuarios/userExist/${nombre}`,
      {
        headers: {
            'Content-Type': 'application/json'
        },
      }
    );
      if(response.data != null)
      {
        setnomExiste(response.data.exists);
      }
    }
    catch (error) {
    console.error('Error fetching data:', error);
    }
  } 

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
      {filled == false && <PopUpErrorMessage cancel={filled} setCancel={setfilled} title={'Error'} texto={'Please, fill up all the data.'} ></PopUpErrorMessage>}

      {datosAntes !== undefined && <Card p="30px" width={{base:"80%", md: "100%"}} mb={{sd:"20px", md: "200px"}} maxWidth={"800px"} mt="20px" align="center" justify="center" borderRadius={"20px"}>
          <Text color={textColor} fontSize="2xl" fontWeight="700" mb="60px">
              CREATING AN ACCOUNT
          </Text>
          <Flex direction="column" w="100%">
          <Stack direction="column" spacing="20px">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
                  <InputField
                    mb="0px"
                    id="first"
                    placeholder="eg. Esthera"
                    label="User name"
                    value={nom}
                    bg={nomExiste ? "red.200" : "white"}
                    onChange={(e: any) => writingName(e)} toolTipText={'Name already exists.'}/>

                  <InputField
                      mb="0px"
                      id="last"
                      type="password"
                      placeholder="eg. ****"
                      label="Password"
                      value={contra}
                      onChange={(e:any) => setcontra(e.target.value)}
                  />
                  {/* los select */}
                  <SelectSignIn type={0} selectedValue={peso} setSelected = {setPeso} />
                  <SelectSignIn type={1} selectedValue={altura} setSelected = {setAltura}/>
                  <SelectSignIn type={2} selectedValue={objetivo} setSelected = {setObjetivo}/>
                  <SelectSignIn type={3} selectedValue={exerciseFrequency} setSelected = {setexerciseFrequency}/>
                  <SelectSignIn type={4} selectedValue={genero} setSelected = {setgenero}/>
                  <SelectSignIn type={5} selectedValue={edad} setSelected = {setedad}/>
              </SimpleGrid>
          </Stack>
          <Flex justify="space-between" mt="24px">
              <Button
              variant="darkBrand"
              fontSize="sm"
              borderRadius="16px"
              bg="purple.100"
              w={{ base: '128px', md: '148px' }}
              h="46px"
              ms="auto"
              _hover={{bg:"gray.100"}}
              onClick={comprobarSiPoderPaso2}
              >
              Next
              </Button>
          </Flex>
          <Text color="purple.100" as="a" cursor="pointer" href="../login">Do you have an account?</Text>
          </Flex>
      </Card>}

      {datosAntes == undefined && <PurpleSpinner></PurpleSpinner>}

    </Flex>);

}
