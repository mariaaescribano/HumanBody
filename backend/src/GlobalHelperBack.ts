import fs from 'fs';
import path from 'path';

export async function convertFileToBase64(file: Express.Multer.File): Promise<string> {
  try {
    return file.buffer.toString('base64');
  } catch (error) {
    throw new Error('Error converting file to base64');
  }
}

export async function crearYGuardarTxt(nombreArchivo: string, contenido: string): Promise<boolean> {
  try {
    const rutaArchivo = path.join(__dirname, '../../../../../usuariosFotos', `${nombreArchivo}.txt`);
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
