import * as fs  from 'fs';
import * as path from 'path';

export const pathACarpetaDeFotos = '../../../../usuariosFotos';

export async function convertFileToBase64(file: Express.Multer.File): Promise<string> {
  try {
    return file.buffer.toString('base64');
  } catch (error) {
    throw new Error('Error converting file to base64');
  }
}

export async function crearYGuardarTxt(nombreArchivo: string, contenido: string, soyMessage?:boolean): Promise<boolean> {
  try {
    let carpetaBase = pathACarpetaDeFotos; 
    if (soyMessage) {
      carpetaBase =  '../../../../messageFotos';
    }

    const rutaArchivo = path.join(__dirname, carpetaBase, `${nombreArchivo}.txt`);
    const dir = path.dirname(rutaArchivo);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }
    fs.writeFileSync(rutaArchivo, contenido, 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
  }
}

export async function descodeReturnFoto(nomFile: string, soyMessage?:boolean) {
  let carpetaBase = pathACarpetaDeFotos; 
  if (soyMessage) {
    carpetaBase =  '../../../../messageFotos';
  }
  const rutaArchivoBase64 = path.join(__dirname, carpetaBase, nomFile);
  const base64Data = fs.readFileSync(rutaArchivoBase64, 'utf8');
  return base64Data;
}

export async function cambiarNombreArchivo(rutaCarpeta: string, nombreViejo: string, nombreNuevo: string) {
  const ruta = path.join(__dirname, rutaCarpeta);
  try {
    const rutaVieja = path.join(ruta, nombreViejo+".txt");
    const rutaNueva = path.join(ruta, nombreNuevo+".txt");

    fs.renameSync(rutaVieja, rutaNueva);
  } catch (error) {
    console.error('Error al renombrar el archivo:', error);
  }
};


export function removeNameFromConcatenatedList(numbersConcatenated: string, numberToRemove: string): string {
  let numbersArray = numbersConcatenated.split("-").filter(num => num !== "");
  let result = "-";
  for (let i = 0; i < numbersArray.length; i++) {
    if (numbersArray[i] != numberToRemove) {
      if (result !== "-") {
        result += "-"; // Add separator only if it's not the first number
      }
      result += numbersArray[i];
    } 
  }
  const finalResult = result === "-" ? "" : result; // Ensure empty string if no numbers remain
  return finalResult;
}




// export function removeNameFromConcatenatedList(nombresConcatenados: string, nameToRemove: string): string[] {
//   let nombre = "";
//   let nombresArray: string[] = [];
  
//   for (let i = 0; i < nombresConcatenados.length; i++) {
//     const char = nombresConcatenados[i];
    
//     if (char === ",") {
//       if (nombre.trim()) { 
//         // Check if the current name is the one to remove
//         if (nombre.trim() !== nameToRemove) {
//           nombresArray.push(nombre.trim());
//         }
//       }
//       nombre = ""; // Reset the current name
//     } else {
//       nombre += char; // Build the name character by character
//     }
//   }

//   // Add the last name to the array (after the loop ends)
//   if (nombre.trim()) {
//     if (nombre.trim() !== nameToRemove) {
//       nombresArray.push(nombre.trim());
//     }
//   }

//   return nombresArray;
// }


export function convertirCadenaANumeros(cadena: any, caracter?:string)
{
  if(cadena)
  { 
    let caracterSimbolo = ",";
    if(caracter)
      caracterSimbolo= caracter;

    let numeros: number[] = [];
    let num = "";
  
    for (let i = 0; i < cadena.length; i++) {
      const caracter = cadena[i];
  
      // Si el carácter es una coma, significa que hemos llegado al final de un número
      if (caracter === caracterSimbolo) {
        // Convertimos el número temporal a un entero y lo agregamos al array
        if (num.trim() !== '') {  // Comprobamos que el número temporal no esté vacío
          const numero = parseInt(num, 10);
          if (!isNaN(numero)) {
            numeros.push(numero); // Solo agregamos si es un número válido
          } 
        }
        num = ""; // Reiniciamos el número temporal
      } else {
        // Si no es una coma, agregamos el carácter al número temporal
        num += caracter;
      }
    }
  
    // Después del ciclo, puede quedar un número pendiente al final
    if (num.trim() !== '') {
      const numero = parseInt(num, 10);
      if (!isNaN(numero)) {
        numeros.push(numero);
      }
    }
    return numeros;
  }  
  else
    throw new Error("Cadena de dias no llega a la función de conversión")
 
};


