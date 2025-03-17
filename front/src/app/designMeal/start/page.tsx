'use client';
// Chakra imports
import {
  Flex,
  FormLabel,
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
import { redirigirSiNoHayUserNom } from '@/GlobalHelper';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';


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
        sessionStorage.setItem("meals", meals)
        location.href = "./main"
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
                    <Text fontSize='sm' ms='2px'fontWeight="bold">
                        {"Select how many meals do you want"}
                    </Text>
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
  
    </Flex>}
    {(haDiseñado == true) && <PurpleSpinner></PurpleSpinner>}
</>);

}
