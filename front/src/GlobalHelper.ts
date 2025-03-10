export const API_URL = "http://localhost:3001";
export const tryAgain = "Please, try again later";

export function StringIsNull(text:string)
{
  if(text == null || text == undefined || text === "" || text == "")
    return true;
  else
    return false;
};

export function ObjectIsNull(object:any)
{
  if(object == null || object == undefined)
    return true;
  else
    return false;
};

export function ArrayIsNull(array:any[])
{
  if(array == null || array == undefined || array.length == 0)
    return true;
  else
    return false;
};

export const redirigirSiNoHayUserNom = () => {
  const nom = sessionStorage.getItem("userNom");
  if (!nom) {
    location.href = `${window.location.origin}/login/login`;
  }
};


//////////// LISTAS  para pagina de registro //////////// 
export const exerciseFrequencyList = [
  { value: '0', label: 'No exercise' },
  { value: '1', label: '1-3 days of exercise' },
  { value: '2', label: '3-5 days of exercise' },
  { value: '3', label: '6-7 days of exercise' },
  { value: '4', label: 'Exercise every day' },
];
export const objectivesList = [
  { value: '0', label: 'Lose fat' },
  { value: '1', label: 'Gain muscle' },
  { value: '2', label: 'Maintain weight' },
];
//////////// END LISTAS  para pagina de registro //////////// 


// obtener día local
export async function getInternetDateParts() {
  try {
    const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
    const data = await response.json();
    const dateTime = new Date(data.datetime); // Convertir la fecha ISO a objeto Date

    const day = dateTime.getUTCDate(); // Día del mes (1-31)
    const month = dateTime.getUTCMonth() + 1; // Mes (0-11, sumamos 1)
    const year = dateTime.getUTCFullYear(); // Año (ej: 2025)

    return { day, month, year };
  } catch (error) {
    console.error("Error al obtener la fecha y hora de internet:", error);
    return null;
  }
}



// ICONOS PARA MACROS
import { FaAppleAlt, FaFish , FaSeedling } from 'react-icons/fa';
import { MdOilBarrel } from 'react-icons/md';
import { reciboSkeleton } from '../../backend/src/dto/recibos.dto';
import axios from 'axios';
export const ProteIcono = FaFish;
export const CarbIcono = FaAppleAlt;
export const FiberIcono = FaSeedling;

// COLORES
export const colorProte= '#610C04';
export const colorFats= '#abdefa';
export const colorCarbs= '#EDC9AF';
export const colorFibra= '#ffe5f0';





// crear recibo
export const crearRecibo = async (recibo: reciboSkeleton) => {
  try {
      const response = await axios.post(
          `${API_URL}/recibos/createRecibo`,
          recibo,
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          }
      );

      if (response.data) {
          return response.data.idRecibo;
      }
  } catch (error) {
      console.error('Error al crear el recibo:', error);
      throw new Error('Error al crear el recibo');
  }
};



  // coger datos del recibo

  export const dameDatosDelRecibo = async (idRecibo:number, setactualiza:any) =>
  {
    try{
      const response = await axios.get(
        `${API_URL}/recibos/recibo/${idRecibo}`,
        {
          headers: {
              'Content-Type': 'application/json'
          },
        }
      );
        if(response.data != null)
        {
          let recibo = response.data.recibo[0];
          let newRecibo : reciboSkeleton =
          {
            grasas:"0",
            monoinsaturadas:"0",
            poliinsaturadas:"0",
            saturadas:"0",
            prote:"0",
            incompleto:"0",
            completo:"0",
            carbs:"0",
            complejos:"0",
            simples:"0",
            fibra:"0"
          };

          if (recibo.grasas !== "") newRecibo.grasas = recibo.grasas;
          if (recibo.monoinsaturadas !== "") newRecibo.monoinsaturadas = recibo.monoinsaturadas;
          if (recibo.poliinsaturadas !== "") newRecibo.poliinsaturadas = recibo.poliinsaturadas;
          if (recibo.saturadas !== "") newRecibo.saturadas = recibo.saturadas;
          if (recibo.prote !== "") newRecibo.prote = recibo.prote;
          if (recibo.incompleto !== "") newRecibo.incompleto = recibo.incompleto;
          if (recibo.completo !== "") newRecibo.completo = recibo.completo;
          if (recibo.carbs !== "") newRecibo.carbs = recibo.carbs;
          if (recibo.complejos !== "") newRecibo.complejos = recibo.complejos;
          if (recibo.simples !== "") newRecibo.simples = recibo.simples;
          if (recibo.fibra !== "") newRecibo.fibra = recibo.fibra;

          setactualiza(newRecibo);
        }
      }
      catch (error) {
      console.error('Error fetching data:', error);
      }
  };



