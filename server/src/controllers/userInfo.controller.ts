import { Request, Response } from 'express';
import UserInfo from '../models/userInfo';
import { uploadImage } from '../services/uploadFile.service';

// agregar la informacion del usuario
export const createUserInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user, telefono, especialidad, direccion, cedula, inscripcionCM, registro, firma } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!user || !cedula || !inscripcionCM || !registro) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newUserInfo = new UserInfo({
      user,
      especialidad,
      telefono,
      direccion,
      cedula,
      inscripcionCM,
      registro,
    });

    if (req.file) {
      const file = req.file as Express.Multer.File;
      newUserInfo.firma = await uploadImage(file, 'firmas');
    }

    await newUserInfo.save();

    return res.status(201).json(newUserInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// Obtener la informacion del usuario por ID
export const getUserInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const userInfo = await UserInfo.findOne({ user: userId });

    if (!userInfo) {
      return res.status(404).json({ msg: 'User info not found' });
    }

    return res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// Actualizar la informacion del usuario
export const updateUserInfo = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params; // Obtener el ID del usuario desde los parámetros

  try {
    let firmaUrl = null;

    // Verificar si el archivo de la firma fue enviado en la solicitud
    if (req.file) {
      console.log('Archivo recibido:', req.file.originalname);  // Verificar que el archivo fue recibido
      // Subir la nueva firma a Firebase
      firmaUrl = await uploadImage(req.file, 'firmas');  // Cambia 'firmas' por la carpeta en la que deseas guardar las firmas
      console.log('Firma subida a Firebase:', firmaUrl);  // Verificar que la firma fue subida
    } else {
      console.log('No se recibió ningún archivo.');
    }

    // Buscar la información del usuario por ID y actualizar los campos proporcionados
    const updatedUserInfo = await UserInfo.findOneAndUpdate(
      { user: userId },
      {
        ...(req.body.especialidad && { especialidad: req.body.especialidad }),
        ...(req.body.telefono && { telefono: req.body.telefono }),
        ...(req.body.direccion && { direccion: req.body.direccion }),
        ...(req.body.cedula && { cedula: req.body.cedula }),
        ...(req.body.inscripcionCM && { inscripcionCM: req.body.inscripcionCM }),
        ...(req.body.registro && { registro: req.body.registro }),
        ...(firmaUrl && { firma: firmaUrl }), // Si se subió una nueva firma, se actualiza
      },
      { new: true } // Para devolver el documento actualizado
    );

    if (!updatedUserInfo) {
      return res.status(404).json({ msg: 'User info not found' });
    }

    return res.status(200).json(updatedUserInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};