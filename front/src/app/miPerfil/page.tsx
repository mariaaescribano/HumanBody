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
import { API_URL, dameDatosDelRecibo, formatDateToISOFriendly, getFecha, getInternetDateParts, getTamanyoPantalla, redirigirSiNoHayUserNom, StringIsNull } from '../../GlobalHelper';
import {  reciboConstNames, reciboSkeleton, showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
import { showEbook } from '../../../../backend/src/dto/ebook.dto';
import FiberCard from '@/components/global/cards/FiberCard';
import BarraMenu from '@/components/global/BarraMenu';
import { useRouter } from 'next/navigation';
import AvatarPart from '@/components/miPerfil/AvatarPart';
import UserPersonalData from '@/components/miPerfil/UserPersonalData';
import { createUserSkeleton } from '../../../../backend/src/dto/usuarios.dto';
import PencilIconOnTop from '@/components/icons/PencilIconOnTop';
import InputField from '@/components/global/random/InputField';
import { fichaSkeleton } from '../../../../backend/src/dto/fichas.dto';
import * as fs from 'fs';
import * as path from 'path';
import MacroNutrCardEdit from '@/components/addfood/crearAlimento/MacroNutrCardEdit';
import TitleCard from '@/components/global/cards/TitleCard';
import NutritionistClientCard from '@/components/nutritionistPatient/NutritionistClientCard';



export default function MyDay() 
{
    // EXTRA
    const [screenSize, setscreenSize ] = useState<string>("");
    const [loaded, setloaded] = useState<boolean>(false);

    // DATOS DE USUARIO NECESARIOS PARA EDITAR
    const [peso, setPeso] = useState<string>("");
    const [altura, setAltura] = useState<string>("");
    const [exerciseFrequency, setexerciseFrequency] = useState<string>("");
    const [objetivo, setObjetivo] = useState<string>("");
    const [genero, setgenero] = useState<string>("");
    const [edad, setedad] = useState<string>("");
    const [targetCalories, settargetCalories] = useState<string>("0");
    const [TMB, setTMB] = useState<string>("0");
    const reciboId = useRef<number>(-1);

    // TO EDIT AVATAR NAME
    const userNom = useRef<string>("");
    const editadoTargetCalories = useRef<boolean>(false);
    const [newUserNom, setnewUserNom] = useState<string>("");
    const [perfilPic, setperfilPic] = useState<File>(); // para guardar aqui el file y subirlo a bd
    const perfilPicVer = useRef<string>("");

    const [reciboObjetivo, setreciboObjetivo] = useState<reciboSkeleton | null>(null);

    // DATOS DE USUARIO NECESARIOS PARA VER
    const [user, setuser] = useState<createUserSkeleton | null>(null);

    // PARA PODER EDITAR
    const [editarDatos, seteditarDatos] = useState<boolean>(false);
    const [editarAvatarNombre, seteditarAvatarNombre] = useState<boolean>(false);
    // MACROS
    const [editarProtes, seteditarProtes] = useState<boolean>(false);
    const [editarFats, seteditarFats] = useState<boolean>(false);
    const [editarCarbs, seteditarCarbs] = useState<boolean>(false);
    const [editarFiber, seteditarFiber] = useState<boolean>(false);

    // PARA DECIRLE AL USU Q HA PASADO
    //0 es nada, 1 is uploading, 2 is perfect 3 is error
    const [subiendoDatos, setsubiendoDatos] = useState<number>(0); 
    const [subiendoAvatarNombre, setsubiendoAvatarNombre] = useState<number>(0);
    // MACROS
    const [subiendoProtes, setsubiendoProtes] = useState<number>(0); 
    const [subiendoFats, setsubiendoFats] = useState<number>(0); 
    const [subiendoCarbs, setsubiendoCarbs] = useState<number>(0); 
    const [subiendoFiber, setsubiendoFiber] = useState<number>(0); 
    //////////////////////////////////////////////////////////////////////


    
    // 0: coge datos de usuario
    useEffect(() => 
    {
        redirigirSiNoHayUserNom();
        getTamanyoPantalla(setscreenSize)
        let nombre = sessionStorage.getItem("userNom")
        if(nombre)
        {
            userNom.current = nombre;
            setnewUserNom(nombre);
            cogeFichaDeUser()
                }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // IMP
    const cogeFichaDeUser = async () =>
    {
        if(!StringIsNull(userNom.current))
        {
            try{
            const response = await axios.get(
            `${API_URL}/fichas/datosFicha/${userNom.current}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
                if(response.data[0] != null)
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
                    reciboId.current = response.data[0].recibo_id;

                    if(response.data[0].perfilPic!= null)
                        cogeFotoPerfil(response.data[0].perfilPic)
                    else
                        setloaded(true)

                    const TMBtotal = user.genero === 'Woman'
                    ? (10 * Number(user.peso)) + (6.25 * Number(user.altura)) - (5 * Number(user.edad)) - 161
                    : (10 * Number(user.peso)) + (6.25 * Number(user.altura)) - (5 * Number(user.edad)) + 5;
                    setTMB(TMBtotal.toString())

                    // only we take the receipt when is the firt time
                    if(reciboObjetivo == null)
                        dameDatosDelRecibo(response.data[0].recibo_id, setreciboObjetivo)   
                }
            }
            catch (error) {
                console.log('Error fetching data:', error);
            }
        }
    } ;

    const cantidadExercise = (activityLevelIndex: number) => [1.2, 1.375, 1.55, 1.725, 1.9][activityLevelIndex] || 1.2;

    const editaCalorias = (valor: string) =>
    {
        editadoTargetCalories.current = true;
        settargetCalories(valor.replace(/\D/g, ""));
    };


    // 1: guarda datos de usuario (actualiza ficha)
    const salvaDatos = async () =>
    {
        // ESTRATEGIA: si no ha editado explícitamente sus calorías objetivo
        // se le ajustan dependiendo de sus otros valores

        setsubiendoDatos(1)

        let targetCaloriesFuncion = targetCalories;
        if(editadoTargetCalories.current == false)
        {
            let dameCantidadExercise = cantidadExercise(Number(exerciseFrequency)); 
            let multiplicaCalLifeStyle =  Math.round(dameCantidadExercise * Number(TMB));  
            let cals =  (objetivo === "0")
            ? (multiplicaCalLifeStyle - 400).toString()
            : (objetivo === "1")
            ? (multiplicaCalLifeStyle + 300).toString()
            : multiplicaCalLifeStyle.toString();
            targetCaloriesFuncion = cals
        }
     
        const ficha: fichaSkeleton = {
            peso: peso,
            altura: altura,
            nivel_actividad: exerciseFrequency,
            calorias_objetivo: targetCaloriesFuncion,
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
                cogeFichaDeUser()
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
    } ;


    // 2: se suben a BD
    const salvaAvatarNombre = async () =>
    {
        if(perfilPic)
        {
            setsubiendoAvatarNombre(1)
            
            try {
                const formData = new FormData();
                formData.append("newuserNom", newUserNom); 
                formData.append("perfilPic", perfilPic); 
            
                const response = await axios.put(
                    `${API_URL}/usuarios/editAvatarNombre/${userNom.current}`,
                    formData, 
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                    }
                );
                if(response.data != null)
                {
                    sessionStorage.removeItem("userNom")
                    sessionStorage.setItem("userNom", newUserNom)
                    setsubiendoAvatarNombre(2)
                    const timer = setTimeout(() => 
                    {
                        setsubiendoAvatarNombre(0)
                    }, 2000);
                    return () => clearTimeout(timer);
                }
            }
            catch (error) {
                setsubiendoAvatarNombre(3)
                console.log('Error fetching data:', error);
                const timer = setTimeout(() => 
                {
                    setsubiendoAvatarNombre(0)
                }, 2000);
                return () => clearTimeout(timer);
            }
        } 
        else
            setsubiendoAvatarNombre(0)
    } ;



    // UPDATE MACROS
    const updateNutrient = async (nutrientType:string, data:any, setState:any) => {
        setState(1); // Indicating upload in progress
    
        try {
            const response = await axios.put(
                `${API_URL}/recibos/update/${reciboId.current}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.data) {
                setState(2); // Success
                setTimeout(() => setState(0), 2000);
            }
        } catch (error) {
            setState(3); // Error
            console.error(`Error updating ${nutrientType}:`, error);
            setTimeout(() => setState(0), 2000);
        }
    };
    
    // Usage examples:
    const updateProteins = () =>
        updateNutrient("proteins", {
            prote: reciboObjetivo?.prote,
            completo: reciboObjetivo?.completo,
            incompleto: reciboObjetivo?.incompleto,
        }, setsubiendoProtes);
    
    const updateFats = () =>
        updateNutrient("fats", {
            grasas: reciboObjetivo?.prote,
            monoinsaturadas: reciboObjetivo?.monoinsaturadas,
            poliinsaturadas: reciboObjetivo?.poliinsaturadas,
            saturadas: reciboObjetivo?.saturadas,
        }, setsubiendoFats);
    
    const updateCarbs = () =>
        updateNutrient("carbs", {
            carbs: reciboObjetivo?.carbs,
            complejos: reciboObjetivo?.complejos,
            simples: reciboObjetivo?.simples,
        }, setsubiendoCarbs);

    const updateFiber = () =>
        updateNutrient("fibra", {
            fibra: reciboObjetivo?.fibra
        }, setsubiendoFiber);
    


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
                setloaded(true)
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };


    // #region ebooks
    // listas usadas para mostrar datos
    
        const proteinEbooks: showEbook[] = [
        {
            title: "What are amino acids?",
            onclick: undefined
        },
        {
            title: "How proteins repair my cells?",
            onclick: undefined
        }
        ];
    
        let proteinButtons: showMacroNutrSignUp[] = [];
    
        if (reciboObjetivo != null) 
        {
            proteinButtons = [
                { 
                label: "Complete proteins", 
                price: `${reciboObjetivo.completo} grams`, 
                tooltip: "Contain all essential amino acids your body needs for regeneration." 
                },
                { 
                label: "Incomplete proteins", 
                price: `${reciboObjetivo.incompleto} grams`, 
                tooltip: "Lack one or more essential amino acids needed for regeneration." 
                }
            ];
        }
    
        const fatEbooks: showEbook[] = [
            {
              title: "How monounsaturated fats help me?",
              onclick: undefined
            },
            {
              title: "How polyunsaturated fats help me?",
              onclick: undefined
            },
            {
              title: "Why saturated fats can hurt me?",
              onclick: undefined
            }
        ];
        
        let fatButtons: showMacroNutrSignUp[] = [];
        
        if (reciboObjetivo != null) {
            fatButtons = [
                {
                label: "Monounsaturated",
                price: `${reciboObjetivo.monoinsaturadas} grams`,
                tooltip: "Heart-friendly fats that support cholesterol balance and overall health."
                },
                {
                label: "Polyunsaturated",
                price: `${reciboObjetivo.poliinsaturadas} grams`,
                tooltip: "Essential fats, including omega-3 and omega-6, crucial for brain and cell function."
                },
                {
                label: "Saturated",
                price: `${reciboObjetivo.saturadas} grams`,
                tooltip: "Stable fats that provide energy but should be consumed in moderation."
                }
            ];
        }
          
        const carbEbooks: showEbook[] = [
        {
            title: "Why I need complex carbs?",
            onclick: undefined
        },
        {
            title: "Do I need simple carbs?",
            onclick: undefined
        }
        ];
    
        const fiberEbooks: showEbook[] = [
        {
            title: "Fiber and microbiota",
            onclick: undefined
        },
        {
            title: "Fiber and neurogenesis",
            onclick: undefined
        },
        {
            title: "Fiber and neurotransmissors",
            onclick: undefined
        }
        ];
        
        let carbButtons: showMacroNutrSignUp[] = [];
        
        if (reciboObjetivo != null) {
        carbButtons = [
            // {
            // label: "Fiber",
            // price: `${recibo.fibra} grams`,
            // tooltip: "Fiber promotes healthy digestion, supports heart health, helps regulate blood sugar levels and supports neuron and brain activity."
            // },
            {
            label: "Complex",
            price: `${reciboObjetivo.complejos} grams`,
            tooltip: "Provide long-lasting energy and fiber, digesting slowly."
            },
            {
            label: "Simples",
            price: `${reciboObjetivo.simples} grams`,
            tooltip: "Digest quickly, giving a fast but short energy boost."
            }
        ];
        }
    // #endregion 


  return (<>
    {
      loaded==true && reciboObjetivo && <Flex
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
        <AvatarPart subiendo={subiendoAvatarNombre} setEmpezarAEditar={seteditarAvatarNombre} 
        editando={editarAvatarNombre} nom={newUserNom} setnewUserNom={setnewUserNom}
        perfilPic={perfilPicVer.current} setperfilPic={setperfilPic} function={salvaAvatarNombre} ></AvatarPart>

        <NutritionistClientCard></NutritionistClientCard>

        {/* datos personales vista */}
        <Box  w="100%"  display="flex" justifyContent="center">
            {/* editando */}
            {editarDatos== true && <CustomCard mt="0px" hijo={
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

            <Box mt={"0px"}>  
                <PencilIconOnTop subiendo={subiendoDatos} setEmpezarAEditar={seteditarDatos} editando={editarDatos} function={salvaDatos} />
            </Box>
        </Box> 


        {/* MACRONUTRIENTS */}
        <Box w="100%" display="flex" justifyContent="center">
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
    </Flex>}

    { loaded==false && !reciboObjetivo && <PurpleSpinner></PurpleSpinner>} 
    </>);

}
