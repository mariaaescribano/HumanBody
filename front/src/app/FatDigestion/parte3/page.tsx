'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, Box, Text, Flex, Grid, VStack, Button, HStack } from '@chakra-ui/react';
import DuodenumInterior from '../../../../public/FatDigestion/DuodenumInterior.png';

//fotos
import Fatty from '../../../../public/FatDigestion/Parte3/Fatty.png';
import Glycerol from '../../../../public/FatDigestion/Parte3/Glycerol.png';
import PanLipasa from '../../../../public/FatDigestion/Parte3/PanLipasa.png';
import Tryglicerid from '../../../../public/FatDigestion/Parte3/Tryglicerid.png';

import dialogo from '../../../../public/dialogo.png';
import LeftRightButtons from '@/components/global/old/LeftRightButtons';
import PopUpMessage from '@/components/global/message/PopUpMessage';
import IzqPurpleMessage from '@/components/global/old/IzqPurpleMessage';
import DerPurpleMessage from '@/components/global/DerPurpleMessage';
import BarnerMorado from '@/components/global/BarnerMorado';
import { EscribirTextoDinamico, getTamanyoPantalla, handleMouseEndGlobalHelper, handleMouseStartGlobalHelper, handleMoveMouse, handleTouchEndGlobalHelper, handleTouchMoveGlobalHelper, handleTouchStartGlobalHelper, handleTouchStartMouseGlobalHelper, moveWithKey, moveWithKeyBucle, putDefaultKeys, stopMoveWithKey } from '../../../../GlobalHelper';
import { motion } from "framer-motion";

const Parte3FatDigestion = () => 
{
  //movimiento bile
  const [position, setPosition] = useState({x:0, y:0}); // Coordenadas del punto
  const [moving, setMoving] = useState(false);
  const [direction, setDirection] = useState("right");

  const [screenSize, setScreenSize] = useState(null);
  const [finish, setFinish] = useState(false);
  const [breakTry, setbreakTry] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);



  // tamaño pantalla
  useEffect(() => 
  {
    getTamanyoPantalla(setScreenSize);
  }, []);

  useEffect(() => 
    {
        if(screenSize!=="xl")
        {
            setPosition({x:4, y: 4})
        }
        else
        {
            setPosition({x:4, y: 9})
        }
        
    }, [screenSize]);



  // comprobar si los objetos se tocan
  const checkOverlap = () => 
  {
    if(position.x!= undefined && position.y!= undefined)
    {
        if(screenSize=="xl")
        {
            if(position.x >= 22 && position.x <= 55
            && position.y >= 19 && position.y <= 60 )
            {
            setbreakTry(true); 
            }
        }
        else if(screenSize=="sm")
        {
            if(position.x >= 6 && position.x <= 50
            && position.y >= 17 && position.y <= 67 )
            {
                setbreakTry(true); 
            }
        }
    }
  };

  // useEffect(() => 
  // {
  //   putDefaultKeys(handleKeyDown, handleKeyUp);
  // }, [pos]);

  useEffect(() => {
    // Configura un temporizador cuando breakTry cambia
    const timer = setTimeout(() => {
        if (breakTry) {
            setFinish(true);
        }
    }, 3000);
    
    // Limpieza de temporizadores al desmontar o cambiar breakTry
    return () => clearTimeout(timer); 
}, [breakTry]);


  

 