export const esSoloNumeros = (cadena: string): boolean => {
  // Verifica si la cadena contiene solo números y no tiene letras
  return /^\d+$/.test(cadena.trim()) && !/[a-zA-Z]/.test(cadena.trim());
};



export const calcularPorcentajes = (numeros: number[]) => {
  const sumaTotal = numeros.reduce((acc, num) => acc + num, 0); // Sumar todos los números
  const porcentajes = numeros.map(num => (num / sumaTotal) * 100); // Calcular el porcentaje de cada número
  //const porcentajes = numeros.map(num => Math.round((num / sumaTotal) * 100).toFixed(0));
  return porcentajes;
};


export const formatDateToISOFriendly = (dateString: string) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [year, month, day] = dateString.split("-");

  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
}



export const sumaDeMacros =  (reciboPersonalizado:reciboSkeleton, reciboHoy:reciboSkeleton) =>
{
  let grasasSuma = convierteNumRedondeado(reciboPersonalizado.grasas) + convierteNumRedondeado(reciboHoy.grasas);
  let monoinsaturadasSuma = convierteNumRedondeado(reciboPersonalizado.monoinsaturadas) + convierteNumRedondeado(reciboHoy.monoinsaturadas);
  let saturadasSuma = convierteNumRedondeado(reciboPersonalizado.saturadas) + convierteNumRedondeado(reciboHoy.saturadas);
  let poliinsaturadasSuma = convierteNumRedondeado(reciboPersonalizado.poliinsaturadas) + convierteNumRedondeado(reciboHoy.poliinsaturadas);
  let proteSuma = convierteNumRedondeado(reciboPersonalizado.prote) + convierteNumRedondeado(reciboHoy.prote);
  let incompletoSuma = convierteNumRedondeado(reciboPersonalizado.incompleto) + convierteNumRedondeado(reciboHoy.incompleto);
  let completoSuma = convierteNumRedondeado(reciboPersonalizado.completo) + convierteNumRedondeado(reciboHoy.completo);
  let carbsSuma = convierteNumRedondeado(reciboPersonalizado.carbs) + convierteNumRedondeado(reciboHoy.carbs);
  let complejosSuma = convierteNumRedondeado(reciboPersonalizado.complejos) + convierteNumRedondeado(reciboHoy.complejos);
  let simplesSuma = convierteNumRedondeado(reciboPersonalizado.simples) + convierteNumRedondeado(reciboHoy.simples);
  let fibraSuma = convierteNumRedondeado(reciboPersonalizado.fibra) + convierteNumRedondeado(reciboHoy.fibra);

  let newRecibo : reciboSkeleton =
  {
    grasas:grasasSuma.toString(),
    monoinsaturadas:monoinsaturadasSuma.toString(),
    poliinsaturadas:poliinsaturadasSuma.toString(),
    saturadas:saturadasSuma.toString(),
    prote:proteSuma.toString(),
    incompleto:incompletoSuma.toString(),
    completo:completoSuma.toString(),
    carbs:carbsSuma.toString(),
    complejos:complejosSuma.toString(),
    simples:simplesSuma.toString(),
    fibra:fibraSuma.toString()
  };

  return newRecibo;
};



export const getFecha = async () => {
  const madridDate = new Date().toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Convertimos la fecha a formato "DD-MM-YYYY"
  const [day, month, year] = madridDate.split('/');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};




export const calcularPorcentaje = (parte:number, total:number) => {
  return total > 0 ? (parte / total) * 100 : 0;
};






export const convierteNumRedondeado = (texto:string) =>
{
  let num = Math.round(parseInt(texto, 10));
  return num;
}


export function EscribirTextoDinamico(
    text: string,
    setText: any, // actualiza el texto
    setIndex: any, // actualiza el indice del texto
    index: number, // para saber por donde vamos
    orden: any,
    setorden: any
)
{
    // Timer to add the next character
    const timer = setTimeout(() => 
    {
      if (index < text.length) 
      {
        setText((prev: string) => prev + text[index]);
        setIndex((prev: number) => prev + 1);
      }
    }, 50); // Typing speed in milliseconds

    if( index == text.length && orden == 0)
    {
      setorden(1);
      setIndex(0);
    }

    // Cleanup the timer
    return () => clearTimeout(timer);
};


export function getTamanyoPantalla(setScreenSize:any)
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
  updateScreenSize();
};










