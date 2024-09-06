import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const lucidaCalligraphyBase64 = fs.readFileSync(
  path.resolve(__dirname, '../../src/helpers/LucidaCalligraphyFont.ttf'),
  'base64'
);

export interface DatosFactura {
  nombrePaciente: string;
  cedulaPaciente: string;
  nombreDoctor: string;
  direccionDoctor: string;
  telefonoDoctor: string;
  especialidadDoctor: string;
  inscripcionCMDoctor: string;
  registroDoctor: string;
  firmaDoctor: string | null;
  fechaFactura: string;
  numeroControl: number;
  nombreRazon: string;
  dirFiscal: string;
  rif: string;
  formaPago: string;
  contacto: string;
  descripcionServicio: string;
  total: number;
}

export const generarFactura = async ({
  nombrePaciente,
  cedulaPaciente,
  nombreDoctor,
  direccionDoctor,
  telefonoDoctor,
  especialidadDoctor,
  inscripcionCMDoctor,
  registroDoctor,
  firmaDoctor,
  fechaFactura,
  numeroControl,
  nombreRazon,
  dirFiscal,
  rif,
  formaPago,
  contacto,
  descripcionServicio,
  total,
}: DatosFactura): Promise<Buffer> => {
  try {
    const doc = new jsPDF('landscape');

    // Agregar la fuente al documento jsPDF
    doc.addFileToVFS('LucidaCalligraphy.ttf', lucidaCalligraphyBase64);
    doc.addFont('LucidaCalligraphy.ttf', 'Lucida', 'normal');

    // Configuración de la página
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const marginX = 10;

    // Logo o imagen del doctor (Esculapio)
    const esculapioImagePath = path.resolve(
      __dirname,
      '../../src/helpers/esculapio.png'
    );
    const esculapioImageBuffer = fs.readFileSync(esculapioImagePath);
    doc.addImage(
      esculapioImageBuffer.toString('binary'),
      'PNG',
      marginX,
      10,
      30,
      30
    );

    // Configuraciones
    const marginLeft = 65; // Margen izquierdo para el nombre
    const fontSizeDoctor = 36;
    const fontSizeDetails = 12;
    const yPositionName = 13; // Posición vertical del nombre
    const yPositionSpecialty = 20; // Posición vertical de la especialidad
    const yPositionLine = 22; // Posición vertical de la línea separadora
    const yPositionInscription = 27; // Posición vertical de la inscripción CM

    // Configurar fuente y tamaño para el nombre
    doc.setFontSize(fontSizeDoctor);
    doc.setFont('Lucida', 'normal');

    // Obtener el ancho del texto del nombre del doctor
    const doctorNameWidth = doc.getTextWidth(`Dr. ${nombreDoctor}`);

    // Dibujar el nombre del doctor
    doc.text(`Dr. ${nombreDoctor}`, marginLeft, yPositionName);

    // Calcular el centro de la línea basada en el ancho del nombre
    const lineStart = marginLeft;
    const lineEnd = marginLeft + doctorNameWidth;

    // Dibujar la línea justo debajo del nombre, ajustada al ancho del nombre
    doc.setLineWidth(0.5);
    doc.line(lineStart, yPositionLine, lineEnd, yPositionLine);

    // Configurar fuente y tamaño para los detalles
    doc.setFont('Times', 'normal');
    doc.setFontSize(fontSizeDetails);

    // Calcular las posiciones centradas para la especialidad y la inscripción CM
    const specialtyWidth = doc.getTextWidth(especialidadDoctor);
    const specialtyPositionX =
      marginLeft + (doctorNameWidth - specialtyWidth) / 2;

    const inscriptionWidth = doc.getTextWidth(inscripcionCMDoctor);
    const inscriptionPositionX =
      marginLeft + (doctorNameWidth - inscriptionWidth) / 2;

    // Dibujar la especialidad y la inscripción CM centradas bajo la línea
    doc.text(especialidadDoctor, specialtyPositionX, yPositionSpecialty);
    doc.text(inscripcionCMDoctor, inscriptionPositionX, yPositionInscription);

    // Función para alinear texto a la derecha
    const alignRight = (text: string, doc: jsPDF, yPosition: number, pageWidth: number, marginRight = 10) => {
        const textWidth = doc.getTextWidth(text);
        doc.text(text, pageWidth - textWidth - marginRight, yPosition);
    };

    // Información del doctor en la parte superior derecha, alineada a la derecha
    doc.setFont('Times', 'bold');
    doc.setFontSize(14);
    alignRight(direccionDoctor, doc, 10, pageWidth);
    alignRight(`Teléfono: ${telefonoDoctor}`, doc, 15, pageWidth);
    alignRight(registroDoctor, doc, 20, pageWidth);

    // Dibujar una línea debajo de la información del doctor
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 90, 25, pageWidth - 10, 25);

    // Añadir "Honorarios Profesionales" debajo de la línea
    doc.setFontSize(16);
    doc.text('Honorarios Profesionales', pageWidth - 80, 32);

    // Añadir "Contribuyente formal" debajo de "Honorarios Profesionales"
    doc.setFontSize(12);
    doc.text('Contribuyente formal', pageWidth - 70, 38);

    doc.setFontSize(16);
    doc.setFont('Times', 'normal');
    doc.text(`Fecha: ${fechaFactura}`, 10, 45);

    // número de control
    doc.setFont('Times', 'bold');
    doc.setFontSize(18);
    doc.text(
      `No. de Control: 00-${numeroControl.toString().padStart(4, '0')}`,
      10,
      53
    );

    // Información del paciente y la factura
doc.setFontSize(16);
doc.setFont('Times', 'normal');

// Nombre o Razón Social
doc.text(`Nombre o Razón Social: ${nombreRazon}`, marginX, 60);
doc.setLineWidth(0.1);
doc.line(67, 61, pageWidth - 10, 61); // Línea horizontal

// Dirección Fiscal
doc.text(`Dirección Fiscal: ${dirFiscal}`, marginX, 68);
doc.line(50, 69, pageWidth - 10, 69); // Línea horizontal

// RIF
doc.text(`RIF: ${rif}`, marginX, 76);
doc.line(marginX + 11, 77, marginX + 48, 77); // Línea horizontal para RIF

// Forma de Pago
doc.text(`Forma de Pago: ${formaPago}`, marginX + 50, 76);
doc.line(marginX + 88, 77, marginX + 167, 77); // Línea horizontal para Forma de Pago

// Contacto
doc.text(`Contacto: ${contacto}`, marginX + 170, 76);
doc.line(marginX + 193, 77, pageWidth - 10, 77); // Línea horizontal para Contacto

// Nombre, Apellido y CI del Paciente
doc.text(
  `Nombre, Apellido y CI del Paciente: ${nombrePaciente} - ${cedulaPaciente}`,
  marginX,
  84
);
doc.line(94, 85, pageWidth - 10, 85); // Línea horizontal para Nombre, Apellido y CI

    // Descripción del servicio prestado en un cuadro
    doc.setFont('Times', 'bold');
    doc.text('Descripción del Servicio Prestado', marginX, 95);
    doc.setFont('Times', 'normal');
    doc.rect(marginX, 100, pageWidth - 20, 50); // Rectángulo para la descripción
    doc.text(descripcionServicio, marginX + 5, 110, {
      maxWidth: pageWidth - 30,
    });

    // Totales en la parte inferior
    doc.setFont('Times', 'bold');
    doc.text('Total a Pagar:', marginX, 160);
    doc.text(total.toFixed(2), marginX + 40, 160);

    // Firma del doctor en la parte inferior derecha
    if (firmaDoctor) {
      const response = await axios.get(firmaDoctor, {
        responseType: 'arraybuffer',
      });
      const firmaImageBuffer = Buffer.from(response.data, 'binary');
      doc.addImage(
        firmaImageBuffer.toString('binary'),
        'PNG',
        pageWidth - 100,
        160,
        50,
        25
      );
    }

    // Ancho de la línea de la firma
    const lineStartFirma = pageWidth - 100;
    const lineEndFirma = pageWidth - 50;
    const lineWidthFirma = lineEndFirma - lineStartFirma;

    // Dibujar la línea de la firma
    doc.setLineWidth(0.5);
    doc.line(lineStartFirma, 190, lineEndFirma, 190); // Línea de firma

    // Obtener el ancho del texto del nombre del doctor
    const doctorNameWidthFirma = doc.getTextWidth(`Dr. ${nombreDoctor}`);

    // Calcular la posición X centrada para el nombre del doctor bajo la línea de la firma
    const namePositionXFirma =
      lineStartFirma + (lineWidthFirma - doctorNameWidthFirma) / 2;

    // Dibujar el nombre del doctor centrado bajo la línea de la firma
    doc.text(`Dr. ${nombreDoctor}`, namePositionXFirma, 195);

    // Convertir el PDF a un buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return Buffer.from(''); // Devolver un buffer vacío en caso de error
  }
};
