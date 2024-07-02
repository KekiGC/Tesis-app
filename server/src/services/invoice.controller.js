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
exports.getInvoice = exports.getInvoices = exports.createInvoice = void 0;
const invoice_1 = __importDefault(require("../models/invoice"));
const counter_1 = __importDefault(require("../models/counter"));
// crear factura
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, doctorId, fecha, nombre_razon, dir_fiscal, rif, forma_pago, contacto, nombre_paciente, cedula_paciente, descripcion_servicio, total, } = req.body;
    try {
        // Obtener el siguiente número de control
        const counter = yield counter_1.default.findOneAndUpdate({ id: 'invoiceControl' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const numero_control = counter ? counter.seq : 1;
        const newInvoice = new invoice_1.default({
            patientId,
            doctorId,
            fecha,
            numero_control,
            nombre_razon,
            dir_fiscal,
            rif,
            forma_pago,
            contacto,
            nombre_paciente,
            cedula_paciente,
            descripcion_servicio,
            total,
        });
        const savedInvoice = yield newInvoice.save();
        return res.status(201).json(savedInvoice);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.createInvoice = createInvoice;
// obtener facturas
const getInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield invoice_1.default.find();
        return res.status(200).json(invoices);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getInvoices = getInvoices;
// obtener factura por id
const getInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield invoice_1.default.findById(req.params.id);
        return res.status(200).json(invoice);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getInvoice = getInvoice;
