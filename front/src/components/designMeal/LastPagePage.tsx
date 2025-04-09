'use client';
// Chakra imports
import {
    Box,
  Button,
  Flex,
  FormLabel,
  HStack,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,

} from '@chakra-ui/react';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import CustomCard from '@/components/global/cards/CustomCard';
import BarraMenu from '@/components/global/BarraMenu';
import TitleCard from '@/components/global/cards/TitleCard';
import MainCards from '@/components/designMeal/MainCards';
import  { alimentoMacroMealView, designamealSkeleton, mealSkeleton } from '../../../../backend/src/dto/meal.dto';
import { API_URL, ArrayIsNullEmpty, borrarAlimentoComidoDeBD, colorNutricionist, colorNutricionistBg, dameDatosDeAlimentoConcreto, dameDatosDelRecibo, dameIdAlimentoComido, dameReciboDeAlimentoConcreto, designamealExists, getIdAlimentoPorNombre, getMealObjectsFromSessionStorage, getMealsObjects, ObjectIsNull, redirigirSiNoHayNutriNom, redirigirSiNoHayUserNom, reglasDeTresParaAlimentoGramosPersonalizados, restaDeMacros, updateCaloriesDiasComidos, updateRecibo } from '@/GlobalHelper';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import FinalMealCard from '@/components/designMeal/FinalMealCard';
import InputField from '@/components/global/random/InputField';
import axios from 'axios';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import SuccessErrorMessage from '@/components/global/message/SuccessErrorMessage';
import { NutritionistIcon } from '../icons/NutritionistIcon';
import BarraMenuNutri from '../nutritionist/BarraMenuNutri';
import { MdCheck } from 'react-icons/md';

