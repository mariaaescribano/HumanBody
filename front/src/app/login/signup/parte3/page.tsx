'use client';
// Chakra imports
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import { API_URL, ObjectIsNull, crearRecibo, getTamanyoPantalla } from '../../../../../GlobalHelper';
import { createUserSkeleton, realUser } from '../../../../../../backend/src/dto/usuarios.dto';
import PurpleSpinner from '@/components/global/random/Spinner';
import MeryTooltip from '@/components/global/random/MeryToolTip';
import EBookButton from '@/components/global/random/EBookButton';
import CustomCard from '@/components/global/cards/CustomCard';
import TitleCard from '@/components/signin/TitleCard';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { reciboSkeleton, showMacroNutrSignUp } from '../../../../../../backend/src/dto/recibos.dto';
import { fichaSkeleton } from '../../../../../../backend/src/dto/fichas.dto';
import { showEbook } from '../../../../../../backend/src/dto/ebook.dto';
import FiberCard from '@/components/global/cards/FiberCard';

export default function SignUp3() 
{
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const [user, setUser] = useState<createUserSkeleton | null>(null);
    const [recibo, setrecibo] = useState<reciboSkeleton | null>(null);
    const [screenSize, setscreenSize] = useState<string>("");
    const objectiveIndex = useRef<number>(0);

    
    // coge datos del user de sessionstorage para poder adaptar bien los macros
    // tb setscreensize
    useEffect(() => 
    {
        const userStr = sessionStorage.getItem("user");
        getTamanyoPantalla(setscreenSize)
        if (userStr) 
        {
            const user = JSON.parse(userStr); 
            setUser(user)
        
            let index = sessionStorage.getItem("objectiveIndex");
            if(index)
            {
                objectiveIndex.current = parseInt(index, 10);
                calculaMacros(parseInt(user.calorias_objetivo, 10));
            }
        }
        else
        location.href = '../signup/parte2';
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // con los datos del usuario calcula los macros 
    const calculaMacros = (caloriasTotal:number) =>
    {
        let proteTotalPorcentaje = 0;
        let grasasTotalPorcentaje = 0;
        let carbsTotalPorcentaje = 0;

        //obtener PORCENTAJES dependiendo de su objetivo
        if(objectiveIndex.current == 0) // lose
        { 
            proteTotalPorcentaje= 35
            grasasTotalPorcentaje= 25
            carbsTotalPorcentaje= 40
        }
        if(objectiveIndex.current == 1) // muscle
        { 
            proteTotalPorcentaje= 25
            grasasTotalPorcentaje= 28
            carbsTotalPorcentaje= 50
        }
        if(objectiveIndex.current == 2)
        { 
            proteTotalPorcentaje= 30
            grasasTotalPorcentaje= 25
            carbsTotalPorcentaje= 50
        }

        // operaciones para obtener GRAMOS exactos
        let proteTotal = Math.round((proteTotalPorcentaje*caloriasTotal) / (4*100));
        let grasasTotal = Math.round((grasasTotalPorcentaje*caloriasTotal) / (9*100));
        let carbsTotal = Math.round((carbsTotalPorcentaje*caloriasTotal) / (4*100));

        // especificar mas a fondo
        let proteCompletas = Math.round(proteTotal * (75/100));
        let proteIncompletas = Math.round(proteTotal * (25/100));

        let grasasSaturadas = Math.round((10* caloriasTotal) / (100*9));
        let Monoinsaturadas = Math.round((45 * grasasTotal) / 100);
        let Poliinsaturadas = Math.round((35* grasasTotal) / 100);

        let carbsComplejas = Math.round(carbsTotal * (80/100));
        let carbsSimples = Math.round(carbsTotal * (20/100));

        let cantidad = Math.round(caloriasTotal/1000);
        let fibra = cantidad * 14;

        const reciboCuerpo:reciboSkeleton=
        {
            grasas:grasasTotal.toString(),
            monoinsaturadas:Monoinsaturadas.toString(),
            poliinsaturadas:Poliinsaturadas.toString(),
            saturadas:grasasSaturadas.toString(),
            prote:proteTotal.toString(),
            incompleto:proteIncompletas.toString(),
            completo:proteCompletas.toString(),
            carbs:carbsTotal.toString(),
            complejos:carbsComplejas.toString(),
            simples:carbsSimples.toString(),
            fibra:fibra.toString()
        } 

        setrecibo(reciboCuerpo)
    };



    // cuando el usuario lo acepta, se crea un recibo, una ficha y esos ids se guardan en la tabla usuarios
    const letsgo = () =>
    {
        crear();
    };

    const crear = async () => 
    {
        if(!ObjectIsNull(recibo) && user)
        {
            let idRecibo = await crearRecibo(recibo);
            //creamos ficha
            const ficha: fichaSkeleton =
            {
                peso: user.peso,
                altura:user.altura,
                nivel_actividad:user.nivel_actividad,
                calorias_objetivo:user.calorias_objetivo,
                objetivo:user.objetivo,
                genero:user.genero,
                edad:user.edad,
                reciboId:idRecibo
            }
            let idFicha = await crearFicha(ficha);
            let date = getCurrentDate();
            // creamos por fin al usuario q se insertara
            const userAinsertar: realUser =
            {
                nombre:user.nombre,
                contra:user.contra,
                dias_ids:"",
                ficha_id:idFicha,
                fecha_registro: date
            }
            await crearUsuario(userAinsertar);
            //borrar session
            sessionStorage.clear();
            sessionStorage.setItem("userNom", user.nombre)
            location.href="../../myday"
        }
    };

    const getCurrentDate = () => 
    {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Añade 1 porque los meses van de 0 a 11
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      }
    
    const crearFicha = async (ficha:fichaSkeleton) => 
    {
        try{
        const response = await axios.post(
            `${API_URL}/fichas/createFicha`,
            ficha,
            {
            headers: {
                'Content-Type': 'application/json'
            },
            }
        );
        if(response.data != null)
            return response.data;
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
    };


    const crearUsuario = async (userAinsertar:realUser) => 
    {
        try{
        const createNewUser = await axios.post(
            `${API_URL}/usuarios/createUser`,
            userAinsertar,
            {
            headers: {
                'Content-Type': 'application/json'
            },
            }
        );
        console.log(createNewUser.data)
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
    };



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

    if (recibo != null) 
    {
        proteinButtons = [
            { 
            label: "Complete proteins", 
            price: `${recibo.completo} grams`, 
            tooltip: "Contain all essential amino acids your body needs for regeneration." 
            },
            { 
            label: "Incomplete proteins", 
            price: `${recibo.incompleto} grams`, 
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
    
    if (recibo != null) {
    fatButtons = [
        {
        label: "Monounsaturated",
        price: `${recibo.monoinsaturadas} grams`,
        tooltip: "Heart-friendly fats that support cholesterol balance and overall health."
        },
        {
        label: "Polyunsaturated",
        price: `${recibo.poliinsaturadas} grams`,
        tooltip: "Essential fats, including omega-3 and omega-6, crucial for brain and cell function."
        },
        {
        label: "Saturated",
        price: `${recibo.saturadas} grams`,
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
    
    if (recibo != null) {
    carbButtons = [
        // {
        // label: "Fiber",
        // price: `${recibo.fibra} grams`,
        // tooltip: "Fiber promotes healthy digestion, supports heart health, helps regulate blood sugar levels and supports neuron and brain activity."
        // },
        {
        label: "Complex",
        price: `${recibo.complejos} grams`,
        tooltip: "Provide long-lasting energy and fiber, digesting slowly."
        },
        {
        label: "Simples",
        price: `${recibo.simples} grams`,
        tooltip: "Digest quickly, giving a fast but short energy boost."
        }
    ];
    }


    return (
        <Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        minH="100vh"
        position={"relative"}
        >

            {!ObjectIsNull(recibo) && recibo != null && 
            <CustomCard hijo={ 
                <TitleCard title={"PERSONAL DESIGNED PLAN"} letsgo={letsgo} goback={()=> location.href = "../signup/parte2"} tooltip={"This is a science-based plan, but if you feel uncomfortable, feel free to change it or talk with an expert :)"}></TitleCard>} >
            </CustomCard>}

            {!ObjectIsNull(recibo) && recibo != null && 
            <CustomCard hijo={ 
                <MacroNutrCard title={'PROTEINS'} totalMacro={recibo.prote} total={'TOTAL PROTEINS'} infoLista={proteinButtons} screenSize={screenSize} ebooklista={proteinEbooks}></MacroNutrCard>} >
            </CustomCard>} 


            {!ObjectIsNull(recibo) && recibo != null && 
                <CustomCard 
                hijo={ 
                    <MacroNutrCard 
                    title={'FATS'} 
                    totalMacro={recibo.grasas}
                    total={'TOTAL FATS'} 
                    infoLista={fatButtons} 
                    screenSize={screenSize} 
                    ebooklista={fatEbooks} 
                    />
                } 
                />
            }

            {!ObjectIsNull(recibo) && recibo != null && 
                <CustomCard mb="50px"
                hijo={ 
                    <MacroNutrCard 
                    title={'CARBS'} 
                    totalMacro={recibo.carbs}
                    total={'TOTAL CARBS'} 
                    infoLista={carbButtons} 
                    screenSize={screenSize} 
                    ebooklista={carbEbooks} 
                    />
                } 
                />
            }


            {!ObjectIsNull(recibo) && recibo != null && 
            <CustomCard hijo={
                <FiberCard edit={false} totalFiber={recibo.fibra} screenSize={screenSize} ebooklista={fiberEbooks}></FiberCard>}> 
            </CustomCard>}

            {user == null && <PurpleSpinner></PurpleSpinner>}
        </Flex>
    );

}
