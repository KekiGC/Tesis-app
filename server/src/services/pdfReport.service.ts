import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export interface DatosInforme {
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
  fechaReporte: string;
  sintomas: string;
  hallazgos: string;
  examenes: string;
  diagnostico: string;
}

export const generarPDFInforme = async ({
  nombrePaciente,
  cedulaPaciente,
  nombreDoctor,
  correoDoctor,
  direccionDoctor,
  telefonoDoctor,
  especialidadDoctor,
  inscripcionCMDoctor,
  registroDoctor,
  firmaDoctor,
  fechaReporte,
  sintomas,
  hallazgos,
  examenes,
  diagnostico,
}: DatosInforme): Promise<Buffer> => {
  try {
    const doc = new jsPDF();

    // Ruta de la imagen de Esculapio
    const esculapioImagePath = path.resolve(__dirname, '../../src/helpers/esculapio.png');
    const esculapioImageBuffer = fs.readFileSync(esculapioImagePath);

    // Configurar dimensiones y posiciones
    const imageWidth = 50; // Ancho de la imagen del esculapio
    const imageHeight = 50; // Altura de la imagen del esculapio
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

    // Actualizar la información del doctor en el encabezado
    doc.setFontSize(20);
    doc.setFont('Times', 'bold');
    doc.text(`Dr. ${nombreDoctor}`, 80, 20); // Posición X: 80, Posición Y: 20
    doc.setFontSize(16);
    doc.setFont('Times', 'normal');
    doc.text(direccionDoctor, 80, 30); // Dirección del doctor
    doc.text(telefonoDoctor, 80, 35); // Teléfono del doctor
    doc.text(`${inscripcionCMDoctor}`, 80, 40); // Inscripción CM del doctor
    doc.text(`${registroDoctor}`, 80, 45); // Registro del doctor
    doc.text('Medicina del Trabajo e Higiene Industrial', 80, 50); 

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(10, 60, pageWidth - 10, 60); // Línea horizontal

    // Fecha del reporte en la parte inferior derecha, justo debajo de la línea
    doc.setFontSize(12);
    doc.setFont('Times', 'normal');
    doc.text(`Zulia, ${fechaReporte}`, pageWidth - 60, 70); // Posición en la esquina inferior derecha

    // Título "INFORME MÉDICO" centrado
    doc.setFontSize(16);
    doc.setFont('Times', 'bold');
    const title = 'INFORME MÉDICO';
    const titleWidth = ((doc.getStringUnitWidth(title) * 16) / 72) * 25.4; // Ancho del título en mm
    doc.text(title, (pageWidth - titleWidth) / 2, 90); // Centrado

    // Información del informe en dos párrafos
    doc.setFontSize(12);
    doc.setFont('Times', 'normal');

    const parrafo1 = `El paciente ${nombrePaciente}, CI: ${cedulaPaciente}, manifiesta que presenta: ${sintomas}.`;
    const parrafo2 = `En la evaluación de ingreso del ${fechaReporte} se encontró: ${hallazgos}. Durante la evaluación se practicaron los siguientes exámenes: ${examenes}, concluyendo que el paciente posee ${diagnostico}, se indicó tratamiento médico.`;

    let yOffset = 100;
    doc.text(parrafo1, 10, yOffset, { maxWidth: 180 });
    yOffset += 15; // Espacio entre párrafos
    doc.text(parrafo2, 10, yOffset, { maxWidth: 180 });

    // Configuración del rectángulo con borde negro para la firma
    const firmaWidth = 50; // Ancho de la imagen de la firma
    const firmaHeight = 20; // Altura de la imagen de la firma
    const rectWidth = firmaWidth + 10; // Ancho del rectángulo (con margen)
    const rectHeight = firmaHeight + 10; // Altura del rectángulo (con margen)
    const rectX = (pageWidth - rectWidth) / 2; // Posición X del rectángulo
    const rectY = pageHeight - rectHeight - 90; // Posición Y del rectángulo (más arriba en la página)

    // Dibujar el rectángulo con borde negro y sin relleno
    doc.setDrawColor(0, 0, 0); // Color del borde (negro)
    doc.setFillColor(255, 255, 255); // Color de relleno (blanco, para que sea transparente)
    doc.rect(rectX, rectY, rectWidth, rectHeight, 'D'); // 'D' dibuja solo el borde

    // Verificar si la URL de la firma es válida
    if (firmaDoctor) {
      console.log(`Descargando firma desde: ${firmaDoctor}`);
      const firmaResponse = await axios.get(firmaDoctor, { responseType: 'arraybuffer' });
      const firmaImageBuffer = Buffer.from(firmaResponse.data, 'binary');

      // Añadir la firma desde Firebase
      doc.addImage(
        firmaImageBuffer.toString('binary'),
        'PNG',
        rectX + 5,
        rectY + 5,
        firmaWidth,
        firmaHeight
      ); // Centrar la imagen dentro del rectángulo
    } else {
      console.log('No se proporcionó firma para el doctor.');
    }

    // Texto debajo del rectángulo
    doc.setFontSize(12);
    doc.setFont('Times', 'normal');
    const firmaTexto = `Dr. ${nombreDoctor}`;
    const firmaTextoX = rectX + rectWidth / 2 - 20; // Mover el texto 20 unidades a la izquierda
    doc.text(firmaTexto, firmaTextoX, rectY + rectHeight + 10); // Posicionar el texto debajo del rectángulo

    // Agregar línea de separación
    doc.setLineWidth(0.2); // Ancho de la línea, puedes ajustar este valor para hacer la línea más gruesa o más delgada
    doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20); // Dibuja una línea horizontal

    // Texto en el pie de página
    doc.setFontSize(10);
    const footerText = `Dr. ${nombreDoctor}, ${especialidadDoctor}, Email: ${correoDoctor}`;
    const footerTextWidth = (doc.getStringUnitWidth(footerText) * 10) / 72;
    doc.text(footerText, 10, pageHeight - 10); // El primer parámetro define la posición X (a la izquierda)

    // Convertir el PDF a un buffer y devolverlo
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log('PDF generado correctamente.');
    return pdfBuffer;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return Buffer.from(''); // Devolver un buffer vacío en caso de error
  }
};
