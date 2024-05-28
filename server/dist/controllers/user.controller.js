"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.deleteUser = exports.changePassword = exports.signIn = exports.signUp = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.default.jwtSecret, {
        expiresIn: 86400,
    });
}
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.name ||
            !req.body.lastname ||
            !req.body.email ||
            !req.body.password ||
            !req.body.username) {
            return res.status(400).json({
                msg: "Please send your name, lastname, email, username, and password",
            });
        }
        const user = yield user_1.default.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            return res.status(400).json({ msg: "The user already exists" });
        }
        const newUser = new user_1.default(req.body);
        yield newUser.save();
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        if ((!req.body.email && !req.body.username) || !req.body.password) {
            return res
                .status(400)
                .json({ msg: "Please send your email/username and password" });
        }
        let user;
        if (req.body.email) {
            user = yield user_1.default.findOne({ email: req.body.email });
        }
        else if (req.body.username) {
            user = yield user_1.default.findOne({ username: req.body.username });
        }
        if (!user) {
            return res.status(400).json({ msg: "The user does not exist" });
        }
        const isMatch = yield user.comparePassword(req.body.password);
        if (isMatch) {
            const token = createToken(user);
            const userID = user._id; // Obtener el userID del usuario
            return res.status(200).json({ token, userID });
        }
        return res.status(400).json({
            msg: "The email/username or password is incorrect",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.signIn = signIn;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({
            msg: "Please provide email, current password, and new password",
        });
    }
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: "Current password is incorrect" });
        }
        user.password = newPassword;
        yield user.save();
        return res.status(200).json({ msg: "Password changed successfully" });
    }
    catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.changePassword = changePassword;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ msg: "Please provide email" });
    }
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        yield user_1.default.findOneAndDelete({ email });
        return res.status(200).json({ msg: "User deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.deleteUser = deleteUser;
// obtener un usuario por su id
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
});
exports.getUserById = getUserById;
