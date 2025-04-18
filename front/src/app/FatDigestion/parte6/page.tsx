'use client';
import { useState, useEffect, useRef, use } from 'react';
import { Card, Box, Text, Flex, Grid, VStack, Button, HStack } from '@chakra-ui/react';
import DuodenumInterior from '../../../../public/FatDigestion/DuodenumInterior.png';

//fotos
import singlevilli from '../../../../public/FatDigestion/Parte6/singlevilli.png';
import Villi from '../../../../public/FatDigestion/Parte6/villi.png';
import chylomicrons from '../../../../public/FatDigestion/Parte4/chylomicrons.png';

import dialogo from '../../../../public/dialogo.png';
import LeftRightButtons from '@/components/global/old/LeftRightButtons';
import PopUpMessage from '@/components/global/message/PopUpMessage';
import IzqPurpleMessage from '@/components/global/old/IzqPurpleMessage';
import DerPurpleMessage from '@/components/global/DerPurpleMessage';
import BarnerMorado from '@/components/global/BarnerMorado';
import { EscribirTextoDinamico, getTamanyoPantalla, handleMouseEndGlobalHelper, handleMouseStartGlobalHelper, handleMoveMouse, handleTouchEndGlobalHelper, handleTouchMoveGlobalHelper, handleTouchStartGlobalHelper, moveWithKey, moveWithKeyBucle, putDefaultKeys, stopMoveWithKey } from '../../../GlobalHelper';
import { motion } from "framer-motion";

