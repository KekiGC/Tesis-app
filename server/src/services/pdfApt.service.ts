import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

export interface DatosConstancia {
    nombrePaciente: string;
    cedulaPaciente: string;
    edadPaciente: number;
    empresa: string;
    cargo: string;
    fotoPaciente: string | null;
    concepto: string;
    clasificacion: string;
}

export const generarPDFConstancia = ({
    nombrePaciente,
    cedulaPaciente,
    edadPaciente,
    empresa,
    cargo,
    concepto,
    clasificacion,
}: DatosConstancia): Buffer => {
    const doc = new jsPDF();

    // Ruta de las imágenes
    const esculapioImagePath = path.resolve(__dirname, '../../src/helpers/esculapio.png');
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
    doc.addImage(esculapioImageBuffer.toString('binary'), 'PNG', 10, 10, imageWidth, imageHeight);

    // Información del doctor a la derecha de la imagen
    doc.setFontSize(20);
    doc.setFont("Times", "bold");
    doc.text("Dra. Gricel Perez", 80, 20); // Posición X: 80, Posición Y: 20
    doc.setFontSize(18);
    doc.setFont("Times", "normal");
    doc.text("Medica Cirujana/Mgsc. en Salud Ocupacional", 80, 30);
    doc.text("COMEZU: 12287 / MPPS: 66370", 80, 40);
    doc.text("Medicina del Trabajo e Higiene Industrial", 80, 50);

    // Fecha debajo de la imagen del esculapio
    doc.setFontSize(12);
    doc.setFont("Times", "bold");

    // Título "CONSTANCIA DE APTITUD OCUPACIONAL"
    doc.setFontSize(22);
    doc.setFont("Times", "bold");
    const title = "CONSTANCIA DE APTITUD OCUPACIONAL";
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 100);

    // Información de la constancia
    doc.setFontSize(12);
    doc.setFont("Times", "normal");

    const parrafo1 = `El paciente ${nombrePaciente}, titular de la cédula: ${cedulaPaciente}, con edad ${edadPaciente} años, trabaja en la empresa ${empresa} desempeñando el cargo de ${cargo}.`;
    const parrafo2 = `En la evaluación realizada, se concluye lo siguiente:`;
    const parrafo3 = `Concepto: ${concepto}`;
    const parrafo4 = `Clasificación: ${clasificacion}`;

    let yOffset = imageHeight + 90;
    doc.text(parrafo1, 10, yOffset, { maxWidth: 180 });
    yOffset += 15; // Espacio entre párrafos
    doc.text(parrafo2, 10, yOffset, { maxWidth: 180 });
    yOffset += 15; // Espacio entre párrafos
    doc.text(parrafo3, 10, yOffset, { maxWidth: 180 });
    yOffset += 15; // Espacio entre párrafos
    doc.text(parrafo4, 10, yOffset, { maxWidth: 180 });

    // Configuración del rectángulo con borde negro para la firma
    const firmaWidth = 50; // Ancho de la imagen de la firma
    const firmaHeight = 20; // Altura de la imagen de la firma
    const rectWidth = firmaWidth + 10; // Ancho del rectángulo (con margen)
    const rectHeight = firmaHeight + 10; // Altura del rectángulo (con margen)
    const rectX = (pageWidth - rectWidth) / 2; // Posición X del rectángulo
    const rectY = pageHeight - rectHeight - 30; // Posición Y del rectángulo

    // Dibujar el rectángulo con borde negro y sin relleno
    doc.setDrawColor(0, 0, 0); // Color del borde (negro)
    doc.setFillColor(255, 255, 255); // Color de relleno (blanco, para que sea transparente)
    doc.rect(rectX, rectY, rectWidth, rectHeight, 'D'); // 'D' dibuja solo el borde

    // Añadir la imagen de la firma dentro del rectángulo
    doc.addImage(firmaImageBuffer.toString('binary'), 'PNG', rectX + 5, rectY + 5, firmaWidth, firmaHeight); // Centrar la imagen dentro del rectángulo

    // Texto debajo del rectángulo
    doc.setFontSize(12);
    doc.setFont("Times", "normal");
    const firmaTexto = "Gricel C. Perez";
    const firmaTextoWidth = doc.getStringUnitWidth(firmaTexto) * 12 / 72; // Ancho del texto en puntos
    doc.text(firmaTexto, (pageWidth - firmaTextoWidth) / 2, rectY + rectHeight + 10); // Centrar el texto debajo del rectángulo

    // Convertir el PDF a un buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
};