import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export interface DatosConstancia {
    nombrePaciente: string;
    cedulaPaciente: string;
    edadPaciente: number;
    fotoPaciente: string | null; // URL de la foto del paciente en Firebase
    empresa: string;
    cargo: string;
    concepto: string;
    clasificacion: string;
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
    cedulaPaciente,
    edadPaciente,
    empresa,
    cargo,
    concepto,
    clasificacion,
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
    const esculapioImagePath = path.resolve(__dirname, '../../src/helpers/esculapio.png');
    const esculapioImageBuffer = fs.readFileSync(esculapioImagePath);

    // Descarga la firma del doctor desde Firebase si existe
    let firmaImageBuffer: Buffer | null = null;
    if (firmaDoctor) {
        const response = await axios.get(firmaDoctor, { responseType: 'arraybuffer' });
        firmaImageBuffer = Buffer.from(response.data, 'binary');
        console.log(`Descargando firma desde: ${firmaDoctor}`);
    }

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
    doc.text(`Dr. ${nombreDoctor}`, 80, 20);
    doc.setFontSize(16);
    doc.setFont("Times", "normal");
    doc.text(`${direccionDoctor}`, 80, 30);
    doc.text(`Teléfono: ${telefonoDoctor}`, 80, 35);
    doc.text(`${inscripcionCMDoctor}`, 80, 40);
    doc.text(`${registroDoctor}`, 80, 45);
    doc.text('Medicina del Trabajo e Higiene Industrial', 80, 50);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(10, 60, pageWidth - 10, 60); // Línea horizontal

    // Título "CONSTANCIA DE APTITUD OCUPACIONAL" y Concepto
    doc.setFontSize(22);
    doc.setFont("Times", "bold");
    const title = "CONSTANCIA DE APTITUD OCUPACIONAL";
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 70); // Se acortó la distancia desde el tope de la página

    doc.setFontSize(18); // Tamaño similar al título para el concepto
    doc.text(`${concepto}`, (pageWidth - doc.getTextWidth(`${concepto}`)) / 2, 85); // Justo debajo del título


    // Información de la constancia
    doc.setFontSize(12);
    doc.setFont("Times", "normal");

    const parrafo1 = `El paciente ${nombrePaciente}, titular de la cédula: ${cedulaPaciente}, con edad ${edadPaciente} años, trabaja en la empresa ${empresa} desempeñando el cargo de ${cargo}.`;
    const parrafo2 = `Clasificación: ${clasificacion}`;

    let yOffset = 105; // Ajuste para reducir la separación entre título y contenido
    doc.text(parrafo1, 10, yOffset, { maxWidth: 180 });
    yOffset += 15; // Espacio entre párrafos
    doc.text(parrafo2, 10, yOffset, { maxWidth: 180 });

    // Configuración del rectángulo con borde negro para la firma
    const firmaWidth = 50; // Ancho de la imagen de la firma
    const firmaHeight = 20; // Altura de la imagen de la firma
    const rectWidth = firmaWidth + 10; // Ancho del rectángulo (con margen)
    const rectHeight = firmaHeight + 10; // Altura del rectángulo (con margen)
    const rectX = (pageWidth - rectWidth) / 2; // Posición X del rectángulo
    const rectY = pageHeight - rectHeight - 90; // Posición Y del rectángulo

    // Dibujar el rectángulo con borde negro y sin relleno
    doc.setDrawColor(0, 0, 0); // Color del borde (negro)
    doc.setFillColor(255, 255, 255); // Color de relleno (blanco, para que sea transparente)
    doc.rect(rectX, rectY, rectWidth, rectHeight, 'D'); // 'D' dibuja solo el borde

    // Añadir la imagen de la firma dentro del rectángulo, si existe
    if (firmaImageBuffer) {
        doc.addImage(firmaImageBuffer.toString('binary'), 'PNG', rectX + 5, rectY + 5, firmaWidth, firmaHeight); // Centrar la imagen dentro del rectángulo
    }

    // Texto debajo del rectángulo
    doc.setFontSize(12);
    doc.setFont('Times', 'normal');
    const firmaTexto = `Dr. ${nombreDoctor}`;
    const firmaTextoX = rectX + rectWidth / 2 - 20; // Mover el texto 20 unidades a la izquierda
    doc.text(firmaTexto, firmaTextoX, rectY + rectHeight + 10);

    // Agregar línea de separación
    doc.setLineWidth(0.2); // Ancho de la línea, puedes ajustar este valor para hacer la línea más gruesa o más delgada
    doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20); // Dibuja una línea horizontal

    // Texto en el pie de página
    doc.setFontSize(10);
    const footerText = `Dr. ${nombreDoctor}, ${especialidadDoctor}, Email: ${correoDoctor}`;
    const footerTextWidth = (doc.getStringUnitWidth(footerText) * 10) / 72;
    doc.text(footerText, 10, pageHeight - 10); // El primer parámetro define la posición X (a la izquierda)


    // Convertir el PDF a un buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
};