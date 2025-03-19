'use client';
// Chakra imports
import {
  Flex,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  Spinner,
  Text,

} from '@chakra-ui/react';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import CustomCard from '@/components/global/cards/CustomCard';
import BarraMenu from '@/components/global/BarraMenu';
import TitleCard from '@/components/global/cards/TitleCard';
import { redirigirSiNoHayUserNom, StringIsNull } from '@/GlobalHelper';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import InputField from '@/components/global/random/InputField';


const numberMeals = [
    { value: '1', label: '1 meal' },
    { value: '2', label: '2 meals' },
    { value: '3', label: '3 meals' },
    { value: '4', label: '4 meals' },
    { value: '5', label: '5 meals' },
    { value: '6', label: '6 meals'},
];



export default function DesignMealStart() 
{
  const [meals, setmeals] = useState<any>(1);
  const [haDiseñado, sethaDiseñado] = useState<boolean | undefined>(true);
  const [activity, setactivity] = useState<string>("");
  const [calories, setcalories] = useState<string>("0");
  //0: no falta, 1: falta activididad, 2: falta calories, 3:faltan ambos
  const [datoFaltan, setdatoFaltan] = useState<number>(0); 

  // comprueba si ya ha diseñado
    useEffect(() => 
    {
        redirigirSiNoHayUserNom()
        const datosGuardados = sessionStorage.getItem('arrayMeals');
        if(datosGuardados)
        {
            location.href = "./lastPage"
        }
        else
            sethaDiseñado(false)
    }, []);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => 
    {
        setmeals(event.target.value);
    };

    const salvaSS = () => 
    {
        let faltan = false;
        if(StringIsNull(activity))
        {
            faltan = true;
            setdatoFaltan(1)
        }   
        if(StringIsNull(calories) && faltan == true)
        {
            setdatoFaltan(3)
        } 
        if(StringIsNull(calories) && faltan == false)
        {
            setdatoFaltan(2)
        } 
        if (!StringIsNull(calories) && !StringIsNull(activity))
        {
            sessionStorage.setItem("actividad", activity)
            sessionStorage.setItem("caloriasNecesitadas", calories)
            sessionStorage.setItem("meals", meals)
            location.href = "./main"
        }
        
    };


    const editaCalorias = (valor: string) =>
    {
        setcalories(valor.replace(/\D/g, ""));
    };


  return (
    <>
    {( haDiseñado == false) && <Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        p="20px"
        minH="100vh"
        position={"relative"}
    >

        <BarraMenu></BarraMenu>
        
        {/* titulo */}
        <CustomCard mt="0px" hijo={
            <TitleCard title={'DESIGN YOUR MEAL I'}
            firstBtnText={'X Cancel'} goback={()=> location.href = "../../myday"} 
            secondBtnText={'Next'} letsgo={salvaSS} secondBtnIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z"/></svg>}/>
        }/>

        <CustomCard mt="10px" hijo={
            <Flex direction="column" mb="4px">
                <FormLabel
                    display='flex'
                    ms='10px'
                    fontSize='sm'
                    color={"black"}
                    fontWeight='bold'
                    _hover={{ cursor: 'pointer' }}>
                    <HStack>
                        <svg xmlns="http://www.w3.org/2000/svg" height="26px" style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} viewBox="0 -960 960 960" width="26px" fill="#00000"><path d="m358.15-505.84 88.7-89.31-69.08-69.7-45.16 45.16-42.15-42.15L335-707l-61.54-61.54-89.31 89.31 174 173.39Zm320.7 321.3 89.3-89.31-61.54-61.54-45.15 44.54L619.31-333l44.54-45.15-69.31-68.7-88.7 88.7 173.01 173.61ZM697.46-760l63.16 63.15L697.46-760ZM288.08-140H140v-148.08l175.39-175.38L100-679.23l173.46-173.46 216.77 216.38 164.85-165.46q9.31-9.31 20.46-13.77 11.15-4.46 23.31-4.46 12.15 0 23.3 4.46 11.16 4.46 20.46 13.77l59.16 60.93q9.31 9.3 13.57 20.46 4.27 11.15 4.27 23.3 0 12.16-4.27 22.81-4.26 10.65-13.57 19.96L637.69-489.23l215 215.77L679.23-100 463.46-315.39 288.08-140ZM200-200h62.54l392.38-391.77-63.15-63.15L200-262.54V-200Zm423.85-423.23-32.08-31.69 63.15 63.15-31.07-31.46Z"/></svg>
                        <Text fontSize='sm' ms='2px'fontWeight="bold">
                            {"Select how many meals do you want"}
                        </Text>
                    </HStack>
                </FormLabel>
                
                <Select
                fontSize="sm"
                border="1px solid gray"
                borderRadius={"10px"}
                variant="main"
                h="44px"
                maxH="44px"
                value={meals}
                onChange={handleSelectChange}  
                >
                    {numberMeals.map((option:any) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </Flex>
        }/>

        <CustomCard mt="10px" hijo={
            <Flex direction="column" mb="4px">
                <InputField
                mb="20px"
                onChange= {(e:any) => setactivity(e.target.value)}
                id="first"
                bg={(datoFaltan == 1 || datoFaltan == 3) ? "red.200" : ""}
                placeholder="Run 6km / Work all day long / Party with friends / ..."
                label="Today's activity where I will put my heart into:"
                textAlign={"center"}
                />

                <InputField
                mb="20px"
                onChange= {(e:any) => editaCalorias(e.target.value)}
                id="second"
                bg={(datoFaltan ==2 || datoFaltan == 3) ? "red.200" : ""}
                value={calories+" kcal"}
                label="Calories I will need to healthily fulfill the activity:"
                textAlign={"center"}
                />
                
            </Flex>
        }/>
  
    </Flex>}
    {(haDiseñado == true) && <PurpleSpinner></PurpleSpinner>}
</>);

}
