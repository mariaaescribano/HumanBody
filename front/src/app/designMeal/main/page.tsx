'use client';
// Chakra imports
import {
    Box,
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
import MainCards from '@/components/designMeal/MainCards';
import  { designamealSkeleton, mealSkeleton } from '../../../../../backend/src/dto/meal.dto';
import { API_URL, dameDatosDeAlimentoConcreto, dameDatosDelRecibo, dameReciboDeAlimentoConcreto, getIdAlimentoPorNombre, getIdReciboConAlimentoName, ObjectIsNull, redirigirSiNoHayUserNom, reglasDeTresParaAlimentoGramosPersonalizados, StringIsNull, sumaDeMacros, update } from '@/GlobalHelper';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import axios from 'axios';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import { reciboSkeleton } from '../../../../../backend/src/dto/recibos.dto';

export default function DesignMealMain() 
{
  // ESTRATEGIA PARA DIVIDIR Y Q EL USER DISEÑE
  // coge num meals de ss
  // coge calorias objetivo de ss
  // coge recibo objetivo de ss (lo trae todo de bd)
  // divide las calorias en el num de meals
  // divide los macros en num de meals
  // muestra en pantalla (en cada cartita) lo q deberia de tener cada comida 

  const [meals, setmeals] = useState<mealSkeleton[]>([]);
  const [nextDisabled, setnextDisabled] = useState<boolean>(false);
  // 0: nothing, 1: its pulsado, 2: its correct, 3: an error happened
  const [btnSavePulsado, setbtnSavePulsado] = useState<number>(0);
  const mensajeError = useRef<string>("Please, try again later");
  ///////////////////////////////////////////////////////////////////////////


  // #region muestra
  // IMPLEMENTACION
  // 0: coge num meals de ss
  useEffect(() => 
  {
    redirigirSiNoHayUserNom()
    
    // si hay num de meals, es q acaba de empezar
    // se crea lista de mealSkeleton vacios
    let mealsNumber = Number(sessionStorage.getItem("meals"))
    if(mealsNumber)
    {
      setnextDisabled(true)
      encargateReparticion(mealsNumber);
    }
    // si hay arrayMeals, es q ya esta avanzando en el diseño
    else
    {
      const datosGuardados = sessionStorage.getItem('arrayMeals');
      if(datosGuardados)
      {
        const arrayRecuperado = JSON.parse(datosGuardados);
        setmeals(arrayRecuperado)

        // miramos q todos los datos esten rellenos para ver si podemos darle a Next
        comprobarTodosDatosLlenos(arrayRecuperado);
      }
      else
        location.href= './start'
    }
  
  }, []);



  // 1: coge calorias y recibo de usuario
  // lo divide segun el num de meals q desa planificar
  // lo asigna uno a uno
  const encargateReparticion = async (mealsNumber:number) =>
  {
    let guarda = [];
    let caloriasRepartidas = divideCalorias(mealsNumber);
    let reparteMacros = await divideMacros(mealsNumber);

    if(caloriasRepartidas && reparteMacros)
    {
      for(let i=0; i< mealsNumber; i++)
      {
        let newMeal: mealSkeleton =
        {
          relleno: false,
          caloriasTotal: caloriasRepartidas?.toString(),
          proteTotal: reparteMacros[0],
          fuenteProte: "",
          carbsTotal: reparteMacros[2],
          fuenteCarbs: "",
          fatTotal: reparteMacros[1],
          fuenteFat: "",
          fibraTotal: reparteMacros[3],
          fuenteFibra: "",
          gramosFuenteProte: '',
          gramosFuenteCarbs: '',
          gramosFuenteFat: '',
          gramosFuenteFibra: '',
          caloriasSelected:''
        };
        guarda.push(newMeal)
      } 
      setmeals(guarda)
      sessionStorage.setItem('arrayMeals', JSON.stringify(guarda));
      // borra el meals de ss para q no repita la operacion
      sessionStorage.removeItem("meals")
    } 
    else
      location.href = "../login/login"  
   
  };

  const divideCalorias = (mealsNumber:number) =>
  {
    let calorias = Number(sessionStorage.getItem("caloriasObjetivo"))
    if(calorias)
    {
      let reparte = Math.round(calorias/mealsNumber);
      return reparte;
    }
    // si faltan datos, se vuelve a login
    else
      location.href = "../login/login"  
  };

  const divideMacros = async (mealsNumber:number) =>
  {
    let idRecibo = Number(sessionStorage.getItem("reciboObjetivo"))
    if(idRecibo)
    {
      let recibo = await dameDatosDelRecibo(idRecibo)
      if(!ObjectIsNull(recibo))
      {
        // se divide cada macro
        let proteDivision = Math.round(Number(recibo?.prote) / mealsNumber).toString();
        let fatDivision =  Math.round(Number(recibo?.grasas) / mealsNumber).toString();
        let carbsDivision = Math.round(Number(recibo?.carbs) / mealsNumber).toString();
        let fibraDivision = Math.round(Number(recibo?.fibra) / mealsNumber).toString();
        return [proteDivision, fatDivision, carbsDivision, fibraDivision] 
      } 
    }  
    // si faltan datos, se vuelve a login
    else
      location.href = "../login/login" 
  };


  const comprobarTodosDatosLlenos = (arrayRecuperado: mealSkeleton[]) =>
  {
    let llenos = true;
    for(let i=0; i< arrayRecuperado.length; i++)
    {
      if(arrayRecuperado[i].relleno == false)
        llenos = false;
    }
    if(llenos == true)
      setnextDisabled(false)
    else
      setnextDisabled(true)
  };


  // si el usuario quiere ir a atras, simplemente se borra lo q habia en ss
  const goBack = () =>
  {
    sessionStorage.removeItem("DesignAMeal")
    sessionStorage.removeItem("arrayMeals")
    sessionStorage.removeItem("meals")
    location.href = "./start";
  };


  // #region salva
  /// SAVE IN BD THE DESIGNED MEAL ///
  const saveDesignedMeal = async () => {
    const datosGuardados = sessionStorage.getItem("arrayMeals");
    
    if (!datosGuardados) {
      mensajeError.current = "Meals weren't found, please do it again";
      return;
    }
  
    setbtnSavePulsado(1); // Show spinner
  
    try {
      const arrayRecuperado = JSON.parse(datosGuardados);
      let guardaMeals:designamealSkeleton[] = [];
  
      // take all the meals from the ss and save them in BD
      const requests = arrayRecuperado.map((meal:any, index:number) => 
      {
        //get the dates from ss
        const designamealBody = getDesignAMealBody(meal, index + 1);
        guardaMeals.push(designamealBody) // meals are saved

        // save that day in bd
        return axios.post(`${API_URL}/designameal/create`, designamealBody, 
        {
          headers: { "Content-Type": "application/json" },
        });
      });
      // take all the responses (that are the ID from the row saved in bd in designameal)
      const responses = await Promise.all(requests);
      if(responses.length > 0)
      {
        // post them in ss, for be able to get the data in lastPage
        for(let i=0; i< responses.length; i++)
        {
          sessionStorage.setItem("meal"+(i+1), responses[i].data)
        }
        sessionStorage.setItem("DesignAMeal", "true")

        // just in case: delet everything again
        sessionStorage.removeItem("arrayMeals")
        sessionStorage.removeItem("meals")

        // before leaving, sum all the data to MyDay (to keep a better track of it)
        await sumDataToMyDay(guardaMeals)

        // avisar and go to the last page, to see every meal card
        setbtnSavePulsado(2);  
        const timer = setTimeout(() => {
          setbtnSavePulsado(0);  
          location.href= './lastPage'
        }, 3000);
        return () => clearTimeout(timer); 
      }
    } catch (error: any) {
      console.log("Error saving meals:", error);
      setbtnSavePulsado(3); 
      const timer = setTimeout(() => {
        setbtnSavePulsado(0);  
        mensajeError.current ="Meals couldn't be saved"
      }, 3000);
      return () => clearTimeout(timer);
    } 
  };
  

  const getDesignAMealBody = (objetoArrayMealRecuperado: any, numberMeal:number) =>
  {
    if(objetoArrayMealRecuperado)
    {
      let body: designamealSkeleton = 
      {
        idDia: Number(sessionStorage.getItem("diaId")),
        meal: numberMeal,
        nomUser:sessionStorage.getItem("userNom"),
        actividad:objetoArrayMealRecuperado.actividad,
        caloriesNeeded:objetoArrayMealRecuperado.caloriesNeeded,
        
        caloriasTotal:objetoArrayMealRecuperado.caloriasTotal,
        caloriasSelected:objetoArrayMealRecuperado.caloriasSelected,
    
        proteTotal:objetoArrayMealRecuperado.proteTotal,
        fuenteProte:objetoArrayMealRecuperado.fuenteProte,
        gramosFuenteProte:objetoArrayMealRecuperado.gramosFuenteProte,
    
        carbsTotal:objetoArrayMealRecuperado.carbsTotal,
        fuenteCarbs:objetoArrayMealRecuperado.fuenteCarbs,
        gramosFuenteCarbs:objetoArrayMealRecuperado.gramosFuenteCarbs,
    
        fatTotal:objetoArrayMealRecuperado.fatTotal,
        fuenteFat:objetoArrayMealRecuperado.fuenteFat,
        gramosFuenteFat:objetoArrayMealRecuperado.gramosFuenteFat,
    
        fibraTotal:objetoArrayMealRecuperado.fibraTotal,
        fuenteFibra:objetoArrayMealRecuperado.fuenteFibra,
        gramosFuenteFibra:objetoArrayMealRecuperado.gramosFuenteFibra
      };
      return body;
    }
  };



  // IMPORTANT: all the data from designaday will be sum to MyDay :D
  const sumDataToMyDay = async (guardaMeals: designamealSkeleton[]) =>
  {
    //BIG STRATEGY 
    // for each fuenteAlimento recuperate their ID (alimento original)
    try 
    {
      for(let i=0; i< guardaMeals.length; i++)
      {
        let meal = guardaMeals[i]
        if(!StringIsNull(meal.fuenteProte))
        { 
          await manageAlimento(meal.fuenteProte, meal.gramosFuenteProte, 0)
        }
        if(!StringIsNull(meal.fuenteFat))
          { 
            await manageAlimento(meal.fuenteFat, meal.gramosFuenteFat, 1)
          }
          if(!StringIsNull(meal.fuenteCarbs))
            { 
              await manageAlimento(meal.fuenteCarbs, meal.gramosFuenteCarbs, 2)
            }
            if(!StringIsNull(meal.fuenteFibra))
              { 
                await manageAlimento(meal.fuenteFibra, meal.gramosFuenteFibra, 3)
              }
      }
    } 
    catch (error) 
    {
      throw new Error();
    }
  };


  const [mensajeErrorError, setmensajeError ] = useState<boolean>(false);
  const calories = useRef<string>("");

  const manageAlimento = async (alimentoNom:string, gramos:string, predomina:number) =>
  {
    try 
    {
      // we only have the name, needs the alimento Id
      let idAlimento = await getIdAlimentoPorNombre(alimentoNom)
      // now, we can get the object alimento
      let alimentoConcreto = await dameDatosDeAlimentoConcreto(idAlimento);
      // get the receipt of the alimento original
      let reciboOriginal = await dameReciboDeAlimentoConcreto(alimentoConcreto.recibo_id)
      // lets get reciboDiaUser to sum the new foods
      let reciboDiaUser = await dameReciboDeAlimentoConcreto(Number(sessionStorage.getItem("reciboDeHoy")))
      // personalice the receipt following the number of grams user selected
      let nuevoReciboPersonalizado= reglasDeTresParaAlimentoGramosPersonalizados(reciboOriginal, calories, gramos, alimentoConcreto)
      // sum it
      let reciboSuma = sumaDeMacros(nuevoReciboPersonalizado, reciboDiaUser);
      if(reciboSuma && reciboDiaUser)
      {
        // everything gets updated
        await update(reciboSuma, sessionStorage.getItem("reciboDeHoy"), gramos, predomina, calories.current, setmensajeError, alimentoConcreto);
      }
    } 
    catch (error) 
    {
      console.log("Error sumando alimento a dia", error)
      throw new Error();
    }
  };

  useEffect(() => 
  {
    if(mensajeErrorError==true)
      setbtnSavePulsado(3)
  }, [mensajeErrorError]);


  return (
    <>
      {meals.length !== 0 && 
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
            
            {btnSavePulsado==3 && <Box mb="20px" w="100%">
              <PopUpErrorMessage title={''} texto={mensajeError.current}></PopUpErrorMessage>
            </Box>}
            
            {/* titulo */}
            <CustomCard mt="0px" hijo={
                <TitleCard title={'DESIGN YOUR DAY II'} 
                firstBtnText={'Delete & Go back'} goback={goBack} 
                secondBtnText={'Save & Next'} letsgo={saveDesignedMeal} 
                mensajeError={btnSavePulsado == 2? true : undefined} textMensajeError={'All meals saved!'} statusMensajeError={'success'}
                btnDesactivado={nextDisabled} btnDisabled={btnSavePulsado == 1? true : false}/>
            }/>
            
            {/* tarjetas de meals */}
            {/* si solo hay uno, se pondra en el medio */}
            <Box ml={{ base: "30px", md: "0px" }} mt={{ base: "10px", md: "10px" }} mb="60px">
            {meals.length === 1 ? (
              <Flex justify="center">
                <Box>
                  <CustomCard
                    mt="0px"
                    hijo={<MainCards meal={meals[0]} index={0} />}
                  />
                </Box>
              </Flex>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: "10px", md: "20px" }}>
                {meals.map((item, index) => (
                  <Box key={index}>
                    <CustomCard mt="10px" mb="0px"
                      hijo={<MainCards meal={item} index={index} />}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            )}
            </Box>
        </Flex>
      }
      {meals.length == 0 &&<PurpleSpinner></PurpleSpinner>}
    </>);

}
