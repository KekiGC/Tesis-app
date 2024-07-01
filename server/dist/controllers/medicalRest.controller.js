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
exports.createMedicalRest = void 0;
const medicalRest_1 = __importDefault(require("../models/medicalRest"));
// crear un nuevo reporte medico
const createMedicalRest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, name, cedula, sintomas, fecha_reporte, diagnostico, fecha_inicio, fecha_fin } = req.body;
    if (!patientId || !name || !cedula || !sintomas || !fecha_reporte || !diagnostico || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }
    try {
        const newMedicalRest = new medicalRest_1.default({
            patientId,
            name,
            cedula,
            sintomas,
            fecha_reporte,
            diagnostico,
            fecha_inicio,
            fecha_fin,
        });
        const savedMedicalRest = yield newMedicalRest.save();
        return res.status(201).json(savedMedicalRest);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.createMedicalRest = createMedicalRest;
