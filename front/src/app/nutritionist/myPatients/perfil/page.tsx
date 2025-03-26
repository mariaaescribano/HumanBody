'use client';
// Chakra imports
import {
  Flex,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, colorNutricionist, dameDatosDelRecibo, getTamanyoPantalla, redirigirSiNoHayNutriNom } from '../../../../GlobalHelper';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import FiberCard from '@/components/global/cards/FiberCard';
import UserPersonalData from '@/components/miPerfil/UserPersonalData';
import { reciboSkeleton, showMacroNutrSignUp } from '../../../../../../backend/src/dto/recibos.dto';
import BarraMenuNutri from '@/components/nutritionist/BarraMenuNutri';
import { createUserSkeleton } from '../../../../../../backend/src/dto/usuarios.dto';
import GreenSpinner from '@/components/global/random/GreenSpinner';
import { showEbook } from '../../../../../../backend/src/dto/ebook.dto';



export default function MyPatientPerfil() 
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
        redirigirSiNoHayNutriNom()
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



    // #region EBOOKS 
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
      
          if (patientRecibo != null) 
          {
              proteinButtons = [
                  { 
                  label: "Complete proteins", 
                  price: `${patientRecibo.completo == "" ? 0 : patientRecibo.completo} grams`, 
                  tooltip: "Contain all essential amino acids your body needs for regeneration." 
                  },
                  { 
                  label: "Incomplete proteins", 
                  price: `${patientRecibo.incompleto} grams`, 
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
          
          if (patientRecibo != null) {
              fatButtons = [
                  {
                  label: "Monounsaturated",
                  price: `${patientRecibo.monoinsaturadas} grams`,
                  tooltip: "Heart-friendly fats that support cholesterol balance and overall health."
                  },
                  {
                  label: "Polyunsaturated",
                  price: `${patientRecibo.poliinsaturadas} grams`,
                  tooltip: "Essential fats, including omega-3 and omega-6, crucial for brain and cell function."
                  },
                  {
                  label: "Saturated",
                  price: `${patientRecibo.saturadas} grams`,
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
          
          if (patientRecibo != null) {
          carbButtons = [
              // {
              // label: "Fiber",
              // price: `${recibo.fibra} grams`,
              // tooltip: "Fiber promotes healthy digestion, supports heart health, helps regulate blood sugar levels and supports neuron and brain activity."
              // },
              {
              label: "Complex",
              price: `${ Math.round(parseInt(patientRecibo.complejos, 10)) } grams`,
              tooltip: "Provide long-lasting energy and fiber, digesting slowly."
              },
              {
              label: "Simples",
              price: `${patientRecibo.simples} grams`,
              tooltip: "Digest quickly, giving a fast but short energy boost."
              }
          ];
          }
    
    
    // #endregion EBOOKS 
      

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
       { patientRecibo!= null && screenSize && <>
        <CustomCard mt="10px" p="15px" hijo={ 
            <Text color={"black"} fontSize="xl" w="100%" fontWeight="700" textAlign="center">
                MACRONUTRIENTS OBJECTIVE
            </Text>
        }>
        </CustomCard>

        <CustomCard mt="10px" hijo={ 
            <MacroNutrCard title={'PROTEINS'} verMensajesNutri={true}
            infoLista={proteinButtons} ebooklista={proteinEbooks}
            reciboObjetivo={Number(patientRecibo.prote)} 
            total={patientRecibo.prote} screenSize={screenSize} 
           ></MacroNutrCard>} >
        </CustomCard>

        <CustomCard mt="10px" hijo={ 
            <MacroNutrCard title={'FATS'} infoLista={fatButtons} verMensajesNutri={true}
            reciboObjetivo={Number(patientRecibo.grasas)} ebooklista={fatEbooks} 
            total={patientRecibo.grasas} screenSize={screenSize} 
           ></MacroNutrCard>} >
        </CustomCard>

        <CustomCard mt="10px" hijo={ 
            <MacroNutrCard title={'CARBS'} infoLista={carbButtons} verMensajesNutri={true}
            reciboObjetivo={Number(patientRecibo.carbs)} ebooklista={carbEbooks} 
            total={patientRecibo.carbs} screenSize={screenSize} 
           ></MacroNutrCard>} >
        </CustomCard>

        <CustomCard mb="50px" mt="10px" hijo={ 
            <FiberCard edit={false} reciboObjetivo={Number(patientRecibo.fibra) }
            totalFiber={patientRecibo.fibra} screenSize={screenSize}
            ebooklista={fiberEbooks} verMensajesNutri={true}
            ></FiberCard>}>
        </CustomCard>

        </>} 



    </Flex>}

    { !patientRecibo && !user  && <GreenSpinner></GreenSpinner>} 
    </>);

}
