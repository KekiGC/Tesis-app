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
exports.deleteAppointment = exports.updateAppointment = exports.createAppointment = exports.getAppointment = exports.getAppointments = void 0;
const appointment_1 = __importDefault(require("../models/appointment"));
const patient_1 = __importDefault(require("../models/patient"));
const user_1 = __importDefault(require("../models/user"));
const emailService_1 = require("../services/emailService");
// obtener las citas de un paciente por su id
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId } = req.params;
    if (!patientId) {
        return res.status(400).json({ msg: 'Please provide an id' });
    }
    try {
        const appointments = yield appointment_1.default.find({ patientId: patientId }).sort({ createdAt: -1 }).exec();
        return res.status(200).json(appointments);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getAppointments = getAppointments;
// obtener una cita por su id
const getAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'Please provide an id' });
    }
    try {
        const appointment = yield appointment_1.default.findById(id).exec();
        return res.status(200).json(appointment);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getAppointment = getAppointment;
// crear una nueva cita
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, doctorId, date, time, motive } = req.body;
    if (!patientId || !doctorId || !date || !time || !motive) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }
    try {
        const newAppointment = new appointment_1.default({
            patientId,
            doctorId,
            date,
            time,
            motive,
        });
        const savedAppointment = yield newAppointment.save();
        // fetch patient and doctor information
        const patient = yield patient_1.default.findById(patientId).exec();
        const doctor = yield user_1.default.findById(doctorId).exec();
        // send email to patient and doctor
        if (patient && doctor) {
            const emailSubject = 'Nueva cita médica';
            const emailText = `Hola ${patient.name},\n\nSe ha agendado una nueva cita con el doctor ${doctor.name} para el ${date} a las ${time}.\n\nMotivo: ${motive}\n\nSaludos,\nEquipo de salud`;
            yield (0, emailService_1.sendEmail)(patient.email, emailSubject, emailText);
            yield (0, emailService_1.sendEmail)(doctor.email, emailSubject, emailText);
        }
        return res.status(201).json(savedAppointment);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.createAppointment = createAppointment;
// actualizar una cita
const updateAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, date, time, motive } = req.body;
    try {
        const updatedAppointment = yield appointment_1.default.findByIdAndUpdate(id, { status, date, time, motive }, { new: true }).exec();
        return res.status(200).json(updatedAppointment);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.updateAppointment = updateAppointment;
// eliminar una cita
const deleteAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield appointment_1.default.findByIdAndDelete(id).exec();
        return res.status(204).json();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.deleteAppointment = deleteAppointment;
