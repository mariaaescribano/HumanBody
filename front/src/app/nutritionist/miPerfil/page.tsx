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
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, cogeFichaDeUserNom, dameDatosDelRecibo, formatDateToISOFriendly, getDatosNutri, getFecha, getInternetDateParts, getTamanyoPantalla, redirigirSiNoHayNutriNom, redirigirSiNoHayUserNom, StringIsNull } from '../../../GlobalHelper';
import {  reciboConstNames, reciboSkeleton, showMacroNutrSignUp } from '../../../../../backend/src/dto/recibos.dto';
import FiberCard from '@/components/global/cards/FiberCard';
import BarraMenu from '@/components/global/BarraMenu';
import { useRouter } from 'next/navigation';
import AvatarPart from '@/components/miPerfil/AvatarPart';
import UserPersonalData from '@/components/miPerfil/UserPersonalData';
import PencilIconOnTop from '@/components/icons/PencilIconOnTop';
import InputField from '@/components/global/random/InputField';
import * as fs from 'fs';
import * as path from 'path';
import MacroNutrCardEdit from '@/components/addfood/crearAlimento/MacroNutrCardEdit';
import TitleCard from '@/components/global/cards/TitleCard';
import NutritionistClientCard from '@/components/nutritionistPatient/NutritionistClientCard';
import { colorNutricionist } from '@/GlobalHelper';
import BarraMenuNutri from '@/components/nutritionist/BarraMenuNutri';
import { nutriPerfil } from '../../../../../backend/src/dto/nutri.dto';
import GreenSpinner from '@/components/global/random/GreenSpinner';