export default function LastPagePage(props:{ meals:designamealSkeleton[] , setmeals:any, soyNutri: string}) 
{
  // ESTRATEGIA
  // coger datos de SS
  // crear cartitas 

  
  //btnPressed--> 0: nothing, 1: spinner, 2:deleted perfectly, 3: error
  const [btnPressed, setbtnPressed] = useState<number>(0);

  //btnPressedDeleting--> 0: nothing, 1: spinner, 2:deleted perfectly, 3: error
  const [btnPressedDeleting, setbtnPressedDeleting] = useState<number>(0);

  const [userTieneNutri, setuserTieneNutri] = useState<boolean>(false);
  const [designamealapproved, setdesignamealapproved] = useState<boolean>(false);
  const mensajeSuccess = useRef<string>("");
  const patientNom = useRef<string>("");
  const idDia = useRef<string>("");
//////////////////////////////////////////////////////////////////////

  // IMPLEMENTACION
  // 0: coge el array de ss
  useEffect(() => {
    if(props.soyNutri=="false")
    {
        redirigirSiNoHayUserNom();
        // need to take all the objects that has meal in the SS
        let idmeals = getMealObjectsFromSessionStorage();
        idDia.current = sessionStorage.getItem("diaId") ?? ""
        patientNom.current = sessionStorage.getItem("userNom") ?? ""
        if(idmeals.length>0 && idDia.current!="" && patientNom.current !="")
            getMealsObjects(idmeals, props.setmeals)// need to make calls to BD
        else
            location.href="../myday"

        if(sessionStorage.getItem("userNutri"))
        {
            setuserTieneNutri(true)
            nutriHaAprobado()
        }    
    }
    else
    {
        redirigirSiNoHayNutriNom();
        const queryParams = new URLSearchParams(location.search);
        const idDiaa = queryParams.get('idDia') || '';
        const patientNomm = queryParams.get('patientNom') || '';
        patientNom.current = patientNomm;
        idDia.current = idDiaa;
        getIdMealsOfMyPatient(idDiaa, patientNomm) 
        nutriHaAprobado()
    }
   
    // location.href='./start'
  }, [props.soyNutri]);

  const getIdMealsOfMyPatient = async (idDia:string, patientNom:string) =>
  {
      let ids = await designamealExists(idDia, patientNom)
      console.log(ids)
      if(!ArrayIsNullEmpty(ids))
      {
          if(ids.length>0)
            getMealsObjects(null, props.setmeals, ids)
      }  
      else
        location.href="./mypatientday"
  };


  const approveDesignAMealByNutri = async () =>
  {
    try{
      setbtnPressed(1)
      const response = await axios.put(
          `${API_URL}/designameal/approve/${idDia.current}/${patientNom.current}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
      );
      if(response.data) // es q se ha eliminado
      {
        setbtnPressed(2)
        mensajeSuccess.current = "Meals approved correctly"
        const timer = setTimeout(() => {
          setbtnPressed(0)
          setdesignamealapproved(true)
          location.href = "./sendMessage"
        }, 3000);
        return () => clearTimeout(timer); 
      }
      }
      catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const nutriHaAprobado = async () =>
  {
    try
    {
        const response = await axios.get(
        `${API_URL}/designameal/isApproved/${idDia.current}/${patientNom.current}`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if(response.data==1) // esta aprobado
        {
            setdesignamealapproved(true)
        }
    }
    catch (error) {
    console.log('Error fetching data:', error);
    }
  };

  const sendToNutri = async () =>
  {
    // must take you to the message page, with the message ready to send
    location.href = "../../sendMessage?mira=true";
  };



  // #region delete
  // deleting a designmeaobject from back (also needs to be deleted from ss)
  const borrar = async () =>
  {
    try{
      setbtnPressed(1)

      // BEFORE: delete the alimentosComidos
      await deleteCaloriesUpdateReceipt()

      const response = await axios.delete(
        `${API_URL}/designameal/delete/${sessionStorage.getItem("userNom")}`,
        {
          headers: {
              'Content-Type': 'application/json'
          },
        }
      );
        if(response.data == "ok") // es q se ha eliminado
        {
          setbtnPressed(2)
          mensajeSuccess.current = "Meals deleted correctly"
          sessionStorage.removeItem("DesignAMeal");
          deleteMealObjectsFromSessionStorage()
          const timer = setTimeout(() => {
            setbtnPressed(0)
            location.href = "./start"
          }, 3000);
          return () => clearTimeout(timer); 
          
        }
      }
      catch (error) 
      {
        setbtnPressed(3)
        console.log('Error fetching data:', error);
      }
  };

  function deleteMealObjectsFromSessionStorage(): void {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      
      // Check if the key matches the pattern "meal" followed by a number
      if (key && /^meal\d+$/.test(key)) {
        try {
          // Delete the item from sessionStorage
          sessionStorage.removeItem(key);
        } catch (error) {
          console.log(`Error removing sessionStorage item ${key}:`, error);
        }
      }
    }
  }


  // 1: one by one of all the foods eaten
  const deleteCaloriesUpdateReceipt = async () =>
  {
    try 
    {
      for(let i=0; i< props.meals.length; i++)
      {
        if(props.meals[i].fuenteCarbs!="")
          await borrarAlimentoComido(props.meals[i].fuenteCarbs, props.meals[i].gramosFuenteCarbs)
        if(props.meals[i].fuenteFat!="")
          await borrarAlimentoComido(props.meals[i].fuenteFat, props.meals[i].gramosFuenteFat)
        if(props.meals[i].fuenteFibra!="")
          await borrarAlimentoComido(props.meals[i].fuenteFibra, props.meals[i].gramosFuenteFibra)
        if(props.meals[i].fuenteProte!="")
          await borrarAlimentoComido(props.meals[i].fuenteProte, props.meals[i].gramosFuenteProte)
      } 
    } 
    catch (error) 
    {
      console.log("Error al eliminar alimentos comidos en designameal:", error);
      throw new Error()
    }
  };

  const calories = useRef<string>("");
  const borrarAlimentoComido = async (alimento:string, gramosTotal:string) =>
  {
    try 
    {
      let idAlimentoComido = await dameIdAlimentoComido(gramosTotal, alimento, sessionStorage.getItem("diaId"))
      let idAlimento = await getIdAlimentoPorNombre(alimento)

      // take the id and make the regladetres
      let alimentoConcreto = await dameDatosDeAlimentoConcreto(idAlimento);

      // get the receipt of the alimento original
      let reciboOriginal = await dameReciboDeAlimentoConcreto(alimentoConcreto.recibo_id)

      // lets get reciboDiaUser to sum the new foods
      let reciboDiaUser = await dameReciboDeAlimentoConcreto(Number(sessionStorage.getItem("reciboDeHoy")))
      
      // personalice the receipt following the number of grams user selected
      let nuevoReciboPersonalizado= reglasDeTresParaAlimentoGramosPersonalizados(reciboOriginal, calories, gramosTotal, alimentoConcreto)
      
      // get calories, get the receipt and rest it from today
      let reciboDiaAfterRest = restaDeMacros(reciboDiaUser, nuevoReciboPersonalizado)
      let caloriesTotalAfterRest = Number(sessionStorage.getItem("caloriasDeHoy")) - Number(calories.current);
      
      // save the new receipt and calories
      sessionStorage.setItem("caloriasDeHoy", caloriesTotalAfterRest.toString())
      await updateRecibo(reciboDiaAfterRest, sessionStorage.getItem("reciboDeHoy"), null)
      await updateCaloriesDiasComidos(caloriesTotalAfterRest.toString(), idAlimentoComido, sessionStorage.getItem("diaId"))
      
      // delete id comido from bd 
      await borrarAlimentoComidoDeBD(idAlimentoComido)
    } 
    catch (error) 
    {
      console.log("Error al eliminar alimentos comidos en designameal:", error);
      throw new Error()
    }
  };
    



  return (
    <>
      {props.meals.length >0 && 
        <Flex
            direction="column"
            align="center"
            bg={props.soyNutri =="true" ? colorNutricionist : "purple.100"}
            w="100%"
            h="100%"
            justify="center"
            p="20px"
            minH="100vh"
            position={"relative"}
        >

            {props.soyNutri =="false" && <BarraMenu></BarraMenu>}
            {props.soyNutri =="true" && <BarraMenuNutri></BarraMenuNutri>}

            {btnPressed == 3 && <Box mb="10px">
              <PopUpErrorMessage title={''} texto={'Please, try again later.'}></PopUpErrorMessage></Box>} 
            
            {/* titulo */}
            <CustomCard mt="0px" p="25px" hijo={<>
              {props.soyNutri=="false" && <Text fontSize="2xl" fontWeight="700">YOUR DESIGNED DAY</Text>}
              {props.soyNutri=="true" && 
                <VStack>
                        <Text fontSize="2xl" fontWeight="700">DESIGNED MEAL</Text>
                        <Text fontSize="xl" fontWeight="700">{patientNom.current}</Text>
                </VStack>}</>
            }/>

            {props.soyNutri=="false" && userTieneNutri==true &&
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
                <Button bg="red.100" mt="5px"  w="200px"  disabled={btnPressed==1? true:false} onClick={borrar} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    <Text ml="5px">Delete</Text>
                    {btnPressed == 1 && 
                    <Spinner
                        size="sm"
                        ml={4}
                        color="white"
                    />}
                </Button>
                {designamealapproved == false && <Button bg={colorNutricionist} w="200px" mt="5px" disabled={btnPressed==1? true:false} onClick={sendToNutri} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)">
                    <NutritionistIcon></NutritionistIcon>
                    <Text ml="5px">Send to nutri</Text>
                </Button>}
                {designamealapproved == true && <Button bg={colorNutricionist} w="200px" mt="5px" disabled={true} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)">
                    <NutritionistIcon></NutritionistIcon>
                    <Text ml="5px">Nutri approved it!</Text>
                </Button>}
            </SimpleGrid>
            }

            {props.soyNutri=="false" && userTieneNutri==false &&
                <Button bg="red.100" mt="5px"  w="200px"  disabled={btnPressed==1? true:false} onClick={borrar} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    <Text ml="5px">Delete</Text>
                    {btnPressed == 1 && 
                    <Spinner
                        size="sm"
                        ml={4}
                        color="white"
                    />}
                </Button>
            }

            {props.soyNutri=="true" && 
            <>
            { designamealapproved == false && 
            <Button bg={colorNutricionistBg} mt="5px" disabled={btnPressed==1? true:false} onClick={approveDesignAMealByNutri} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)">
              <Icon as={MdCheck}/>
              <Text ml="5px">Approve</Text>
              {btnPressed == 1 && 
              <Spinner
                size="sm"
                ml={4}
                color="white"
              />}
            </Button>}

            {designamealapproved == true && 
            <Button bg={colorNutricionistBg} w="150px" mt="5px" disabled={true} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)">
                <NutritionistIcon></NutritionistIcon>
                <Text ml="5px">You approved it!</Text>
            </Button>}</>}

            {btnPressed == 2 && <SuccessErrorMessage title={ mensajeSuccess.current } status={'success'}></SuccessErrorMessage>}
            

            {/* actividad */}
            <CustomCard mt="20px" hijo={
              <Flex direction="column" mb="4px">
                  <InputField
                  mb="20px"
                  id="first"
                  disabled={true}
                  value={sessionStorage.getItem("actividad")}
                  placeholder="Run 6km / Work all day long / Party with friends / ..."
                  label="Today's activity where I will put my heart into:"
                  textAlign={"center"}
                  />
                  <InputField
                  mb="0px"
                  id="second"
                  disabled={true}
                  value={sessionStorage.getItem("caloriasNecesitadas")+" kcal"}
                  label="Calories I will need to healthily fulfill the activity:"
                  textAlign={"center"}
                  />
              </Flex>
          }/>
            
            {/* tarjetas de meals */}
            <Box ml={{ base: "30px", md: "0px" }} mb="60px" w={{ base: "100%", md: "auto" }}>
                <SimpleGrid columns={{ base: 1, md: 1 }} w="100%">
                     {/* colocacion interna tarjetas de meals */}
                     {props.meals.slice().reverse().map((item, index) => (
                        <CustomCard key={index} hijo={
                            <FinalMealCard meal={item} index={index}/>
                        }></CustomCard>
                    ))}
              </SimpleGrid>
            </Box>
        </Flex>
      }
      {props.meals.length == 0 &&<PurpleSpinner></PurpleSpinner>}
    </>);

}
