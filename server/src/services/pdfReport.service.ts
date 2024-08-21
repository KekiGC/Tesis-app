import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

export interface DatosInforme {
  nombrePaciente: string;
  cedulaPaciente: string;
  nombreDoctor: string;
  correoDoctor: string;
  direccionDoctor: string;
  telefonoDoctor: string;
  inscripcionCMDoctor: string;
  registroDoctor: string;
  firmaDoctor: string | null;
  fechaReporte: string;
  sintomas: string;
  hallazgos: string;
  examenes: string;
  diagnostico: string;
}

export const generarPDFInforme = ({
  nombrePaciente,
  cedulaPaciente,
  nombreDoctor,
  correoDoctor,
  direccionDoctor,
  telefonoDoctor,
  inscripcionCMDoctor,
  registroDoctor,
  firmaDoctor,
  fechaReporte,
  sintomas,
  hallazgos,
  examenes,
  diagnostico,
}: DatosInforme): Buffer => {
  const doc = new jsPDF();

  // Ruta de las imágenes
  const esculapioImagePath = path.resolve(
    __dirname,
    '../../src/helpers/esculapio.png'
  );
  const firmaImagePath = path.resolve(__dirname, '../../src/helpers/firma.png');

  // Leer las imágenes como buffer
  const esculapioImageBuffer = fs.readFileSync(esculapioImagePath);
  const firmaImageBuffer = fs.readFileSync(firmaImagePath);

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

  // Información del doctor a la derecha de la imagen
  doc.setFontSize(20);
  doc.setFont('Times', 'bold');
  doc.text('Empresa de Medicina Ocupacional', 80, 20); // Posición X: 80, Posición Y: 20
  doc.setFontSize(12);
  doc.setFont('Times', 'normal');
  doc.text('Calle falsa 123', 80, 30);
  doc.text('Maracaibo, Zulia', 80, 35);
  doc.text('Teléfono: 123-1234567', 80, 40);

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

  // Añadir la imagen de la firma dentro del rectángulo
  doc.addImage(
    firmaImageBuffer.toString('binary'),
    'PNG',
    rectX + 5,
    rectY + 5,
    firmaWidth,
    firmaHeight
  ); // Centrar la imagen dentro del rectángulo

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
  const footerText = `Dr. ${nombreDoctor}, Medico Ocupacional, Email: ${correoDoctor}`;
  const footerTextWidth = (doc.getStringUnitWidth(footerText) * 10) / 72;
  doc.text(footerText, 10, pageHeight - 10); // El primer parámetro define la posición X (a la izquierda)

  // Convertir el PDF a un buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
};
