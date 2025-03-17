'use client';
// Chakra imports
import {
    Avatar,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Icon,
  IconButton,
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
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import SelectSignIn from '@/components/signin/SelectSignIn';
import PopUpMessage from '@/components/global/message/PopUpMessage';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, crearRecibo, dameDatosDelRecibo, formatDateToISOFriendly, getFecha, getInternetDateParts, getTamanyoPantalla, redirigirSiNoHayUserNom, StringIsNull } from '../../GlobalHelper';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { macroPorcentajes, reciboSkeleton, showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
import { fidelidadSkeleton } from '../../../../backend/src/dto/fidelidad.dto';
import { showEbook } from '../../../../backend/src/dto/ebook.dto';
import FiberCard from '@/components/global/cards/FiberCard';
import FidelidadCard from '@/components/fidelity/FidelidadCard';
import BarraMenu from '@/components/global/BarraMenu';
import { useRouter } from 'next/navigation';
import AvatarPart from '@/components/miPerfil/AvatarPart';
import UserPersonalData from '@/components/miPerfil/UserPersonalData';
import { createUserSkeleton } from '../../../../backend/src/dto/usuarios.dto';
import PencilIconOnTop from '@/components/icons/PencilIconOnTop';
import InputField from '@/components/global/random/InputField';
import { fichaSkeleton } from '../../../../backend/src/dto/fichas.dto';



export default function MyDay() 
{
    // EXTRA
    const [screenSize, setscreenSize ] = useState<string>("");

    // DATOS DE USUARIO NECESARIOS PARA EDITAR
    const [peso, setPeso] = useState<string>("");
    const [altura, setAltura] = useState<string>("");
    const [exerciseFrequency, setexerciseFrequency] = useState<string>("");
    const [objetivo, setObjetivo] = useState<string>("");
    const [genero, setgenero] = useState<string>("");
    const [edad, setedad] = useState<string>("");
    const [targetCalories, settargetCalories] = useState<string>("0");
    const [TMB, setTMB] = useState<string>("0");
    const userNom = useRef<string>("");

    // DATOS DE USUARIO NECESARIOS PARA VER
    const [user, setuser] = useState<createUserSkeleton | null>(null);

    // PARA PODER EDITAR
    const [editarDatos, seteditarDatos] = useState<boolean>(false);

    // 0: coge datos de usuario
    useEffect(() => 
    {
        redirigirSiNoHayUserNom();
        getTamanyoPantalla(setscreenSize)
        let nombre = sessionStorage.getItem("userNom")
        if(nombre)
            userNom.current = nombre;
        cogeFichaDeUser(nombre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cogeFichaDeUser = async (nombre:string) =>
    {
        if(!StringIsNull(nombre))
        {
            try{
            const response = await axios.get(
            `${API_URL}/fichas/datosFicha/${nombre}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
                if(response.data != null)
                {
                    let user: createUserSkeleton = response.data[0]
                    setAltura(user.altura)
                    setgenero(user.genero)
                    setObjetivo(user.objetivo)
                    setedad(user.edad)
                    setexerciseFrequency(response.data[0].actividad)
                    setPeso(user.peso)
                    settargetCalories(user.calorias_objetivo)
                    setuser(user)

                    const TMBtotal = user.genero === 'Woman'
                    ? (10 * Number(user.peso)) + (6.25 * Number(user.altura)) - (5 * Number(user.edad)) - 161
                    : (10 * Number(user.peso)) + (6.25 * Number(user.altura)) - (5 * Number(user.edad)) + 5;
                    setTMB(TMBtotal.toString())
                }
            }
            catch (error) {
            console.log('Error fetching data:', error);
            }
        }
    } ;

    const editaCalorias = (valor: string) =>
    {
        settargetCalories(valor.replace(/\D/g, ""));
    };

    // 1: guarda datos de usuario
    const salvaDatos = async () =>
    {
        const ficha: fichaSkeleton = {
            peso: peso,
            altura: altura,
            nivel_actividad: exerciseFrequency,
            calorias_objetivo: targetCalories,
            objetivo: objetivo,
            genero: genero,
            edad: edad
        };

        try{
        const response = await axios.put(
        `${API_URL}/fichas/updateFicha/${userNom.current}`,
        ficha,
        {
            headers: {
                'Content-Type': 'application/json'
            },
        }
        );
            if(response.data != null)
            {
                await cogeFichaDeUser(userNom.current)
            }
        }
        catch (error) {
        console.log('Error fetching data:', error);
        }
        
    } ;

  return (<>
    {
      user!= null && exerciseFrequency!="" &&<Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        p="30px"
        minH="100vh"
        position={"relative"}
    >

        <BarraMenu rellena={"perfil"}></BarraMenu>

        {/* title */}
        <Card
            width={{ base: "90%", md: "100%" }}
            height="auto"
            maxWidth="800px"
            p="10px"
            align="center"
            justify="center"
            borderRadius={"20px"}
            >
            <Text color={"black"} fontSize="2xl" fontWeight="700">
                MY PERFIL
            </Text>
        </Card>

        {/* foto + name */}
        <AvatarPart></AvatarPart>


        {/* datos personales vista */}
        <Box  w="100%"  display="flex" justifyContent="center">
            {/* editando */}
            {editarDatos== true && <CustomCard mt="10px" hijo={
            <>
                <Flex direction="column" w="100%">
                    <Stack direction="column" spacing="10px" mb="10px">
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
                            {/* los select */}
                            <SelectSignIn type={0} selectedValue={peso} setSelected = {setPeso} />
                            <SelectSignIn type={1} selectedValue={altura} setSelected = {setAltura}/>
                            <SelectSignIn type={2} selectedValue={objetivo} setSelected = {setObjetivo}/>
                            <SelectSignIn type={3} selectedValue={exerciseFrequency} setSelected = {setexerciseFrequency}/>
                            <SelectSignIn type={4} selectedValue={genero} setSelected = {setgenero}/>
                            <SelectSignIn type={5} selectedValue={edad} setSelected = {setedad}/>
                            <InputField
                                mb="20px"
                                onChange= {(e:any) => editaCalorias(e.target.value)}
                                id="first"
                                value={targetCalories +"  kcal"}
                                label="Target Calories"
                                textAlign={"center"}
                                />
                        </SimpleGrid>
                    </Stack>
                </Flex>
            </>
            }></CustomCard>}

            {/* viendo */}
            {editarDatos== false && <UserPersonalData user={user} editando={true} activityLevelIndex={parseInt(exerciseFrequency, 10)} objectiveIndex={Number(objetivo)}  
            caloriesWithObjective={targetCalories} screenSize={screenSize} TMB={TMB} />}

            <Box mt={editarDatos == false ? "440px" : "450px"}>  
                <PencilIconOnTop setEmpezarAEditar={seteditarDatos} editando={editarDatos} function={salvaDatos} />
            </Box>
        </Box>
       
        

        
       
        

    </Flex>}

    { !user && <PurpleSpinner></PurpleSpinner>} 
    </>);

}
