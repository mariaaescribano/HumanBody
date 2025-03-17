'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
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

import React, { useEffect, useState, useRef } from 'react';
import SelectSignIn from '@/components/signin/SelectSignIn';
import { API_URL } from '../../../../GlobalHelper';
import { StringIsNull } from '../../../../GlobalHelper';
import PopUpMessage from '@/components/global/message/PopUpMessage';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import { createUserSkeleton } from '../../../../../../backend/src/dto/usuarios.dto';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import InputField from '@/components/global/random/InputField';
import CustomCard from '@/components/global/cards/CustomCard';
import TitleCard from '@/components/global/cards/TitleCard';
import { MdArrowBack } from 'react-icons/md';

// COSITAS GUAYS:
// - no deja q el navegador haga autocomplete
// - no cohe ninguna contra del navegador


export default function SignUp1() 
{
  // hace falta q sean useState para poder seleccionar en su campo select cada una
  // DATOS DE USUARIO
  const [peso, setPeso] = useState<string>("");
  const [altura, setAltura] = useState<string>("");
  const [exerciseFrequency, setexerciseFrequency] = useState<string>("");
  const [objetivo, setObjetivo] = useState<string>("");
  const [nom, setnom] = useState<string>("");
  const [contra, setcontra] = useState<string>("");
  const [genero, setgenero] = useState<string>("");
  const [edad, setedad] = useState<string>("");

  // despues de pulsar Next
  // comprobar q ha rellenado todos los datos
  const [filled, setfilled] = useState<boolean>(true);
  // para saber si falta nom o contra despues de pulsar Next
  const [faltanDatos, setfaltanDatos] = useState<{nom:boolean; contra:boolean;}>({nom:false, contra:false});  

  // nomExiste ya en BD
  const [nomExiste, setnomExiste] = useState<boolean>(false);

  // para saber si ya existia los datos de usuario (a lo mejor esta volviendo a atras desde signup2)
  // en ese caso, se vuelven a ponr todos los datos
  const [datosAntes, setDatosAntes] = useState<boolean | undefined>(undefined);
 
  // para saber si se le ha dado next, si es el caso esperar
  const [btnPulsado, setbtnPulsado] = useState<boolean>(false);


  // 0: se comprueba si hay datos de user en ss
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

  // 1: comprobar si todos los datos estan rellenos
  const comprobarSiPoderPaso2 = () => 
  {
    setbtnPulsado(true);
    const isNomNull = StringIsNull(nom);
    const isContraNull = StringIsNull(contra);
    const isPesoNull = StringIsNull(peso);
    const isAlturaNull = StringIsNull(altura);
    const isExerciseNull = StringIsNull(exerciseFrequency);
    const isObjetivoNull = StringIsNull(objetivo);
    const isGeneroNull = StringIsNull(genero);
    const isEdadNull = StringIsNull(edad);
  
    setfaltanDatos((prev) => ({
      nom: prev.nom || isNomNull,
      contra: prev.contra || isContraNull
    }));

    const puedeContinuar =
      !isPesoNull &&
      !isAlturaNull &&
      !isExerciseNull &&
      !isObjetivoNull &&
      !isGeneroNull &&
      !isEdadNull &&
      !isNomNull &&
      !isContraNull &&
      !nomExiste;

    if (puedeContinuar) {
      const limpiarComillas = (str: string) => str.replace(/^"|"$/g, "");

      const user = {
        nombre: limpiarComillas(nom),
        contra: limpiarComillas(contra),
        peso: limpiarComillas(peso),
        altura: limpiarComillas(altura),
        nivel_actividad: exerciseFrequency,
        calorias_objetivo: "",
        objetivo,
        recibo: NaN,
        genero: limpiarComillas(genero),
        edad: limpiarComillas(edad),
      };

      sessionStorage.clear();
      sessionStorage.setItem("user", JSON.stringify(user));
      location.href = "./parte2";
    } 
    else 
    {
      setfilled(false);
      setbtnPulsado(false);
    }
  };
  

  const writingName = (e:any) =>
  {
    if(faltanDatos.nom == true)
    {
      setfilled(true)
      setfaltanDatos(prev => ({
        nom: false,
        contra: prev.contra
      }));
    }

    let nom = e.target.value;
    setnom(nom)
    if(!StringIsNull(nom))
    {
      existeName(nom);
    }
    else
    {
      setnomExiste(false);
    }
  };

  const writingContra = (e:any) =>
  {
    if(faltanDatos.contra == true)
    {
      setfilled(true)
      setfaltanDatos(prev => ({
        nom: prev.nom,
        contra: false
      }));
    }

    let contra = e.target.value;
    setcontra(contra)
  };


  const existeName = async (nombre:string) =>
  {
    if(!StringIsNull(nombre))
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
        console.log('Error fetching data:', error);
      }
    }
  } ;

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

      {datosAntes !== undefined && 
      <>
        <CustomCard mb={"10px"} hijo={ 
          <TitleCard title={`CREATING AN ACCOUNT`} firstBtnIcon={<Icon as={MdArrowBack}/>} 
          secondBtnIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z"/></svg>}
          letsgo={comprobarSiPoderPaso2} goback={() => location.href = "../login"} tooltip={''} btnDisabled={btnPulsado} firstBtnText={"No, go back"} secondBtnText={"Yes, let's go!"}></TitleCard>} >
        </CustomCard>
        
        <Card p="30px" width={{base:"80%", md: "100%"}} mb={"100px"} maxWidth={"800px"} mt="20px" align="center" justify="center" borderRadius={"20px"}>
            <Flex direction="column" w="100%">
            <Stack direction="column" spacing="10px" mb="10px">
                <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
                <InputField
                    mb="0px"
                    autoComplete="off"
                    id="userNomInput"
                    name="randomNom123"
                    placeholder="eg. Esthera"
                    label="User name"
                    value={nom}
                    bg={(nomExiste || faltanDatos.nom) ? "red.200" : "white"}
                    onChange={(e: any) => writingName(e)}
                    toolTipText={nomExiste ? 'Name already exists.' : undefined}
                />

                <InputField
                    mb="0px"
                    id="userPassInput"
                    name="randomPass456"
                    autoComplete="new-password"
                    bg={(faltanDatos.contra) ? "red.200" : "white"}
                    type="password"
                    placeholder="eg. ****"
                    label="Password"
                    value={contra}
                    onChange={(e: any) => writingContra(e) }
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
           
            {/* <Text color="purple.300" as="a" mt="20px" cursor="pointer" href="../login">Do you have an account?</Text> */}
            </Flex>
        </Card>
      </>}

      {datosAntes == undefined && <PurpleSpinner></PurpleSpinner>}

    </Flex>);

}
