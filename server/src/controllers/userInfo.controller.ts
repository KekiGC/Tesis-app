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
  try {
    const { userId } = req.params;
    const updatedUserInfo = await UserInfo.findOneAndUpdate({ user: userId }, req.body, { new: true });

    if (!updatedUserInfo) {
      return res.status(404).json({ msg: 'User info not found' });
    }

    return res.status(200).json(updatedUserInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};