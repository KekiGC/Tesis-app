"use strict";
// server/src/helpers/pdfGenerator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarPDF = void 0;
const jspdf_1 = require("jspdf");
const generarPDF = (data) => {
    const { patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final } = data;
    const doc = new jspdf_1.jsPDF();
    doc.setFontSize(16);
    doc.setFont("Courier", "bold");
    doc.text("SENIAT", 90, 10);
    doc.setFont("Courier", "normal");
    doc.text("BillMaster. C.A.", 78, 20);
    doc.text("billmaster calle 123", 68, 30);
    doc.text("Tierra Negra, Mcbo, Edo. Zulia", 53, 40);
    doc.setFontSize(13);
    doc.text("Fecha: " + fecha, 10, 50);
    doc.text("------------------ INFORMACION DEL PACIENTE ------------------", 10, 65);
    doc.text("NOMBRE DEL PACIENTE: " + nombre_paciente, 10, 75);
    doc.text("CEDULA: " + cedula_paciente, 10, 85);
    doc.text("SINTOMAS PRESENTADOS: " + sintomas, 10, 95);
    doc.text("Diagnóstico: " + diagnostico, 10, 105);
    doc.text("Fecha Inicio de Reposo: " + fecha_inicio, 10, 115);
    doc.text("Fecha Finalización de Reposo: " + fecha_final, 10, 125);
    // Convertir el PDF a un Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
};
exports.generarPDF = generarPDF;
