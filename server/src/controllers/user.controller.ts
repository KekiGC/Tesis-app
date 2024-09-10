import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { sendEmail } from "../services/emailService";
import { uploadImage } from "../services/uploadFile.service";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: 86400,
  });
}

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  
  const { name, lastname, email, password, username } = req.body;
  try {
    if (!name || !lastname || !email || !password || !username) {
      return res.status(400).json({
        msg: "Please send your name, lastname, email, username, and password",
      });
    }

    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return res.status(400).json({ msg: "The user already exists" });
    }

    const newUser = new User(req.body);
    if (req.file) {
      const imageUrl = await uploadImage(req.file, "profileImages");
      newUser.profileImg = imageUrl; // Asigna la URL de la imagen al usuario
    }
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    if ((!req.body.email && !req.body.username) || !req.body.password) {
      return res
        .status(400)
        .json({ msg: "Please send your email/username and password" });
    }

    let user;
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    } else if (req.body.username) {
      user = await User.findOne({ username: req.body.username });
    }

    if (!user) {
      return res.status(400).json({ msg: "The user does not exist" });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const token = createToken(user);
      const userID = user._id; // Obtener el userID del usuario
      return res.status(200).json({ token, userID });
    }

    return res.status(400).json({
      msg: "The email/username or password is incorrect",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({
      msg: "Please provide email, current password, and new password",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ msg: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Por favor, proporciona un correo electrónico' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'El usuario con ese correo electrónico no existe' });
    }

    // Generar un token de restablecimiento
    const resetToken = randomBytes(32).toString('hex');

    // Hashear el token usando bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(resetToken, salt);

    // Establecer el token y su expiración en el usuario
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora de expiración

    await user.save();

    // Crear el enlace de restablecimiento
    const resetUrl = `https://${req.headers.host}/reset-password/${resetToken}`;

    // Contenido del correo electrónico
    const emailContent = `Usted ha solicitado restablecer su contraseña.\n\n
    Haga clic en el siguiente enlace para completar el proceso:\n\n
    ${resetUrl}\n\n
    Si no solicitó esto, ignore este correo electrónico y su contraseña permanecerá sin cambios.\n`;

    // Enviar el correo electrónico
    await sendEmail(user.email, 'Restablecimiento de contraseña', emailContent);

    return res.status(200).json({ msg: 'Correo electrónico de restablecimiento de contraseña enviado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error al procesar la solicitud' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ msg: 'Las contraseñas no son iguales.' });
  }

  try {
    // Buscar al usuario por el token hasheado
    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() }
  });

    if (!user) {
      return res.status(400).json({ msg: 'no se encontro el usuario' });
    }

    // Verificar el token proporcionado contra el hash almacenado
    const isMatch = await bcrypt.compare(token, user.resetPasswordToken!);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Token inválido o ha expirado' });
    }

    // Establecer la nueva contraseña
    user.password = password;
    

    // Limpiar el token y su expiración
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ msg: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error al restablecer la contraseña' });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Please provide email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    await User.findOneAndDelete({ email });

    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// obtener un usuario por su id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

// función para editar un usuario
export const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;  // Obtener el ID del usuario desde los parámetros
  const { username, name, lastname } = req.body; // Desestructurar los campos a actualizar

  try {
    let profileImgUrl = null;

    // Verificar si el archivo de imagen fue enviado en la solicitud
    if (req.file) {
      console.log('Archivo recibido:', req.file.originalname);  // Verificar que el archivo fue recibido
      // Subir la nueva imagen de perfil a Firebase
      profileImgUrl = await uploadImage(req.file, 'profileImages');
      console.log('Imagen subida a Firebase:', profileImgUrl);  // Verificar que la imagen fue subida
    } else {
      console.log('No se recibió ningún archivo.');
    }

    // Buscar el usuario por ID y actualizar los campos proporcionados
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(username && { username }), // Si se proporciona un nuevo username, se actualiza
        ...(name && { name }), 
        ...(lastname && { lastname }), 
        ...(profileImgUrl && { profileImg: profileImgUrl }), // Si se subió una nueva imagen, se actualiza
      },
      { new: true } // Para devolver el documento actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

export const getUserProfileImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "Please provide a user ID" });
    }

    const user = await User.findById(userId).select("profileImg");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Devuelve la URL de la imagen de perfil
    return res.status(200).json({ profileImg: user.profileImg });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// export const uploadProfileImg = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ msg: 'Please provide an image' });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     if (req.file) {
//       const profileImg = await uploadImage(req.file, 'profile-images');
//       user.profileImg = profileImg;
//       await user.save();
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: 'Internal server error' });
//   }
// };