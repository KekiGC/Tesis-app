import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

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
        
        // Configuración de la página
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const marginX = 10;

        // Logo o imagen del doctor (Esculapio)
        const esculapioImagePath = path.resolve(__dirname, '../../src/helpers/esculapio.png');
        const esculapioImageBuffer = fs.readFileSync(esculapioImagePath);
        doc.addImage(esculapioImageBuffer.toString('binary'), 'PNG', marginX, 10, 30, 30);

        // Información del doctor en la parte superior derecha
        doc.setFontSize(30);
        doc.setFont('Times', 'bold');
        doc.text(nombreDoctor, 65, 15);
        doc.setFont('Times', 'normal');
        doc.setFontSize(12);
        doc.text(especialidadDoctor, 80, 20);

        // agregar linea separadora
        doc.setLineWidth(0.5);
        doc.line(60, 22, 150, 22);
        
        doc.text(inscripcionCMDoctor, 80, 27);

        doc.text(direccionDoctor, pageWidth - 100, 15);
        doc.text(`Teléfono: ${telefonoDoctor}`, pageWidth - 100, 20);
        doc.text(registroDoctor, pageWidth - 100, 25);

        doc.text(`Fecha: ${fechaFactura}`, 10, 45);

        // número de control
        doc.setFont('Times', 'bold');
        doc.setFontSize(18);
        doc.text(`No. de Control: 00-${numeroControl.toString().padStart(4, '0')}`, 10, 53);

        // Información del paciente y la factura
        doc.setFontSize(12);
        doc.text(`Nombre o Razón Social: ${nombreRazon}`, marginX, 60);
        doc.text(`RIF: ${rif}`, marginX, 65);
        doc.text(`Dirección Fiscal: ${dirFiscal}`, marginX, 70);
        doc.text(`Nombre, Apellido y CI del Paciente: ${nombrePaciente} - ${cedulaPaciente}`, marginX, 75);
        doc.text(`Forma de Pago: ${formaPago}`, marginX, 80);
        doc.text(`Teléfono: ${contacto}`, marginX, 85);

        // Descripción del servicio prestado en un cuadro
        doc.setFont('Times', 'bold');
        doc.text('Descripción del Servicio Prestado', marginX, 95);
        doc.setFont('Times', 'normal');
        doc.rect(marginX, 100, pageWidth - 20, 50); // Rectángulo para la descripción
        doc.text(descripcionServicio, marginX + 5, 110, { maxWidth: pageWidth - 30 });

        // Totales en la parte inferior
        doc.setFont('Times', 'bold');
        doc.text('Sub-Total:', marginX, 160);
        doc.text('Ajuste:', marginX, 165);
        doc.text('Total a Pagar:', marginX, 170);
        doc.text(total.toFixed(2), marginX + 40, 170);

        // Firma del doctor en la parte inferior derecha
        if (firmaDoctor) {
            const response = await axios.get(firmaDoctor, { responseType: 'arraybuffer' });
            const firmaImageBuffer = Buffer.from(response.data, 'binary');
            doc.addImage(firmaImageBuffer.toString('binary'), 'PNG', pageWidth - 100, 180, 50, 25);
        }

        doc.text(`Dr. ${nombreDoctor}`, pageWidth - 100, 210);
        doc.text('Firma y Sello del Médico Ocupacional', pageWidth - 100, 215);

        // Convertir el PDF a un buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        return pdfBuffer;
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        return Buffer.from(''); // Devolver un buffer vacío en caso de error
    }
};
