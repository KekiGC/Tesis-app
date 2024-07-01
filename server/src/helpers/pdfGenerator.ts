import { jsPDF } from "jspdf";

export interface IMedicalRestPDFData {
    patientId: string;
    nombre_paciente: string;
    cedula_paciente: string;
    sintomas: string;
    fecha: Date;
    diagnostico: string;
    fecha_inicio: Date;
    fecha_final: Date;
}

export const createMedicalRestPDF = (data: IMedicalRestPDFData): Buffer => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("Courier", "bold");
    doc.text("SENIAT", 90, 10);
    doc.setFont("Courier", "normal");
    doc.text("BillMaster. C.A.", 78, 20);
    doc.text("billmaster calle 123", 68, 30);
    doc.text("Tierra Negra, Mcbo, Edo. Zulia", 53, 40);

    doc.setFontSize(13);
    doc.text("Fecha: " + data.fecha.toISOString().split('T')[0], 10, 50);
    doc.text("------------------ INFORMACION DEL PACIENTE ------------------", 10, 65);
    doc.text("NOMBRE DEL PACIENTE: " + data.nombre_paciente, 10, 75);
    doc.text("CEDULA: " + data.cedula_paciente, 10, 85);
    doc.text("SINTOMAS PRESENTADOS: " + data.sintomas, 10, 95);
    doc.text("Fecha Inicio de Reposo: " + data.fecha_inicio.toISOString().split('T')[0], 10, 105);
    doc.text("Fecha Finalización de Reposo: " + data.fecha_final.toISOString().split('T')[0], 10, 115);
    doc.text("Diagnóstico: " + data.diagnostico, 10, 125);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
};
