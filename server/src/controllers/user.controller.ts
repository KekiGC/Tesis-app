import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: 86400,
  });
}

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (
      !req.body.name ||
      !req.body.lastname ||
      !req.body.email ||
      !req.body.password ||
      !req.body.username
    ) {
      return res.status(400).json({
        msg: "Please send your name, lastname, email, username, and password",
      });
    }

    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      return res.status(400).json({ msg: "The user already exists" });
    }

    const newUser = new User(req.body);
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
