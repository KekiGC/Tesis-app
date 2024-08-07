import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';



interface DatosMedicos {
    nombrePaciente: string;
    cedulaPaciente: string;
    sintomas: string;
    fecha: Date;
    fechaInicio: Date;
    fechaFinal: Date;
    diagnostico: string;
}

const generarPDF = ({ nombrePaciente, cedulaPaciente, sintomas, fecha, fechaInicio, fechaFinal, diagnostico }: DatosMedicos): Buffer => {
    const doc = new jsPDF();

    // Cabecera del documento
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("Dra. Gricel Perez", 10, 10);
    doc.setFontSize(14);
    doc.setFont("Helvetica", "normal");
    doc.text("Medica Cirujana/Mgsc. en Salud Ocupacional", 10, 20);
    doc.text("COMEZU: 12287 / MPPS: 66370", 10, 30);
    doc.text("Medicina del Trabajo e Higiene Industrial", 10, 40);

    

    // Información del reposo médico
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Fecha: " + fecha.toLocaleDateString(), 10, 60);
    doc.text("REPOSO MEDICO", 10, 70);

    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    const parrafo = `
El Paciente ${nombrePaciente}, titular de la cedula: ${cedulaPaciente}, manifiesta que presenta los siguientes síntomas: ${sintomas}. En la evaluación de ingreso del ${fecha.toLocaleDateString()} se encontró y concluyó que el paciente posee ${diagnostico} se indicó tratamiento médico. Se indica reposo desde el ${fechaInicio.toLocaleDateString()} hasta el ${fechaFinal.toLocaleDateString()} debiendo ingresar el día ${fechaFinal.toLocaleDateString()}.
    `;
    const splitParrafo = doc.splitTextToSize(parrafo, 180); // Ajustar el tamaño del párrafo al ancho del documento
    doc.text(splitParrafo, 10, 80); // Ajustar la posición del párrafo según necesidad

    

    // Convertir el PDF a un buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
};

export { generarPDF, DatosMedicos };
