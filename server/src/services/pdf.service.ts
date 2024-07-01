import { jsPDF } from "jspdf";

interface DatosMedicos {
    nombrePaciente: string;
    cedulaPaciente: string;
    sintomas: string;
    fecha: Date;
    fechaInicio: Date;
    fechaFinal: Date;
}

const generarPDF = ({ nombrePaciente, cedulaPaciente, sintomas, fecha, fechaInicio, fechaFinal }: DatosMedicos): Buffer => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("Courier", "bold");
    doc.text("SENIAT", 90, 10);
    doc.setFont("Courier", "normal");
    doc.text("BillMaster. C.A.", 78, 20);
    doc.text("billmaster calle 123", 68, 30);
    doc.text("Tierra Negra, Mcbo, Edo. Zulia", 53, 40);

    doc.setFontSize(13);
    doc.text("Fecha: " + fecha, 10, 50);
    doc.text("------------------ INFORMACION DEL PACIENTE ------------------", 10, 65);
    doc.text("NOMBRE DEL PACIENTE: " + nombrePaciente, 10, 75);
    doc.text("CEDULA: " + cedulaPaciente, 10, 85);
    doc.text("SINTOMAS PRESENTADOS: " + sintomas, 10, 95);
    doc.text("Fecha Inicio de Reposo: " + fechaInicio, 10, 105);
    doc.text("Fecha Finalizacion de Reposo: " + fechaFinal, 10, 115);

    // Convert the PDF to a Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
};

export { generarPDF, DatosMedicos };