const Parte6FatDigestion = () => 
{
  //movimientos
  const [position1, setPosition1] = useState({ x: 40, y: 10 });

  // chylomicron
  const [chylomicron, setchylomicron] = useState(true);
  const [size, setSize] = useState(120); 
  const [borderRadius, setborderRadius] = useState(20); 
  const [small, setsmall] = useState(false); 

  const [screenSize, setScreenSize] = useState(null);
  const [finish, setFinish] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const control = useRef<boolean>(true);



  // tamaño pantalla
  useEffect(() => 
  {
    getTamanyoPantalla(setScreenSize);
  }, []);



  // comprobar si los objetos se tocan
  const checkOverlap = (posiNueva:any) => 
  {
    if(posiNueva!= undefined)
    {
        if(posiNueva.x!= undefined && posiNueva.y!= undefined)
        {
            if(screenSize=="xl")
            {
                if(posiNueva.x >= 24 && posiNueva.x <= 31
                && posiNueva.y >= 30 && posiNueva.y <= 45 )
                {
                    setsmall(true)
                }
            }
            else if(screenSize=="sm")
            {
                if(posiNueva.x >= 6 && posiNueva.x <= 20
                && posiNueva.y >= 13 && posiNueva.y <= 46 )
                {
                    setsmall(true)
                }
            }
        }
    }
  };


  // hacer pequeño
  useEffect(() => 
  {
    let interval: number | NodeJS.Timeout | undefined;

    if (small==true) 
    {
        control.current=false;
      interval = setInterval(() => 
      {
        setSize((prevSize) => 
        {
          if (prevSize > 50) 
          {
            return prevSize - 2; // Incrementa el tamaño en 2px
          } 
          else 
          {
            setsmall(false)
            clearInterval(interval);
            mover();
            return 50; // Llega al tamaño 
          }
        });
      }, 50); // Incrementa cada 50ms
    }

    return () => clearInterval(interval); // Limpiar intervalos cuando el componente se desmonta
  }, [small]);





  
  const path = [
    { x: 30, y: 40 },
    { x: 30, y: 83 },
    { x: 60, y: 83 },
  ];

  const path2 = [
    { x: 20, y: 40 },
    { x: 20, y: 90 },
    { x: 70, y: 90 },
  ];
  
  const mover = () => {
    let realPath = null;

    if (screenSize == "xl") {
        realPath = path;
    }
    else
    {
        realPath = path2;
    }

      let currentStep = 0;
      let progress = 0; // Progreso de la animación
      const speed = 0.02; // Controla la velocidad del movimiento (entre 0 y 1)
      const interval = setInterval(() => {
        if (currentStep < realPath.length - 1) {
          progress += speed;
          const currentPos = realPath[currentStep];
          const nextPos = realPath[currentStep + 1];
          
          // Interpolación entre los puntos
          const newPos = {
            x: currentPos.x + (nextPos.x - currentPos.x) * progress,
            y: currentPos.y + (nextPos.y - currentPos.y) * progress,
          };
          
          setPosition1(newPos); // Actualiza la posición
  
          // Cuando el progreso llegue a 1, se mueve al siguiente punto
          if (progress >= 1) 
            {
            currentStep += 1;
            progress = 0; // Resetea el progreso para el siguiente paso
          }
        } else {
            setFinish(true);
          clearInterval(interval); // Finaliza la animación al llegar al último punto
        }
      }, 16); // Aproximadamente 60 FPS
  
      return () => clearInterval(interval); // Limpia el intervalo cuando ya no sea necesario
    // }
  };
  




//////////////////////// MOVIMIENTO LIPASA /////////////////////
//////////////////// MOVIL MOVEMENT ///////////////////////////
  const isTouching = useRef(false); // Para controlar si el usuario sigue tocando

  // Función para manejar el inicio del toque
  const handleTouchStart = (e: {TouchEvent:any, preventDefault:any}, numero:number) => 
  {
    handleTouchStartGlobalHelper(e, isTouching);
  };

  // Función para manejar el movimiento del dedo
  const handleTouchMove = (e: React.TouchEvent, numero:number) => 
  {
    let posiNueva = handleTouchMoveGlobalHelper(e, containerRef, 50, 70, setPosition1);
    if(posiNueva!= undefined)
        checkOverlap(posiNueva);
  };

  // Función para manejar el fin del toque
  const handleTouchEnd = (e: unknown, p0: number) => 
  {
    handleTouchEndGlobalHelper(isTouching);
  };
  //////////////////// END MOVIL MOVEMENT ///////////////////////////





  const [elige, setelige] = useState(0);
  const isInteracting = useRef(false); // Controla si el usuario está interactuando

  // Manejar inicio del toque o clic
  const handleStart = (e: React.MouseEvent, number:number) => 
  {
    if(control.current == true)
    {
        setelige(number)
        handleMouseStartGlobalHelper(e, isInteracting, containerRef, setPosition1);
    }
  };

  // Manejar movimiento del dedo o ratón
  const handleMove = (e: React.MouseEvent) => 
  {
    if(control.current == true)
    {
        let posiNueva = handleMoveMouse(e, isInteracting, containerRef, setPosition1);
        checkOverlap(posiNueva);
    }   
  };

  // Finalizar la interacción
  const handleEnd = () => 
  {
    setelige(0)
    handleMouseEndGlobalHelper(isInteracting);
  };





  // textos
  const textScience = "To absorb the nutrients, the small intestine has villi. \n Chylomicrons can't enter through the blood channel because they are too big, so they first enter into the lymphatic system (the green channel).";
  const textGame = "Take the Chylomicron to the top of the left Villi.";

  const [scienceText, setscienceText] = useState(""); // State for visible text
  const [gameText, setgameText] = useState(""); // State for visible text
  const [index, setIndex] = useState(0); // Tracks the current letter
  const [orden, setorden] = useState(0); // Tracks the current letter

  useEffect(() => 
  {
    if(orden == 0)
    {
      EscribirTextoDinamico(textScience, setscienceText , setIndex, index, orden, setorden);
    }
    else
    {
      EscribirTextoDinamico(textGame, setgameText , setIndex, index, orden, setorden);
    }

  }, [index, orden]);



  return (

    <Box pt={{ base: '20px', md: '20px', xl: '20px' }}>
    
      {/* Barner morado*/}
      <BarnerMorado title={'HUMAN BODY: FAT DIGESTION VI'}></BarnerMorado>

      <Flex
        direction="row"
        width="100%"
        p="30px"
        mt="-10px"
        justifyContent="center" // Centra el contenedor general
        alignItems="center"
      >
        <Grid
          width="100%"
          gridTemplateColumns={{
            base: '1fr',          // Una columna en pantallas pequeñas (móvil)
            md: '1fr 1fr 1fr',    // Tres columnas iguales en pantallas medianas y mayores
            '2xl': '1fr 2fr 1fr', // Columna del medio más ancha en pantallas grandes
          }}
          justifyItems="center" // Centra el contenido dentro de sus columnas
          alignItems="center" // Centra verticalmente las columnas
          gap="20px"
        >
          {finish == true && <PopUpMessage title={"Discover what happens next..."} texto={"Let's travel throught the lymphatic system!"}
                  but1={"GO!"} but2={"" } url1={"../FatDigestion/parte5"} url2={"../FatDigestion/parte7"} />}


          {/* Primera columna - Izquierda */}
          <IzqPurpleMessage scienceText={scienceText}></IzqPurpleMessage>

          
          {/* Segunda columna - Centro */}
          {screenSize !== null && 
          <Flex
            justifyContent="center"
            alignItems="center"
            w="100%"
          >
            <Card
            ref={containerRef}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            w="90%"
            h={{ base: "500px", md: "600px" }}
            borderRadius="30px"
            // onMouseDown={(e) => handleStart(e, 1)}
            onMouseMove={(e) => handleMove(e)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}

            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
            style={{
                position: 'relative',
                touchAction: "none",
                overscrollBehavior: "none"
            }}>

            {screenSize != null && <div
                style={{
                position: "absolute",
                width: "100%",
                borderRadius:"30px",
                height: "100%",
                backgroundImage:`url(${Villi.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.3,
                zIndex: 0,
                }}
            />}

            {screenSize != null && 
            <div
                style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundImage:`url(${singlevilli.src})`,
                opacity: 1,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: 1,
                marginLeft:"-100px",
                marginTop:"180px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                }}
            />}

            { small == true && <div
                style={{
                  position: "absolute",
                  zIndex: 2,
                  width: "100px", 
                  height: "100px",
                  backgroundImage:  `url(${dialogo.src})` ,
                  backgroundSize: "cover",
                  left: screenSize== "xl"? position1.x+80 : position1.x+10 ,
                  top:  screenSize== "xl"? position1.y+100 : position1.y+30,
                  display: "flex", // Activar flexbox
                  justifyContent: "center", 
                  alignItems: "center", // Centrar verticalmente
                  textAlign: "center", // Asegurar que el texto en varias líneas se alinee bien
                }}
              >
                <Text fontFamily="Times New Roman, serif" mb="15px">Let's go!</Text>
              </div>}

            {/* Glycerol en la esquina superior izquierda */}
            {chylomicron == true && 
            <VStack
                position="absolute"
                top={`${position1.y}%`}
                left={`${position1.x}%`}
                zIndex={1}
                width="120px"
                height="120px"
                onTouchStart={(e) => handleTouchStart(e, 1)}
                onTouchMove={(e) => handleTouchMove(e, 1)}
                onTouchEnd={(e) => handleTouchEnd(e, 1)}
                onMouseDown={(e) => handleStart(e, 1)}
                 //raton
                // onMouseDown={(e) => handleStart(e, 1)}
                // onMouseMove={(e) => handleMove(e, 1)}
                // onMouseUp={handleEnd}
                // onMouseLeave={handleEnd}
            >
                <Box
                position="absolute"
                style={{
                    borderRadius:`${borderRadius}px`,
                    width: `${size}px`, // Utiliza el tamaño actual de state
                    height: `${size}px`, // Lo mismo para height
                    position: "absolute",
                    backgroundSize: "cover", // Hace que la imagen cubra todo el área
                    backgroundPosition: "center", // Centra la imagen en el card
                    backgroundRepeat: "no-repeat", // Evita que la imagen se repita
                    touchAction: "none", /* Desactiva el desplazamiento táctil */
                    overscrollBehavior: "none", /* Prevenir comportamientos adicionales */
                  }}
                backgroundImage={`url(${chylomicrons.src})`}
                />
                <Text position="absolute" mt="-30px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl" textShadow="2px 2px 4px white, -2px -2px 4px white">
                  Chylomicron
                </Text>
            </VStack>}


            </Card>

          </Flex>}


          {/* Tercera columna - Derecha */}
          <DerPurpleMessage gameText={gameText} urlLeft={"../FatDigestion/parte3"} urlRight={"../FatDigestion/parte5"}></DerPurpleMessage>

        </Grid>
      </Flex>
    </Box>
  );
};

export default Parte6FatDigestion;
