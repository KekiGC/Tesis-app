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
exports.deleteMedicalRecord = exports.updateMedicalRecord = exports.createMedicalRecord = exports.getMedicalRecords = void 0;
const medicalRecord_1 = __importDefault(require("../models/medicalRecord"));
// obtener las historias clinicas de un paciente por su id
const getMedicalRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'Please provide an id' });
    }
    try {
        const medicalRecords = yield medicalRecord_1.default.find({ patientId: id });
        return res.status(200).json(medicalRecords);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getMedicalRecords = getMedicalRecords;
// obtener una historia clinica por su id
// export const getMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(400).json({ msg: 'Please provide an id' });
//   }
//   try {
//     const medicalRecord = await MedicalRecord.findById(id);
//     if (!medicalRecord) {
//       return res.status(404).json({ msg: 'Medical record not found' });
//     }
//     return res.status(200).json(medicalRecord);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: 'Internal server error' });
//   }
// };
// crear una historia clinica de un paciente
const createMedicalRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, observaciones, ant_personales, ant_familiares, alergias, vacunas, medicamentos, enf_cronicas, empresa, grupoSanguineo } = req.body;
    try {
        if (!patientId) {
            return res.status(400).json({ msg: 'Please provide the patient id' });
        }
        const newMedicalRecord = new medicalRecord_1.default(req.body);
        const savedMedicalRecord = yield newMedicalRecord.save();
        return res.status(201).json(savedMedicalRecord);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.createMedicalRecord = createMedicalRecord;
const updateMedicalRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedMedicalHistory = yield medicalRecord_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMedicalHistory) {
            return res.status(404).json({ error: 'Medical Record not found' });
        }
        return res.status(200).json(updatedMedicalHistory);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error updating the medical record' });
    }
});
exports.updateMedicalRecord = updateMedicalRecord;
const deleteMedicalRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedMedicalRecord = yield medicalRecord_1.default.findByIdAndDelete(id);
        if (!deletedMedicalRecord) {
            return res.status(404).json({ error: 'Medical Record not found' });
        }
        return res.status(200).json({ msg: 'Medical Record deleted' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error deleting the medical record' });
    }
});
exports.deleteMedicalRecord = deleteMedicalRecord;
