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

export async function crearYGuardarTxt(nombreArchivo: string, contenido: string): Promise<boolean> {
  try {
    const rutaArchivo = path.join(__dirname, pathACarpetaDeFotos, `${nombreArchivo}.txt`);
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

export async function descodeReturnFoto(nomFile: string) {
  const rutaArchivoBase64 = path.join(__dirname, pathACarpetaDeFotos, nomFile);
  const base64Data = fs.readFileSync(rutaArchivoBase64, 'utf8');
  return base64Data;
}

export async function cambiarNombreArchivo(rutaCarpeta: string, nombreViejo: string, nombreNuevo: string) {
  const ruta = path.join(__dirname, rutaCarpeta);
  try {
    const rutaVieja = path.join(ruta, nombreViejo);
    const rutaNueva = path.join(ruta, nombreNuevo);

    fs.renameSync(rutaVieja, rutaNueva);
    console.log(`Archivo renombrado de ${nombreViejo} a ${nombreNuevo}`);
  } catch (error) {
    console.error('Error al renombrar el archivo:', error);
  }
};

export function removeNameFromConcatenatedList(nombresConcatenados: string, nameToRemove: string): string[] {
  let nombre = "";
  let nombresArray: string[] = [];
  
  for (let i = 0; i < nombresConcatenados.length; i++) {
    const char = nombresConcatenados[i];
    
    if (char === ",") {
      if (nombre.trim()) { 
        // Check if the current name is the one to remove
        console.log("liminando", nombre.trim(), nameToRemove)
        if (nombre.trim() !== nameToRemove) {
          nombresArray.push(nombre.trim());
        }
      }
      nombre = ""; // Reset the current name
    } else {
      nombre += char; // Build the name character by character
    }
  }

  // Add the last name to the array (after the loop ends)
  if (nombre.trim()) {
    if (nombre.trim() !== nameToRemove) {
      nombresArray.push(nombre.trim());
    }
  }

  return nombresArray;
}


