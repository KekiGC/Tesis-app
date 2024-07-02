import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

export interface IMedicalRestPDFData {
    patientId: string;
    nombre_paciente: string;
    cedula_paciente: string;
    sintomas: string;
    fecha: string;
    diagnostico: string;
    fecha_inicio: string;
    fecha_final: string;
    comentarios: string | null;
}
export const createMedicalRestPDF = (data: IMedicalRestPDFData): Buffer => {
    const doc = new jsPDF();
    
    const imagePath1 = 'C:\\Users\\tatox\\Documents\\GitHub\\Tesis-app\\server\\src\\helpers\\esculapio.png';
    if (fs.existsSync(imagePath1)) {
        const imgData = fs.readFileSync(imagePath1, 'base64');
        const imgProps = doc.getImageProperties(imgData);
        const imageWidth = 50; 
        const imageHeight = (imgProps.height * imageWidth) / imgProps.width; // Mantiene la proporción de la imagen
        doc.addImage(imgData, 'PNG', 10, 10, 40, 40); 
    } else {
        console.error('Imagen no encontrada en:', imagePath1);
    }
    
  
   //Informacion medico
    doc.setFontSize(30);
    doc.text("Dra. Gricel Perez", 70, 15); 
    doc.setFontSize(18);
    doc.text("Medica Cirujana/Mgsc. en Salud Ocupacional", 70, 25); 
    doc.setFontSize(18);
    doc.text("COMEZU: 12287 / MPPS: 66370", 70, 35);
    doc.text("Medicina del Trabajo e Higiene Industrial", 70, 45); 
    

    // Continuar con el resto de la información del paciente
    doc.setFontSize(13);
    doc.text("Fecha: " + data.fecha, 10, 70); // Usando la fecha directamente como cadena
    doc.text("--------------------------- REPOSO MEDICO ---------------------------", 40, 85);
     const parrafo = `
    El Paciente ${data.nombre_paciente}, titular de la cedula: ${data.cedula_paciente}, manifiesta que presenta los siguientes síntomas: ${data.sintomas}.
    
    En la evaluación de ingreso del ${data.fecha} se encontró y concluyó que el paciente posee ${data.diagnostico}, se indicó tratamiento médico.
    
    Se indica reposo desde el ${data.fecha_inicio} hasta el ${data.fecha_final} debiendo ingresar el día ${data.fecha_final}.`;

    doc.setFontSize(14);
    const splitParrafo = doc.splitTextToSize(parrafo, 180); // Ajustar el tamaño del párrafo al ancho del documento
    doc.text(splitParrafo, 20, 100); // Ajustar la posición del párrafo según necesidad

  
    if (data.comentarios !== undefined && data.comentarios !== null && data.comentarios.trim() !== '') {
        doc.text(`Comentarios: ${data.comentarios}`, 20, 165);
      }


    
    // Agregar imagen de la firma del doctor
    const imagePath = 'C:\\Users\\tatox\\Documents\\GitHub\\Tesis-app\\server\\src\\helpers\\firma.png';
    if (fs.existsSync(imagePath)) {
        const imgData = fs.readFileSync(imagePath, 'base64');
        const imgProps = doc.getImageProperties(imgData);
        const imageWidth = 50; // Tamaño deseado para la imagen
        const imageHeight = (imgProps.height * imageWidth) / imgProps.width; // Mantiene la proporción de la imagen
        doc.addImage(imgData, 'PNG', 90, 220, imageWidth, imageHeight);
    } else {
        console.error('Imagen no encontrada en:', imagePath);
    }

    // Agregar espacio para la firma del doctor
    doc.rect(50, 210, 115, 40); // Crea un recuadro para la firma
    doc.setFontSize(10);
    doc.text('Firma del médico:', 55, 235);
    doc.text('Gricel C. Perez V.', 95, 255);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
};

      

