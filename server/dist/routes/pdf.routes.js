"use strict";
// server/src/routes/pdf.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdfcreator_controller_1 = require("../controllers/pdfcreator.controller");
const router = express_1.default.Router();
router.post('/createPDF', pdfcreator_controller_1.PdfcreatorController.createMedicalRestPDF);
exports.default = router;