//////////////////// KEY MOVEMENT ///////////////////////////
export function moveWithKey(e:any, setMoving:any, setDirection:any)
{
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

export function stopMoveWithKey(e:any, setMoving:any)
{
  if (
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown"
  ) {
    setMoving(false);
  }
};

export function putDefaultKeys(handleKeyDown:any, handleKeyUp:any)
{
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // se ejecuta cuando es desmontado o si efecto se vuelve a ejecutar
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
};

export function moveWithKeyBucle(moving:boolean, setPosition:any, direction:string)
{
  let interval: any;
  if (moving) {
    interval = setInterval(() => {
      setPosition((prev:any) => {
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
};
//////////////////// END KEY MOVEMENT ///////////////////////////



export function limitarPosi(maxX:number, maxY:number, xPercentage:number, yPercentage:number) 
{
  // Limitar la posición para que no se salga del contenedor
  const minX = 0;   // 0% para el margen izquierdo
  const minY = 0;   // 0% para el margen superior

  const restrictedX = Math.min(Math.max(xPercentage, minX), maxX);  // Restricción en el eje X
  const restrictedY = Math.min(Math.max(yPercentage, minY), maxY);  // Restricción en el eje Y

  return({restrictedX, restrictedY});
};




//////////////////// MOVIL MOVEMENT ///////////////////////////
export function handleTouchStartGlobalHelper(e:any, isTouching:any)
{
  e.preventDefault(); // Prevenir el desplazamiento de la página
  isTouching.current = true;
};

// Función para manejar el movimiento del dedo
export function handleTouchMoveGlobalHelper(e: any, containerRef: any, maxX:number, maxY:number, setPosition:any) 
{
  if (containerRef.current) 
  {
    e.preventDefault();
    const container = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0]; // Primer toque

    // Coordenadas relativas al contenedor
    const relativeX = touch.clientX - container.left;
    const relativeY = touch.clientY - container.top;
    
    // Convierte coordenadas relativas en porcentaje con respecto al tamaño del contenedor
    const xPercentage = (relativeX / container.width) * 100;
    const yPercentage = (relativeY / container.height) * 100;

    let posiConLimite = limitarPosi(maxX, maxY, xPercentage, yPercentage);
    setPosition({x: posiConLimite.restrictedX, y: posiConLimite.restrictedY});
    return ({x: posiConLimite.restrictedX, y: posiConLimite.restrictedY});
  }
};

// Función para manejar el fin del toque
export function handleTouchEndGlobalHelper(isTouching:any) 
{
  isTouching.current = false; // Finaliza el toque
};

//////////////////// END MOVIL MOVEMENT ///////////////////////////



//////////////////// MOUSE MOVEMENT ///////////////////////////

export function getRelativePosition(clientX: number, clientY: number, container: DOMRect)
{
  const relativeX = clientX - container.left;
  const relativeY = clientY - container.top;

  const xPercentage = (relativeX / container.width) * 100;
  const yPercentage = (relativeY / container.height) * 100;

  return { x: xPercentage, y: yPercentage };
};


export function handleMouseStartGlobalHelper(e:any, isInteracting:any, container: any, setPosition:any)
{
  e.preventDefault();
  isInteracting.current = true;
  const cont = container.current.getBoundingClientRect();
 
  if (!cont) return;

  const { clientX, clientY } = e;
  const { x, y } = getRelativePosition(clientX, clientY, cont);
  setPosition({ x, y });
};



export function handleMoveMouse(e:any, isInteracting:any, container: any, setPosition:any)
{
   if (!isInteracting.current) return;
  
   const cont = container.current.getBoundingClientRect();
    if (!cont) return;

    const { clientX, clientY } = e;
    const { x, y } = getRelativePosition(clientX, clientY, cont);

    // // Limitar la posición para que no se salga del contenedor
    const maxX = 80; // 100% del ancho del contenedor
    const maxY = 80; // 100% del alto del contenedor
    const minX = 0;   // 0% para el margen izquierdo
    const minY = 0;   // 0% para el margen superior

    const restrictedX = Math.min(Math.max(x, minX), maxX);  // Restricción en el eje X
    const restrictedY = Math.min(Math.max(y, minY), maxY);  // Restricción en el eje Y
    setPosition({ x: restrictedX, y: restrictedY });
    return ({ x: restrictedX, y: restrictedY });
 
};

export function handleMouseEndGlobalHelper(isInteracting:any) 
{
  isInteracting.current = false; // Finaliza el toque
};

