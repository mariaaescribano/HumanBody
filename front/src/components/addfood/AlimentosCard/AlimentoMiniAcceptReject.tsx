'use client';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input, SimpleGrid, FormLabel, useColorModeValue, Button, Spinner } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { API_URL, CarbIcono, colorFibra, convierteNumRedondeado, dameDatosDeAlimentoConcreto, dameDatosDelRecibo, dameReciboDeAlimentoConcreto, FiberIcono, ProteIcono, reglasDeTresParaAlimentoGramosPersonalizados, StringIsNull, sumaDeMacros } from '@/GlobalHelper';
import { alimentosComidosSkeleton, alimentosSkeleton } from '../../../../../backend/src/dto/alimentos.dto';
import { FatIcono } from '@/components/icons/FatIcon';
import axios from 'axios';
import { reciboSkeleton } from '../../../../../backend/src/dto/recibos.dto';
import { MdCheck } from 'react-icons/md';


export default function AlimentoMiniAcceptReject(props: { alimentoComido: alimentosComidosSkeleton, function:any }) 
{
  const icono = useRef<any>(null);
  const [hoverColor, sethoverColor] = useState<string>(""); 
  const [btnPulsado, setbtnPulsado] = useState<number>(0); 
  
  // personalize the food
  useEffect(() => 
  {
      if(props.alimentoComido.predomina==0)
      {
          sethoverColor("#610C04");
          icono.current = <ProteIcono></ProteIcono>
      }
      else if(props.alimentoComido.predomina==1)
      {
      sethoverColor("#abdefa");
      icono.current = <FatIcono></FatIcono>
      }
      else if(props.alimentoComido.predomina==2)
      {
          sethoverColor("#EDC9AF");
          icono.current = <CarbIcono></CarbIcono>
      }
      else if(props.alimentoComido.predomina==3)
          {
          sethoverColor(colorFibra);
          icono.current = <FiberIcono></FiberIcono>
          }
  
  }, [props.alimentoComido]);

  /////////// RESPONDE ///////////
  const userRespondeNutriPropuesta = async (idAlimento:number, rejected:string) =>
  {
    if(idAlimento)
    {
      try{
        const response = await axios.put(
        `${API_URL}/nutricomentarios/patientResponseNutriRecomienda/${sessionStorage.getItem("userNom")}/${sessionStorage.getItem("userNutri")}/${idAlimento}/${rejected}`, 
        {
            headers: 
            {
                'Content-Type': 'application/json'
            },
        });
        if(response.data == "ok")
        {
          if(rejected == "false")
          {
            setbtnPulsado(2)
            const timer = setTimeout(() => {
              props.function()
            }, 2000);
            return () => clearTimeout(timer); 
          }
        }
      }
      catch (error) {
          console.log('Error fetching data:', error);
      }
    }  
  };

  /////////// ACCEPT ///////////
  // 0: get food data
  const dameReciboDeAlimento = async () =>
  {
    let alimentoOriginal = await dameDatosDeAlimentoConcreto(props.alimentoComido.idAlimento);
    let reciboAlimentoOriginal = await dameReciboDeAlimentoConcreto(alimentoOriginal.recibo_id)
    if(reciboAlimentoOriginal != null)
    {
      addFood(alimentoOriginal, reciboAlimentoOriginal)
    }
  };

  // 1: cuando user le da a Add
  const addFood = async (alimentoOriginal:alimentosSkeleton, reciboAlimentoOriginal:reciboSkeleton) =>
  {
    setbtnPulsado(1)
    //  se coge su recibo
    let idreciboDeHoy = sessionStorage.getItem("reciboDeHoy");
    if(idreciboDeHoy!= null)
    {
      let reciboHoyUser = await dameDatosDelRecibo(parseInt(idreciboDeHoy, 10));
      if(reciboHoyUser && alimentoOriginal)
      {
        let reciboPers = reglasDeTresParaAlimentoGramosPersonalizados(reciboAlimentoOriginal, props.alimentoComido.calorias, alimentoOriginal)
        if(reciboPers)
        {
          // se hace la suma
          let idreciboDeHoy = sessionStorage.getItem("reciboDeHoy");
          let reciboSuma = sumaDeMacros(reciboPers, reciboHoyUser);
          if(reciboSuma && idreciboDeHoy)
          {
            update(reciboSuma, idreciboDeHoy);
          }
        }
      }
    }
  };

  // 2: si todo ha ido bien 
  // se actualiza de la bd los datos antiguos de hoy por la suma con el nuevo alimento 
  // idAlimentoComido = se crea un AlimentoComido con los datos
  // idAlimentoComido se concatenara en dias alimentos_id
  const update = async (reciboSuma: any, idreciboDeHoy:string) => 
  {
    let idDia = sessionStorage.getItem("diaId");
    if(idDia)
    {
      let todobn = await updateDiaAlimentos(idDia, props.alimentoComido.id);
      console.log(todobn)
      if(todobn)
        await updateRecibo(reciboSuma, idreciboDeHoy);
    }
  };

  const updateDiaAlimentos = async (idDia:string, idAlimentoComido:string) => 
  {
    let caloriasAnteriores = sessionStorage.getItem("caloriasDeHoy")
    if(caloriasAnteriores && !StringIsNull(props.alimentoComido.calorias) && props.alimentoComido?.id)
    {
      let sumaCalorias = convierteNumRedondeado(caloriasAnteriores) + convierteNumRedondeado(props.alimentoComido.calorias);
      sessionStorage.setItem("caloriasDeHoy", sumaCalorias.toString());
      try
      {
        const response = await axios.put(
            `${API_URL}/dias/diaAlimCalor/${parseInt(idDia, 10)}`,
            { alimentoId: idAlimentoComido, calorias: sumaCalorias },
              {
              headers: {
                  'Content-Type': 'application/json'
              },
            }
        );
        if(response.data != null)
          return true;
      }
      catch (error) 
      {
        console.error('Error fetching data:', error);
        return false;
      }
    }
  };

  const updateRecibo = async (reciboSuma: any, idreciboDeHoy:string) => 
  {
    try
    {
      const response = await axios.put(
          `${API_URL}/recibos/recibo/${parseInt(idreciboDeHoy, 10)}`,
          reciboSuma,
          {
          headers: {
              'Content-Type': 'application/json'
          },
          }
      );
      if(response.data != null)
        userRespondeNutriPropuesta(props.alimentoComido.id, "false")
    }
      catch (error) {
      console.error('Error fetching data:', error);
      }
  };
  /////////// END ACCEPT ///////////
  

  return (
    <Flex
    zIndex={5}
    justifyContent="flex-start"
    alignItems="center"
    bg={hoverColor}
    p="5px"
    mt="10px"
    direction="row"
    borderRadius="20px"
    width="100%"
    mx="auto"
  >

    {/* Contenedor de ícono y texto */}
    <Box display="flex" justifyContent="space-between" p="2px" alignItems="center" width="100%">
          <Box
              bg="white" 
              boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)" 
              p="5px"                       
              borderRadius="80px"
              ml="10px"
              mr="10px"            
              >          
              {icono.current}
          </Box>

          <Text color={props.alimentoComido.predomina == 0 ? "white" : "black"} fontSize="md" fontWeight="700" >
            {props.alimentoComido.nom}
          </Text>
          <Text ml={{base: "0px", md:"10px"}} color={props.alimentoComido.predomina == 0 ? "white" : "black"} fontSize="md" >
            {props.alimentoComido.calorias} kcal / {props.alimentoComido.gramosTotales} gr
          </Text>

          <Box ml="auto" mr="10px">
            {btnPulsado == 0 && <HStack>
              <svg fill={props.alimentoComido.predomina !== 0 ? "black" : "#FFFFFF"} onClick={()=> userRespondeNutriPropuesta(props.alimentoComido.id, "true")} cursor="pointer" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
              <svg fill={props.alimentoComido.predomina !== 0 ? "black" : "#FFFFFF"} onClick={dameReciboDeAlimento} cursor="pointer" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </HStack>}
            {btnPulsado == 1 &&  
            <Spinner
              size="sm"
              color={props.alimentoComido.predomina !== 0 ? "black" : "white"}
            />}
            {btnPulsado == 2 &&  
            <Box 
              bg={"green.200"} 
              borderRadius="50%"
              p="5px"
              width="24px"  
              height="24px"
              textAlign={"center"}
            > 
              <Icon as={MdCheck}/>
            </Box>}
          </Box>
    </Box>
  </Flex>);
}
