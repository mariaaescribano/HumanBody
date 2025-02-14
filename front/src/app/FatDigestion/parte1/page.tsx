'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, Box, Text, Flex, Grid, VStack, Button, HStack } from '@chakra-ui/react';
import Boca from '../../../../public/FatDigestion/Boca.jpg';
import LeftRightButtons from '@/components/global/old/LeftRightButtons';
import PopUpMessage from '@/components/global/PopUpMessage';
import IzqPurpleMessage from '@/components/global/old/IzqPurpleMessage';
import DerPurpleMessage from '@/components/global/DerPurpleMessage';
import BarnerMorado from '@/components/global/BarnerMorado';

const Parte1FatDigestion = () => 
{
  const [position, setPosition] = useState({ x: 40, y: 22 }); // Coordenadas del punto
  const [moving, setMoving] = useState(false);
  const [direction, setDirection] = useState("right");
  const [fin, setFin] = useState(false);
  const [screenSize, setScreenSize] = useState("sm");


  const llegoAlFinal = () =>
  {
    console.log("hola", position)
    if(screenSize == "xl")
    {
      if(position.x > 45 && position.x < 72
        && position.y >65 && position.y< 73)
        {
          setFin(true);
        }
    }
    else
    {
      if(position.x >= 45 && position.x <= 66
        && position.y >= 66 && position.y<= 73)
        {
          setFin(true);
        }
    }
   
  };

  useEffect(() => 
  {
    const mediaQueryXL = window.matchMedia("(min-width: 1200px)");
    const mediaQueryMD = window.matchMedia("(min-width: 768px) and (max-width: 1199px)");
    const mediaQuerySM = window.matchMedia("(max-width: 767px)");

    const updateScreenSize = () => 
    {
      if (mediaQueryXL.matches) 
      {
        setScreenSize("xl");
      } else if (mediaQueryMD.matches) {
        setScreenSize("md");
      } else if (mediaQuerySM.matches) {
        setScreenSize("sm");
      }
    };

    updateScreenSize(); // Configura el tamaño al iniciar
  }, []);




  // KEY: movimiento bolus

  const handleKeyDown = (e: {preventDefault: any; key: string; }) => 
  {
   // if(position.x )
    if (e.key === "ArrowRight") {
      e.preventDefault(); // Prevenir el desplazamiento
      setMoving(true);
      setDirection("right");
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setMoving(true);
      setDirection("left");
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setMoving(true);
      setDirection("up");
    }
    if (e.key === "ArrowDown") {
       e.preventDefault();
      setMoving(true);
      setDirection("down");
    }
  };

  const handleKeyUp = (e: { key: string }) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      setMoving(false);
    }
  };

  useEffect(() => 
  {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // se ejecuta cuando es desmontado o si efecto se vuelve a ejecutar
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Actualiza la posición mientras se está moviendo
  useEffect(() => {
    let interval: any;
    if (moving) {
      llegoAlFinal();
      interval = setInterval(() => {
        setPosition((prev) => {
          switch (direction) {
            case "right":
              return { ...prev, x: prev.x + 1 };
            case "left":
              return { ...prev, x: prev.x - 1 };
            case "up":
              return { ...prev, y: prev.y - 1 };
            case "down":
              return { ...prev, y: prev.y + 1 };
            default:
              return prev;
          }
        });
      }, 50);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [moving, direction]);





  // MOVIL: movimiento bolus con movil
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouching = useRef(false); // Para controlar si el usuario sigue tocando

  // Función para manejar el inicio del toque
  const handleTouchStart = (e: {TouchEvent:any, preventDefault:any}) => 
  {
    e.preventDefault(); // Prevenir el desplazamiento de la página
    isTouching.current = true;
  };

  // Función para manejar el movimiento del dedo
  const handleTouchMove = (e: React.TouchEvent) => 
  {
    e.preventDefault();
    if (containerRef.current) 
    {
      const container = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0]; // Primer toque

      // Coordenadas relativas al contenedor
      const relativeX = touch.clientX - container.left;
      const relativeY = touch.clientY - container.top;
      
      // Convierte coordenadas relativas en porcentaje con respecto al tamaño del contenedor
      const xPercentage = (relativeX / container.width) * 100;
      const yPercentage = (relativeY / container.height) * 100;
    
      setPosition({ x: xPercentage, y: yPercentage });
      llegoAlFinal();
    }
  };

  // Función para manejar el fin del toque
  const handleTouchEnd = () => 
  {
    isTouching.current = false; // Finaliza el toque
  };





  // MOUSE: movimiento bolus
  const isInteracting = useRef(false); // Controla si el usuario está interactuando

  // Función común para obtener las coordenadas relativas
  const getRelativePosition = (
    clientX: number,
    clientY: number,
    container: DOMRect
  ) => {
    const relativeX = clientX - container.left;
    const relativeY = clientY - container.top;

    const xPercentage = (relativeX / container.width) * 100;
    const yPercentage = (relativeY / container.height) * 100;

    return { x: xPercentage, y: yPercentage };
  };

  // Manejar inicio del clic
  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isInteracting.current = true;
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    const { clientX, clientY } = e;
    const { x, y } = getRelativePosition(clientX, clientY, container);
    setPosition({ x, y });
    
  };

  // Manejar movimiento del ratón
  const handleMove = (e: React.MouseEvent) => {
    if (!isInteracting.current) return;
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    const { clientX, clientY } = e;
    const { x, y } = getRelativePosition(clientX, clientY, container);
    setPosition({ x, y });
    console.log({ x, y })
    llegoAlFinal();
    
  };

  // Finalizar la interacción
  const handleEnd = () => {
    isInteracting.current = false;
  };





  // textos
  const textScience = "When we eat, Enzymes in our mouth begin breaking down the food. The partially broken-down food is then transported to our stomach, where Gastric Lipase continues the process of digestion.";
  const textGame = "Move the bolus until the stomach.";

  const [scienceText, setscienceText] = useState(""); // State for visible text
  const [gameText, setgameText] = useState(""); // State for visible text
  const [index, setIndex] = useState(0); // Tracks the current letter
  const [orden, setorden] = useState(0); // Tracks the current letter

  useEffect(() => 
  {
    let text = "";
    if(orden == 0)
    {
      text = textScience;
    }
    else
    {
      text = textGame;
    }

    // Timer to add the next character
    const timer = setTimeout(() => 
    {
      if (index < text.length) 
      {
        if(orden == 0)
        {
          setscienceText((prev) => prev + text[index]);
        }
        else if(orden == 1)
        {
          setgameText((prev) => prev + text[index]);
        }
        setIndex((prev) => prev + 1);
      }
    }, 50); // Typing speed in milliseconds

    if( index == text.length && orden == 0)
    {
      setorden(1);
      setIndex(0);
    }


    // Cleanup the timer
    return () => clearTimeout(timer);
  
  }, [index, orden]);



  return (

    <Box pt={{ base: '20px', md: '20px', xl: '20px' }}>
    
      {/* Barner morado*/}
      <BarnerMorado title={'HUMAN BODY: FAT DIGESTION I'}></BarnerMorado>

      <Flex
        direction="row"
        width="100%"
        p="30px"
        mt="-10px"
        justifyContent="center" // Centra el contenedor general
        alignItems="center"
      >
        {fin == true && <PopUpMessage title={"Discover what happens next..."} texto={"Discover what the Bile does in our duodenum."}
        but1={"GO!"} but2={"Bolus..?" } url1={"../FatDigestion/parte2"} url2={""} />}

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
              h="600px"
              borderRadius="20px"
              boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
              style={{
                backgroundImage: `url(${Boca.src})`,
                backgroundSize: "cover", // Hace que la imagen cubra todo el área
                backgroundPosition: "center", // Centra la imagen en el card
                backgroundRepeat: "no-repeat", // Evita que la imagen se repita
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
              <Box
                w="100%"
                h="100%"
                position="relative"
                borderRadius="10px"
                overflow="hidden"
              >
                {/* Elemento flotante */}
                <VStack>
                  <Box
                    position="absolute"
                    top={`${position.y}%`}
                    left={`${position.x}%`}
                    w="10px"
                    h="10px"
                    bg="blue"
                    borderRadius="50%"
                  />
                  <Text position="absolute" color="blue" top={`${position.y + 2}%`} left={`${position.x}%`} fontFamily="Times New Roman, serif">
                    Bolus</Text>
                </VStack>  
              </Box>
            </Card>
          </Flex>

          {/* Tercera columna - Derecha */}
          <DerPurpleMessage gameText={gameText} urlLeft={''} urlRight={"../FatDigestion/parte2"}></DerPurpleMessage>

        </Grid>
      </Flex>
    </Box>
  );
};

export default Parte1FatDigestion;
