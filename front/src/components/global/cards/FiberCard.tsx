'use client';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input } from '@chakra-ui/react';
import { reciboSkeleton } from '../../../../../backend/src/dto/recibos.dto';
import { esSoloNumeros, userNutriId } from '../../../GlobalHelper';
import InputField from '../random/InputField';
import EBookButton from '../random/EBookButton';
import { showEbook } from '../../../../../backend/src/dto/ebook.dto';
import { FiberName } from '@/components/Names/FiberName';
import NutriComent from '@/components/nutritionistPatient/NutriComent';
import { nutriComentarios } from '../../../../../backend/src/dto/nutri.dto';



export default function FiberCard(props: { edit:boolean, stillNeed?:boolean, recibo?:reciboSkeleton, reciboObjetivo?:number,
  setrecibo?:any, totalFiber?:string, screenSize:string, ebooklista?:showEbook[],  verMensajesNutri?:boolean, miPerfil?:number  }) 
{


  const escribir = (gramosCantidas:string) =>
  {
      if(esSoloNumeros(gramosCantidas) || gramosCantidas=="" )
      {
          const nuevoRecibo = { ...props.recibo };
          nuevoRecibo.fibra= Math.round(parseInt(gramosCantidas,10)).toString();

          props.setrecibo(nuevoRecibo)
      }
  };


  return (
    <Flex direction="column" w="100%">
        <HStack>
            <FiberName fontSize="2xl" /> 
            <Text mb="5px" fontSize="2xl" fontWeight={"bold"}>
              {(props.edit == true && (props.miPerfil== null || props.miPerfil==undefined)) && (props.screenSize=="sm" ?  "PER 100 G": "PER 100 GRAMS")}
            </Text>
        </HStack>

        { props.edit == false && props.ebooklista &&
        <>
          <Box w="100%" borderBottom="2px solid black" my="20px" />
          <Flex justify="center" gap="20px" mb="10px" w="100%" fontSize="xl" fontWeight="bold" wrap="wrap">
              {props.ebooklista.map((item, index) => (
                  <EBookButton key={index} texto={item.title} type={7} />
              ))}
          </Flex>
        </> }

        <Box w="100%" borderBottom="2px solid black" my="20px" />

            

        {(props.edit==true) && <Flex justify="center" w="100%" fontSize="xl" fontWeight={"bold"} gap="20px">
          <Text mt="10px">TOTAL </Text>
          <Input
            textAlign="center"
            border="1px solid gray"
            borderRadius={"10px"}
            fontWeight='500'
            variant='main'
            w="25%"
            value= {props.totalFiber && !isNaN(Number(props.totalFiber)) ? props.totalFiber : "0"}
            onChange= {(e:any)=> {escribir(e.target.value)}}
            h='44px'
            maxH='44px'
          />
          {/* <InputField onChange= {(e:any)=> {escribir(e.target.value)}} alignText="center" value= {props.totalFiber ? props.totalFiber : "0"}/> */}
          <Text mt="10px">grams</Text>
        </Flex>} 


              
        {(props.edit == false  || props.miPerfil == 1) &&
          <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"} gap="10px"> 
            {!props.stillNeed &&  <Text>TOTAL </Text>}
            {props.stillNeed && props.stillNeed== true &&  <Text>TOTAL PER NOW </Text>}
            {/* <MeryTooltip texto={"Fiber is a carb but it isn't summed with the carbohydrates."} /> */}

          <HStack>
              {/* <Text> {props.totalFiber ? props.totalFiber : "0"} </Text> */}
              <Text>
                  {(!props.totalFiber || props.totalFiber.includes("NaN")) ? "0" : props.totalFiber}
              </Text>

              <Text>grams </Text>
          </HStack></Flex>}

          {props.stillNeed && props.stillNeed== true &&  <>
          <Box w="100%" borderBottom="2px solid black" my="20px" />
            <Flex justify="space-between" w="100%" fontSize="lg" fontWeight={"bold"}>
                <Text>{"STILL NEED"} </Text>
                <Text>{props.reciboObjetivo} grams</Text>
            </Flex></>} 


         {/* si tiene nutricionista o es el nutricionista, entra */}
          {props.verMensajesNutri && (sessionStorage.getItem("userNutri") || sessionStorage.getItem("patientTratando")) &&  
          <>
          <Box display="flex" alignItems="center" justifyContent="center" >
            {!props.stillNeed && <NutriComent campo={nutriComentarios.fibra} />}
            {props.stillNeed && props.stillNeed== true &&  <NutriComent campo={nutriComentarios.fibraMyDay} />}
          </Box></>}
    </Flex>

  );
}
