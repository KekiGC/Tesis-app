// pdf.service.ts
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export interface DatosMedicos {
  nombrePaciente: string;
  cedulaPaciente: string;
  nombreDoctor: string;
  correoDoctor: string;
  direccionDoctor: string;
  telefonoDoctor: string;
  especialidadDoctor: string;
  inscripcionCMDoctor: string;
  registroDoctor: string;
  firmaDoctor: string | null;
  sintomas: string;
  fecha: Date;
  fechaInicio: Date;
  fechaFinal: Date;
  diagnostico: string;
  comentarios: string;
}

export const generarPDF = async ({
  nombrePaciente,
  cedulaPaciente,
  nombreDoctor,
  correoDoctor,
  direccionDoctor,
  telefonoDoctor,
  especialidadDoctor,
  inscripcionCMDoctor,
  registroDoctor,
  sintomas,
  fecha,
  fechaInicio,
  fechaFinal,
  diagnostico,
  firmaDoctor,
}: DatosMedicos): Promise<Buffer> => {
  try {
    const doc = new jsPDF();

    // Ruta de la imagen de esculapio
    const esculapioImagePath = path.resolve(
      __dirname,
      '../../src/helpers/esculapio.png'
    );
    const esculapioImageBuffer = fs.readFileSync(esculapioImagePath);

    // Dimensiones de la página y de la imagen
    const imageWidth = 50;
    const imageHeight = 50;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Añadir la imagen del esculapio en la esquina superior izquierda
    doc.addImage(
      esculapioImageBuffer.toString('binary'),
      'PNG',
      10,
      10,
      imageWidth,
      imageHeight
    );

    // Información del doctor
    doc.setFontSize(20);
    doc.setFont('Times', 'bold');
    doc.text(`Dr. ${nombreDoctor}`, 80, 20);
    doc.setFontSize(14);
    doc.setFont('Times', 'normal');
    doc.text(direccionDoctor, 80, 30);
    doc.text(telefonoDoctor, 80, 35);
    doc.text(`${inscripcionCMDoctor}`, 80, 40);
    doc.text(`${registroDoctor}`, 80, 45);
    doc.text('Medicina del Trabajo e Higiene Industrial', 80, 50);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(10, 60, pageWidth - 10, 60); // Línea horizontal

    // Fecha del reporte en la parte inferior derecha, justo debajo de la línea
    doc.setFontSize(12);
    doc.setFont('Times', 'bold');
    doc.text(`${fecha.toLocaleDateString()}`, pageWidth - 60, 70); // Posición en la esquina inferior derecha

    // Título "REPOSO MÉDICO"
    doc.setFontSize(16);
    doc.setFont('Times', 'bold');
    const title = 'REPOSO MÉDICO';
    const titleWidth = ((doc.getStringUnitWidth(title) * 16) / 72) * 25.4; // Ancho del título en mm
    doc.text(title, (pageWidth - titleWidth) / 2, 80); // Centrado

    // Información del reposo médico
    doc.setFontSize(12);
    doc.setFont('Times', 'normal');

    const parrafo1 = `El Paciente ${nombrePaciente}, titular de la cédula: ${cedulaPaciente}, manifiesta que presenta los siguientes síntomas: ${sintomas}.`;
    const parrafo2 = `En la evaluación de ingreso del ${fecha.toLocaleDateString('es-ES')} se encontró y concluyó que el paciente posee ${diagnostico}. Se indicó tratamiento médico.`;
    const parrafo4 = `Se indica reposo desde el ${fechaInicio.toLocaleDateString('es-ES')} hasta el ${fechaFinal.toLocaleDateString('es-ES')} debiendo ingresar el día ${fechaFinal.toLocaleDateString('es-ES')}.`;

    let yOffset = 100;
    doc.text(parrafo1, 10, yOffset, { maxWidth: 180 });
    yOffset += 15;
    doc.text(parrafo2, 10, yOffset, { maxWidth: 180 });
    yOffset += 15;
    doc.text(parrafo4, 10, yOffset, { maxWidth: 180 });

    // Configuración del rectángulo con borde negro para la firma
    const firmaWidth = 50;
    const firmaHeight = 20;
    const rectWidth = firmaWidth + 10;
    const rectHeight = firmaHeight + 10;
    const rectX = (pageWidth - rectWidth) / 2;
    const rectY = pageHeight - rectHeight - 90;

    // Dibujar el rectángulo con borde negro y sin relleno
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(255, 255, 255);
    doc.rect(rectX, rectY, rectWidth, rectHeight, 'D');

    // Añadir la firma del doctor desde Firebase si está disponible
    if (firmaDoctor) {
      console.log(`Descargando firma desde: ${firmaDoctor}`);
      const firmaResponse = await axios.get(firmaDoctor, {
        responseType: 'arraybuffer',
      });
      const firmaImageBuffer = Buffer.from(firmaResponse.data, 'binary');

      // Añadir la firma desde Firebase
      doc.addImage(
        firmaImageBuffer.toString('binary'),
        'PNG',
        rectX + 5,
        rectY + 5,
        firmaWidth,
        firmaHeight
      );
    } else {
      console.log('No se proporcionó firma para el doctor.');
    }

    // Texto debajo del rectángulo para la firma
    doc.setFontSize(12);
    doc.setFont('Times', 'normal');
    const firmaTexto = `Dr. ${nombreDoctor}`;
    const firmaTextoX = rectX + rectWidth / 2 - 20; // Mover el texto 20 unidades a la izquierda
    doc.text(firmaTexto, firmaTextoX, rectY + rectHeight + 10);

    // agregar linea de separacion
    doc.setLineWidth(0.2);
    doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20); // Línea horizontal

    // texto en el pie de pagina
    doc.setFontSize(10);
    const footerText = `Dr. ${nombreDoctor}, ${especialidadDoctor}, Email: ${correoDoctor}`;
    doc.text(footerText, 10, pageHeight - 10);

    // Convertir el PDF a un buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log('PDF generado correctamente.');
    return pdfBuffer;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return Buffer.from(''); // Devolver un buffer vacío en caso de error
  }
};
