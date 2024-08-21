import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig";

// Función para subir una imagen
export const uploadImage = async (file: Express.Multer.File, folder: string): Promise<string> => {
    // Determina el tipo MIME según el archivo
    const mimeType = file.mimetype; // Ejemplo: 'image/jpeg', 'image/png'
    
    // Configura los metadatos, incluyendo el tipo MIME
    const metadata = {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000', // Opcional: Control de caché
    };
    
    // Crea una referencia en Firebase Storage
    const storageRef = ref(storage, `${folder}/${file.originalname}`);
    
    // Sube el archivo con los metadatos configurados
    await uploadBytes(storageRef, file.buffer, metadata);
    
    // Obtén la URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
};

