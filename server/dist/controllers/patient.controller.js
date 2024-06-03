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
exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatient = exports.getPatients = void 0;
const patient_1 = __importDefault(require("../models/patient"));
const getPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield patient_1.default.find();
        return res.status(200).json(patients);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getPatients = getPatients;
const getPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'Please provide an id' });
    }
    try {
        const patient = yield patient_1.default.findById(id);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }
        return res.status(200).json(patient);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getPatient = getPatient;
const createPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, lastname, doctorId, profileImg, gender, phone, address, birthdate } = req.body;
    try {
        if (!email || !name || !lastname || !doctorId || !gender || !phone || !address || !birthdate) {
            return res.status(400).json({ msg: 'Please provide all fields' });
        }
        const patient = yield patient_1.default.findOne({ email });
        console.log(patient);
        if (patient) {
            return res.status(400).json({ msg: 'Patient already exists' });
        }
        const newPatient = new patient_1.default(req.body);
        const savedPatient = yield newPatient.save();
        return res.status(201).json(savedPatient);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.createPatient = createPatient;
const updatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPatient = yield patient_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        return res.status(200).json(updatedPatient);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error updating the patient information' });
    }
});
exports.updatePatient = updatePatient;
const deletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: 'Please provide an id' });
        }
        const deletedPatient = yield patient_1.default.findByIdAndDelete(id);
        if (!deletedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        return res.status(200).json(deletedPatient);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error deleting the patient' });
    }
});
exports.deletePatient = deletePatient;
