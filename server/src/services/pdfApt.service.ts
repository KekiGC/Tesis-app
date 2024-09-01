import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export interface DatosConstancia {
  nombrePaciente: string;
  apellidoPaciente: string;
  cedulaPaciente: string;
  edadPaciente: number;
  fechaNacimientoPaciente: string;
  sexoPaciente: string;
  empresa: string;
  cargo: string;
  concepto: string;
  clasificacion: string;
  conclusiones: string;
  observaciones: string;
  nombreDoctor: string;
  correoDoctor: string;
  especialidadDoctor: string;
  direccionDoctor: string;
  telefonoDoctor: string;
  inscripcionCMDoctor: string;
  registroDoctor: string;
  firmaDoctor: string | null; // URL de la firma del doctor en Firebase
}

export const generarPDFConstancia = async ({
  nombrePaciente,
  apellidoPaciente,
  cedulaPaciente,
  edadPaciente,
  fechaNacimientoPaciente,
  sexoPaciente,
  empresa,
  cargo,
  concepto,
  clasificacion,
  conclusiones,
  observaciones,
  nombreDoctor,
  correoDoctor,
  especialidadDoctor,
  direccionDoctor,
  telefonoDoctor,
  inscripcionCMDoctor,
  registroDoctor,
  firmaDoctor,
}: DatosConstancia): Promise<Buffer> => {
  const doc = new jsPDF();

  // Ruta de la imagen del esculapio
  const esculapioImagePath = path.resolve(
    __dirname,
    '../../src/helpers/esculapio.png'
  );
  const esculapioImageBuffer = fs.readFileSync(esculapioImagePath);

  // Descarga la firma del doctor desde Firebase si existe
  let firmaImageBuffer: Buffer | null = null;
  if (firmaDoctor) {
    const response = await axios.get(firmaDoctor, {
      responseType: 'arraybuffer',
    });
    firmaImageBuffer = Buffer.from(response.data, 'binary');
  }

  // Añadir la imagen del esculapio en la esquina superior izquierda
  doc.addImage(esculapioImageBuffer.toString('binary'), 'PNG', 10, 10, 50, 50);

  // Información del doctor a la derecha de la imagen
  doc.setFontSize(20);
  doc.setFont('Times', 'bold');
  doc.text(`Dr. ${nombreDoctor}`, 80, 20);
  doc.setFontSize(16);
  doc.setFont('Times', 'normal');
  doc.text(`${direccionDoctor}`, 80, 30);
  doc.text(`Teléfono: ${telefonoDoctor}`, 80, 35);
  doc.text(`${inscripcionCMDoctor}`, 80, 40);
  doc.text(`${registroDoctor}`, 80, 45);
  doc.text('Medicina del Trabajo e Higiene Industrial', 80, 50);

  // Línea separadora
  doc.setLineWidth(0.5);
  doc.line(10, 60, doc.internal.pageSize.width - 10, 60); // Línea horizontal

  // Título "SOLICITUD DE SERVICIO MÉDICO OCUPACIONAL"
  doc.setFontSize(22);
  doc.setFont('Times', 'bold');
  doc.text(
    'SOLICITUD DE SERVICIO MÉDICO OCUPACIONAL',
    doc.internal.pageSize.width / 2,
    70,
    { align: 'center' }
  );

  // Información del paciente
  doc.setFontSize(14);
  doc.setFont('Times', 'normal');
  doc.text(`Empresa solicitante: ${empresa}`, 10, 85);
  doc.text(`EXAMEN SOLICITADO: ${concepto}`, 10, 95);

  // checkbox para el concepto
  const conceptcheckboxX = 65;
  const conceptcheckboxY = 96;
  doc.rect(conceptcheckboxX + 25, conceptcheckboxY - 5, 5, 5);
  doc.text('X', conceptcheckboxX + 26, conceptcheckboxY - 1);

  // Datos del trabajador
  doc.setFont('Times', 'bold');
  doc.setFontSize(16);
  doc.text('DATOS DEL TRABAJADOR', doc.internal.pageSize.width / 2, 110, {
    align: 'center',
  });

  // Draw underline
  const textWidth = doc.getTextWidth('DATOS DEL TRABAJADOR');
  doc.setLineWidth(0.5);
  doc.line(
    (doc.internal.pageSize.width - textWidth) / 2,
    112,
    (doc.internal.pageSize.width + textWidth) / 2,
    112
  );

  // Two-column layout for worker data
  const leftColumnX = 10;
  const rightColumnX = 105;
  let rowY = 120;

  doc.setFontSize(12);
  doc.setFont('Times', 'bold');
  doc.text('Nombres:', leftColumnX, rowY);
  doc.setFont('Times', 'normal');
  doc.text(nombrePaciente, leftColumnX + 20, rowY);

  doc.setFont('Times', 'bold');
  doc.text('Apellidos:', rightColumnX, rowY);
  doc.setFont('Times', 'normal');
  doc.text(apellidoPaciente, rightColumnX + 20, rowY);

  rowY += 10;
  doc.setFont('Times', 'bold');
  doc.text('Fecha de Nacimiento:', leftColumnX, rowY);
  doc.setFont('Times', 'normal');
  doc.text(fechaNacimientoPaciente, leftColumnX + 41, rowY);

  doc.setFont('Times', 'bold');
  doc.text('Edad:', rightColumnX, rowY);
  doc.setFont('Times', 'normal');
  doc.text(`${edadPaciente.toString()} años`, rightColumnX + 14, rowY);

  rowY += 10;
  doc.setFont('Times', 'bold');
  doc.text('Cédula de Identidad:', leftColumnX, rowY);
  doc.setFont('Times', 'normal');
  doc.text(cedulaPaciente, leftColumnX + 40, rowY);

  doc.setFont('Times', 'bold');
  doc.text('Sexo:', rightColumnX, rowY);
  doc.setFont('Times', 'normal');
  doc.text(
    sexoPaciente === 'male' ? 'Masculino' : 'Femenino',
    rightColumnX + 14,
    rowY
  );

  rowY += 10;
  doc.setFont('Times', 'bold');
  doc.text('Cargo/Puesto que aspira:', leftColumnX, rowY);
  doc.setFont('Times', 'normal');
  doc.text(cargo, leftColumnX + 50, rowY);

  // Checkboxes for classification
  const checkboxX = 10;
  let checkboxY = 165;
  doc.setFont('Times', 'normal');
  doc.text('RESULTADOS:', checkboxX, checkboxY);

  // Checkbox for "Apto para Trabajar"
  checkboxY += 10; // Move Y position down for the first checkbox
  doc.rect(checkboxX + 25, checkboxY - 5, 5, 5);
  if (clasificacion === 'Apto') doc.text('X', checkboxX + 26, checkboxY - 1); // Mark checkbox if applicable
  doc.text('Apto para Trabajar', checkboxX + 35, checkboxY);

  // Checkbox for "No Apto"
  checkboxY += 10; // Move Y position down for the second checkbox
  doc.rect(checkboxX + 25, checkboxY - 5, 5, 5);
  if (clasificacion === 'No apto') doc.text('X', checkboxX + 26, checkboxY - 1); // Mark checkbox if applicable
  doc.text('No Apto para el puesto solicitado', checkboxX + 35, checkboxY);

  // Conclusion section
  doc.text('OBSERVACIONES:', 10, checkboxY + 10);
  doc.setFont('Times', 'normal');
  doc.text(observaciones, 10, checkboxY + 20);

  doc.text('CONCLUSIONES:', 10, checkboxY + 30);
  doc.setFont('Times', 'normal');
  doc.text(conclusiones, 10, checkboxY + 40);

  // Firma del doctor
  const pageWidth = doc.internal.pageSize.width;
  const firmaWidth = 50;
  const firmaX = (pageWidth - firmaWidth) / 2;
  const firmaY = doc.internal.pageSize.height - 60; // Adjust Y position to move signature up

  // Add signature image above the text
  if (firmaImageBuffer) {
    doc.addImage(
      firmaImageBuffer.toString('binary'),
      'PNG',
      firmaX,
      firmaY,
      firmaWidth,
      25
    );
  }

  // Centrar el texto "Firma y Sello del Médico Ocupacional"
  doc.setFontSize(12);
  const textFirmaSello = 'Firma y Sello del Médico Ocupacional';
  const textFirmaSelloWidth = doc.getTextWidth(textFirmaSello);
  const textFirmaSelloX = (pageWidth - textFirmaSelloWidth) / 2;
  doc.text(textFirmaSello, textFirmaSelloX, firmaY + 32);

  // Centrar el nombre del doctor
  const textDoctor = `Dr. ${nombreDoctor}`;
  const textDoctorWidth = doc.getTextWidth(textDoctor);
  const textDoctorX = (pageWidth - textDoctorWidth) / 2;
  doc.text(textDoctor, textDoctorX, firmaY + 40);

  // Subrayar la firma
  doc.setLineWidth(0.5);
  doc.line(firmaX, firmaY + 25, firmaX + firmaWidth, firmaY + 25); // Línea horizontal bajo la firma

  // Convertir el PDF a un buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
};