//////////////////////// MOVIMIENTO LIPASA /////////////////////

  //////////////////// KEY MOVEMENT ///////////////////////////
  const handleKeyDown = (e: {preventDefault: any; key: string; }) => 
  {
    moveWithKey(e, setMoving, setDirection);
  };

  const handleKeyUp = (e: { key: string }) => {
    stopMoveWithKey(e, setMoving);
  };

  useEffect(() => 
  {
    putDefaultKeys(handleKeyDown, handleKeyUp);
  }, []);

  // Actualiza la posición mientras se está moviendo
  useEffect(() => 
  {
    moveWithKeyBucle(moving, setPosition, direction);
    
  }, [moving, direction]);
  //////////////////// END KEY MOVEMENT ///////////////////////////





  //////////////////// MOVIL MOVEMENT ///////////////////////////
  const isTouching = useRef(false); // Para controlar si el usuario sigue tocando

  // Función para manejar el inicio del toque
  const handleTouchStart = (e: {TouchEvent:any, preventDefault:any}) => 
  {
    handleTouchStartGlobalHelper(e, isTouching);
  };

  // Función para manejar el movimiento del dedo
  const handleTouchMove = (e: React.TouchEvent) => 
  {
    handleTouchMoveGlobalHelper(e, containerRef, 50, 70, setPosition);
    checkOverlap();
  };

  // Función para manejar el fin del toque
  const handleTouchEnd = () => 
  {
    handleTouchEndGlobalHelper(isTouching);
  };
  //////////////////// END MOVIL MOVEMENT ///////////////////////////



  // MOUSE: movimiento bolus
  const isInteracting = useRef(false); // Controla si el usuario está interactuando

  // Manejar inicio del toque o clic
  const handleStart = (e: React.MouseEvent) => 
  {
    handleMouseStartGlobalHelper(e, isInteracting, containerRef, setPosition);
  };

  // Manejar movimiento del dedo o ratón
  const handleMove = (e: React.MouseEvent) => 
  {
    handleMoveMouse(e, isInteracting, containerRef, setPosition);
    checkOverlap();
  };

  // Finalizar la interacción
  const handleEnd = () => {
    handleMouseEndGlobalHelper(isInteracting);
  };





  // textos
  const textScience = "The Liver signals the Pancreas to release Pancreatic Lipase.\n Thanks to Emulsification, Pancreatic Lipase can break better the Fat (Triglycerides).";
  const textGame = "Let's cut the Triglycerides!\n Grabb the Lipasa and touch the Tryglicerid.";

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
      <BarnerMorado title={'HUMAN BODY: FAT DIGESTION III'}></BarnerMorado>

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
          {finish == true && <PopUpMessage title={"Discover what happens next..."} texto={"Discover what is a Chylomicron."}
                  but1={"GO!"} but2={"" } url1={"../FatDigestion/parte4"} url2={""} />}

          {/* Primera columna - Izquierda */}
          <IzqPurpleMessage scienceText={scienceText}></IzqPurpleMessage>

          


          {/* Segunda columna - Centro */}
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
              h= {{base: "500px", md:"600px"}}
              borderRadius="30px"
              boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
              style={{
                position: 'relative',
                touchAction: "none", /* Desactiva el desplazamiento táctil */
                overscrollBehavior: "none" /* Prevenir comportamientos adicionales */
              }}
              //movil
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              //raton
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
            >
              {screenSize !== null && <div
                style={{
                position: "absolute", // Aparece sobre el fondo del Card
                width: "100%",
                height: screenSize == "xl" ? "70%" : "100%",
                backgroundImage: `url(${DuodenumInterior.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.3, // Baja la opacidad de la imagen
                zIndex: 0, // Asegura que esté debajo del contenido
                }}
              />}

                {/* Tryglicerid */}
                {breakTry == false && 
                <Box
                style={{
                    position: "absolute",
                    width: "400px", // Tamaño del contenedor
                    height: "400px",
                    borderRadius: "20px", // Borde redondeado del contenedor
                    overflow: "hidden",  // Hace que cualquier cosa que sobresalga (como la imagen) se recorte
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "center", // Centra la imagen
                    alignItems: "center", // Asegura que la imagen se centre correctamente
                }}
                >
                    <div
                        style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${Tryglicerid.src})`,
                        backgroundSize: "contain", // Mantiene la imagen sin distorsión
                        backgroundPosition: "center", // Centra la imagen
                        backgroundRepeat: "no-repeat", // No repite la imagen
                        }}
                    />
                    <Text position="absolute" mt="20px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl"  textShadow="2px 2px 4px white, -2px -2px 4px white">
                        Tryglicerid
                    </Text>
                </Box>}



                {/* CUTTED */}
                {breakTry == true && 
                <HStack justify="center" align="center" gap={screenSize=="xl" ? "40px": "0px"}> {/* Aquí ajustas el gap para el espaciado */}
                    <Box
                    mt={screenSize=="xl" ? "0px": "-200px"}
                    style={{
                        width: "200px", // Tamaño del contenedor
                        height: "200px",
                        borderRadius: "20px", // Borde redondeado del contenedor
                        overflow: "hidden",  // Hace que cualquier cosa que sobresalga (como la imagen) se recorte
                        zIndex: 1,
                        position: "relative", // Importante: posición relativa para controlar el contenido dentro
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                    <div
                        style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${Fatty.src})`,
                        backgroundSize: "contain", // Mantiene la imagen sin distorsión
                        backgroundPosition: "center", // Centra la imagen
                        backgroundRepeat: "no-repeat" // No repite la imagen
                        }}
                    />
                    <Text 
                        position="absolute" // Asegura que el texto quede sobre la imagen
                        color="black" 
                        fontFamily="Times New Roman, serif" 
                        fontSize="2xl" 
                        textShadow="2px 2px 4px white, -2px -2px 4px white"
                    >
                        Fatty Acid
                    </Text>
                    </Box>
                
                    <Box
                    mt={screenSize=="xl" ? "20px": "200px"}
                    ml={screenSize=="xl" ? "20px": "-60px"}
                    style={{
                        width: "200px", // Tamaño del contenedor
                        height: "200px",
                        borderRadius: "20px", // Borde redondeado del contenedor
                        overflow: "hidden",  // Hace que cualquier cosa que sobresalga (como la imagen) se recorte
                        zIndex: 1,
                        position: "relative", // Asegura que el contenido sea relativo
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    >
                    <div
                        style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${Glycerol.src})`,
                        backgroundSize: "contain", // Mantiene la imagen sin distorsión
                        backgroundPosition: "center", // Centra la imagen
                        backgroundRepeat: "no-repeat" // No repite la imagen
                        }}
                    />
                    <Text 
                        position="absolute" // Asegura que el texto quede sobre la imagen
                        color="black" 
                        fontFamily="Times New Roman, serif" 
                        fontSize="2xl" 
                        textShadow="2px 2px 4px white, -2px -2px 3px white"
                    >
                        Monoglycerid
                    </Text>
                    </Box>
                </HStack>
                }


                {/* Lipasa */}
                {position.x != 0 && position.y!= 0 && <VStack
                    top={`${position.y}%`}
                    left={`${position.x}%`}
                    position="absolute" // Necesario para que se mueva correctamente
                    zIndex={1}
                    width="100px"
                    height="100px"
                >
                    <Box
                    position="absolute"
                    width="100%"
                    height="80%"
                    borderRadius="20px"
                    backgroundImage={`url(${PanLipasa.src})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    backgroundRepeat="no-repeat"
                    overscrollBehavior="none"
                    />
                    <Text position="absolute" mt="-30px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl" textShadow="2px 2px 4px white, -2px -2px 4px white">
                        Lipase
                    </Text>
                </VStack>}

            </Card>
          </Flex>


          {/* Tercera columna - Derecha */}
          <DerPurpleMessage gameText={gameText} urlLeft={"../FatDigestion/parte2"} urlRight={"../FatDigestion/parte4"}></DerPurpleMessage>

        </Grid>
      </Flex>
    </Box>
  );
};

export default Parte3FatDigestion;
