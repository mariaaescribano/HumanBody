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
    // poner redirigirSiNoHayUserNom();
  const [meals, setmeals] = useState<any>(1);

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
    <Flex
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
            <TitleCard title={'DESIGN YOUR MEAL I'} titleIcon={<svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#000000"><path d="m358.15-505.84 88.7-89.31-69.08-69.7-45.16 45.16-42.15-42.15L335-707l-61.54-61.54-89.31 89.31 174 173.39Zm320.7 321.3 89.3-89.31-61.54-61.54-45.15 44.54L619.31-333l44.54-45.15-69.31-68.7-88.7 88.7 173.01 173.61ZM697.46-760l63.16 63.15L697.46-760ZM288.08-140H140v-148.08l175.39-175.38L100-679.23l173.46-173.46 216.77 216.38 164.85-165.46q9.31-9.31 20.46-13.77 11.15-4.46 23.31-4.46 12.15 0 23.3 4.46 11.16 4.46 20.46 13.77l59.16 60.93q9.31 9.3 13.57 20.46 4.27 11.15 4.27 23.3 0 12.16-4.27 22.81-4.26 10.65-13.57 19.96L637.69-489.23l215 215.77L679.23-100 463.46-315.39 288.08-140ZM200-200h62.54l392.38-391.77-63.15-63.15L200-262.54V-200Zm423.85-423.23-32.08-31.69 63.15 63.15-31.07-31.46Z"/></svg>}
            firstBtnText={'Cancel'} goback={()=> location.href = "../../myday"} 
            secondBtnText={'Next'} letsgo={salvaSS} />
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
  
    </Flex>
</>);

}