export default function NutritionistMiPerfil() 
{
    const [nutriData, setnutriData] = useState<nutriPerfil>();
    const [loaded, setloaded] = useState<boolean>(false);

    // PARA DECIRLE AL USU Q HA PASADO
    //0 es nada, 1 is uploading, 2 is perfect 3 is error
    const [subiendoDatos, setsubiendoDatos] = useState<number>(0); 
    const [subiendoAvatarNombre, setsubiendoAvatarNombre] = useState<number>(0);

    const [updateDescrip, setupdateDescrip] = useState<boolean>(false);  // am i editing descrip??

    // EDITANDO
    const [editarAvatarNombre, seteditarAvatarNombre] = useState<boolean>(false);
    const [newUserNom, setnewUserNom] = useState<string>("");
    const [perfilPic, setperfilPic] = useState<File>(); // para guardar aqui el file y subirlo a bd
    const perfilPicVer = useRef<string>("");
    
    /////////////////////////////////////////////////////////////////////

    // coger datos de usuario
    useEffect(() => 
    {
        redirigirSiNoHayNutriNom()
        cogeDatosNutri()
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cogeDatosNutri = async () =>
    {
        let datosNutri = await getDatosNutri(sessionStorage.getItem("nutriNom"))
        setnutriData(datosNutri)
        setnewUserNom(datosNutri.nom)
        cogeFotoPerfil(datosNutri.perfilPic)
    };


    // para coger la foto de perfil de usuario
    const cogeFotoPerfil = async (nombreCarpeta:string) =>
    {
        try{
            const response = await axios.get(
            `${API_URL}/usuarios/recuperarFoto/${nombreCarpeta}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data != null)
            {
                const base64String = response.data.imageBase64; // Aquí obtienes la imagen en base64
                perfilPicVer.current = (`data:image/jpeg;base64,${base64String}`);
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
        finally {
            setloaded(true)
        }
    };


    // update nombre
    const updateNom = async () =>
    {
        if(newUserNom && nutriData)
        {
            setsubiendoAvatarNombre(1)
            try
            {
                const response = await axios.put(
                `${API_URL}/nutritionist/editNombre/${newUserNom}/${nutriData?.nom}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
                );
                if(response.data != null)
                {
                    sessionStorage.setItem("nutriNom", newUserNom)
                    setsubiendoAvatarNombre(2)
                    const timer = setTimeout(() => 
                    {
                        setsubiendoAvatarNombre(0)
                    }, 2000);
                    return () => clearTimeout(timer);
                }
            }
            catch (error) {
                console.log('Error fetching data:', error);
                setsubiendoAvatarNombre(3)
                const timer = setTimeout(() => 
                {
                    setsubiendoAvatarNombre(0)
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
    };

    // update photo
    const salvaAvatar = async () =>
    {
        if(perfilPic)
        {
            try {
                const formData = new FormData();
                formData.append("perfilPic", perfilPic); 
            
                const response = await axios.put(
                    `${API_URL}/nutritionist/editAvatar/${nutriData?.nom}`,
                    formData, 
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                    }
                );
                if(response.data != null)
                {

                }
            }
            catch (error) {
                console.log('Error fetching data:', error);
            }
        } 
    } ;

    useEffect(() => 
    {
        salvaAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perfilPic]);

    const editEmailDescrip = async () =>
    {
        try
        {
            setsubiendoDatos(1)
            const response = await axios.put(
            `${API_URL}/nutritionist/editEmailDescrip/${sessionStorage.getItem("nutriNom")}`,
            { descrip: nutriData?.description, email:nutriData?.email },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data != null)
            {
                setsubiendoDatos(2)
                const timer = setTimeout(() => 
                {
                    setsubiendoDatos(0)
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
            setsubiendoDatos(3)
            const timer = setTimeout(() => 
            {
                setsubiendoDatos(0)
            }, 2000);
            return () => clearTimeout(timer);
        }
    };

    const handleInputChange = (value:string, camp:string) => {
        setnutriData((prevData: any) => ({
            ...prevData,
            [camp]: value
        }));
    };





    return (
    <>
       {nutriData && 
       <Flex
            direction="column"
            align="center"
            bg={colorNutricionist}
            w="100%"
            h="100%"
            justify="center"
            minH="100vh"
            position={"relative"}
        >
        <BarraMenuNutri rellena={"perfil"} />

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
                MY PROFILE
            </Text>
        </Card>

        {/* foto + name */}
        <AvatarPart subiendo={subiendoAvatarNombre} setEmpezarAEditar={seteditarAvatarNombre} 
        editando={editarAvatarNombre} nom={newUserNom ?? nutriData?.nom} setnewUserNom={setnewUserNom}
        perfilPic={perfilPicVer.current} setperfilPic={setperfilPic} function={updateNom} >
        </AvatarPart>

        <Box w="100%" display="flex" justifyContent="center">
            <CustomCard mt="10px" p="30px" hijo={<>
                {updateDescrip == true && 
                <Flex direction='column' w="80%">
                    <InputField
                    mb="20px"
                    id="second"
                    defaultValue={nutriData.email}
                    onChange={(e:any)=> handleInputChange(e.target.value, "email")}
                    label="Email"
                    textAlign={"center"}
                    />
                    <InputField
                    mb="20px"
                    id="first"
                    defaultValue={nutriData.description}
                    onChange={(e:any)=> handleInputChange(e.target.value, "description")}
                    placeholder="I want to help people feel connected with themselves"
                    label="Description"
                    textAlign={"center"}
                    />
                </Flex>}
                
                {updateDescrip == false && 
                <Flex direction="column" w="80%" align="center" textAlign="center">
                    <Text>
                        <b>Email:</b> {nutriData.email}
                    </Text>
                    <Text>
                        <b>Description:</b> {nutriData.description}
                    </Text>
                </Flex>
                }
                </>
            }></CustomCard>
            <Box mt={"0px"}>  
                <PencilIconOnTop subiendo={subiendoDatos} setEmpezarAEditar={setupdateDescrip} 
                editando={updateDescrip} function={editEmailDescrip} />
            </Box>
        </Box> 

    </Flex>}

    { !nutriData && <GreenSpinner></GreenSpinner>} 
    
    </>);
}
