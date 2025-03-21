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
import { API_URL, colorNutricionist, crearRecibo, dameDatosDelRecibo, formatDateToISOFriendly, getFecha, getInternetDateParts, getTamanyoPantalla } from '../../../../GlobalHelper';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import FiberCard from '@/components/global/cards/FiberCard';
import FidelidadCard from '@/components/fidelity/FidelidadCard';
import BarraMenu from '@/components/global/BarraMenu';
import { useRouter } from 'next/navigation';
import AvatarPart from '@/components/miPerfil/AvatarPart';
import UserPersonalData from '@/components/miPerfil/UserPersonalData';
import PencilIconOnTop from '@/components/icons/PencilIconOnTop';
import InputField from '@/components/global/random/InputField';
import MacroNutrCardEdit from '@/components/addfood/crearAlimento/MacroNutrCardEdit';
import TitleCard from '@/components/global/cards/TitleCard';
import NutritionistClientCard from '@/components/nutritionistPatient/NutritionistClientCard';
import { reciboSkeleton, showMacroNutrSignUp } from '../../../../../../backend/src/dto/recibos.dto';
import BarraMenuNutri from '@/components/nutritionist/BarraMenuNutri';
import { fichaSkeleton } from '../../../../../../backend/src/dto/fichas.dto';
import { createUserSkeleton } from '../../../../../../backend/src/dto/usuarios.dto';
import GreenSpinner from '@/components/global/random/GreenSpinner';



export default function MyDay() 
{
    const [screenSize, setscreenSize ] = useState<string>("");
    // datos patient
    const patientNomSeleccionado = useRef<string>("");
    const TMB = useRef<string>("");
    const [user, setuser] = useState<createUserSkeleton | null>(null);
    const [patientRecibo, setpatientRecibo] = useState<reciboSkeleton>();
    //////////////////////////////////////////////////////////////////////
    
    // 0: coge datos de usuario seleccionado
    useEffect(() => 
    {
        getTamanyoPantalla(setscreenSize)
        let patient = sessionStorage.getItem("patientTratando");
        if(patient)
        {
            patientNomSeleccionado.current = patient;
            cogeDatosUserSeleccionado(patient)
        }
        else
        {
            location.href = "./main"
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cogeDatosUserSeleccionado = async (patientNom:string) =>
    {
        // tenemos q coger la ficha y el recibo (macros) del paciente y poder ponerle comentarios
        //ficha
        try{
            const response = await axios.get(
            `${API_URL}/fichas/datosFicha/${patientNom}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data[0] != null)
            {
                setuser(response.data[0])
                const TMBtotal = response.data[0].genero === 'Woman'
                ? (10 * Number(response.data[0].peso)) + (6.25 * Number(response.data[0].altura)) - (5 * Number(response.data[0].edad)) - 161
                : (10 * Number(response.data[0].peso)) + (6.25 * Number(response.data[0].altura)) - (5 * Number(response.data[0].edad)) + 5;
                TMB.current = (TMBtotal.toString())
                dameDatosDelRecibo(response.data[0].recibo_id, setpatientRecibo)
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };

  return (<>
    {patientRecibo && user &&
    <Flex
        direction="column"
        align="center"
        bg={colorNutricionist}
        w="100%"
        h="100%"
        justify="center"
        p="30px"
        minH="100vh"
        position={"relative"}
    >

        <BarraMenuNutri></BarraMenuNutri>

        <CustomCard mt="0px" p="20px" hijo={ 
            <>
                <Text fontSize="md" textAlign="center">My patient:</Text>
                <Text fontSize="3xl" fontWeight="bold" textAlign="center">{patientNomSeleccionado.current}</Text>
            </>
        }></CustomCard>


        {/* datos personales vista */}
        <UserPersonalData nombrePatient={patientNomSeleccionado.current} user={user} editando={true} activityLevelIndex={parseInt(user?.actividad, 10)} objectiveIndex={Number(user?.objetivo)}  
            caloriesWithObjective={user?.calorias_objetivo} screenSize={screenSize} TMB={TMB.current} soyNutricionista={true} />


        {/* MACRONUTRIENTS */}
        {/* <Box w="100%" display="flex" justifyContent="center">
            {screenSize != "" && <CustomCard mt="10px" hijo={ 
            <MacroNutrCardEdit recibo={reciboObjetivo} setrecibo={setreciboObjetivo} 
            totalMacro={reciboConstNames.prote} 
            screenSize={screenSize} miPerfil={editarProtes == true ? 0 : 1} // si es 0: editando, 1:viendo
            infoLista={[reciboConstNames.completo, reciboConstNames.incompleto]}>
            </MacroNutrCardEdit>}></CustomCard>}
            <Box mt={"0px"}>  
                <PencilIconOnTop subiendo={subiendoProtes} setEmpezarAEditar={seteditarProtes} 
                editando={editarProtes} function={updateProteins} />
            </Box>
        </Box>

        <Box w="100%" display="flex" justifyContent="center">
            {screenSize != "" && <CustomCard mt="10px" hijo={ 
            <MacroNutrCardEdit recibo={reciboObjetivo} setrecibo={setreciboObjetivo} 
            totalMacro={reciboConstNames.grasas} 
            screenSize={screenSize} miPerfil={editarFats == true ? 0 : 1} // si es 0: editando, 1:viendo
            infoLista={[reciboConstNames.monoinsaturadas,reciboConstNames.poliinsaturadas, reciboConstNames.saturadas]}>
            </MacroNutrCardEdit>}></CustomCard>}
            <Box mt={"0px"}>  
                <PencilIconOnTop subiendo={subiendoFats} setEmpezarAEditar={seteditarFats} 
                editando={editarFats} function={updateFats} />
            </Box>
        </Box>

        <Box w="100%" display="flex" justifyContent="center">
            {screenSize != "" && <CustomCard mt="10px" hijo={ 
            <MacroNutrCardEdit recibo={reciboObjetivo} setrecibo={setreciboObjetivo} 
            totalMacro={reciboConstNames.carbs} 
            screenSize={screenSize} miPerfil={editarCarbs == true ? 0 : 1} // si es 0: editando, 1:viendo
            infoLista={[reciboConstNames.complejos, reciboConstNames.simples]}>
            </MacroNutrCardEdit>}></CustomCard>}
            <Box mt={"0px"}>  
                <PencilIconOnTop subiendo={subiendoCarbs} setEmpezarAEditar={seteditarCarbs} 
                editando={editarCarbs} function={updateCarbs} />
            </Box>
        </Box>

        <Box w="100%" display="flex" justifyContent="center">
            {screenSize != "" && <CustomCard mt="10px" hijo={ 
              <FiberCard edit={true} recibo={reciboObjetivo} miPerfil={editarFiber == true ? 0 : 1} // si es 0: editando, 1:viendo
              setrecibo={setreciboObjetivo} totalFiber={reciboObjetivo.fibra} screenSize={screenSize}></FiberCard>}></CustomCard>}
            <Box mt={"0px"}>  
                <PencilIconOnTop subiendo={subiendoFiber} setEmpezarAEditar={seteditarFiber} 
                editando={editarFiber} function={updateFiber} />
            </Box>
        </Box>


 */}






    </Flex>}

    { !patientRecibo && !user  && <GreenSpinner></GreenSpinner>} 
    </>);

}
