import { Request, Response } from 'express';
import Invoice from '../models/invoice';
import Counter from '../models/counter';
import UserInfo from '../models/userInfo';
import User from '../models/user';
import Patient from '../models/patient';
import { DatosFactura, generarFactura } from '../services/pdfInvoice.service';

// crear factura
export const createInvoice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    patientId,
    doctorId,
    fecha,
    nombre_razon,
    dir_fiscal,
    rif,
    forma_pago,
    contacto,
    descripcion_servicio,
    total,
  } = req.body;

  try {
    // Obtener el siguiente número de control
    const counter = await Counter.findOneAndUpdate(
      { id: 'invoiceControl' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const numero_control = counter ? counter.seq : 1;

    const newInvoice = new Invoice({
      patientId,
      doctorId,
      fecha,
      numero_control,
      nombre_razon,
      dir_fiscal,
      rif,
      forma_pago,
      contacto,
      descripcion_servicio,
      total,
    });

    const savedInvoice = await newInvoice.save();

    // Obtener información del doctor
    const doctor = await User.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const doctorInfo = await UserInfo.findOne({ user: doctorId });
    if (!doctorInfo) return res.status(404).json({ message: 'Doctor info not found' });

    // Obtener información del paciente
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const pdfData: DatosFactura = {
      nombrePaciente: `${patient.name} ${patient.lastname}`,
      cedulaPaciente: patient.cedula,
      nombreDoctor: `${doctor.name} ${doctor.lastname}`,
      direccionDoctor: doctorInfo.direccion,
      telefonoDoctor: doctorInfo.telefono,
      especialidadDoctor: doctorInfo.especialidad,
      inscripcionCMDoctor: doctorInfo.inscripcionCM,
      registroDoctor: doctorInfo.registro,
      firmaDoctor: doctorInfo.firma,
      fechaFactura: new Date(savedInvoice.fecha).toLocaleDateString('es-ES'),
      numeroControl: savedInvoice.numero_control,
      nombreRazon: savedInvoice.nombre_razon,
      dirFiscal: savedInvoice.dir_fiscal,
      rif: savedInvoice.rif,
      formaPago: savedInvoice.forma_pago,
      contacto: savedInvoice.contacto,
      descripcionServicio: savedInvoice.descripcion_servicio,
      total: savedInvoice.total,
    };

    const pdfBuffer = await generarFactura(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura_${patient.name}_${patient.lastname}.pdf`);

    return res.send(pdfBuffer);
  } catch (err) {
    if ((err as any).name === 'ValidationError') {
        const validationErrors = Object.values((err as any).errors).map((e: any) => e.message);
        return res.status(400).json({ msg: 'Validation error', errors: validationErrors });
    } else if ((err as any).code === 11000) {
        return res.status(400).json({ msg: 'Duplicate key error' });
    } else {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}
};

// obtener facturas del doctor (usuario)
export const getInvoices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const invoices = await Invoice.find({ doctorId: req.params.doctorId }).populate('patientId', 'name lastname cedula').populate('doctorId', 'name lastname');
    return res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

export const getInvoicesByCompany = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { companyId, doctorId } = req.body;

    if (!companyId || !doctorId) {
      return res.status(400).json({ msg: 'Faltan filtros necesarios.' });
    }

    const invoices = await Invoice.find({
      doctorId: doctorId,
    })
      .populate({
        path: 'patientId',
        match: { company: companyId },
        select: 'name lastname company',
      })
      .exec();

    return res.status(200).json(invoices.filter((invoice) => invoice.patientId));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

// obtener factura por id
export const getInvoice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const patient = await Patient.findById(invoice.patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const doctor = await User.findById(invoice.doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const doctorInfo = await UserInfo.findOne({ user: invoice.doctorId });
    if (!doctorInfo) return res.status(404).json({ message: 'Doctor info not found' });

    const pdfData: DatosFactura = {
      nombrePaciente: `${patient.name} ${patient.lastname}`,
      cedulaPaciente: patient.cedula,
      nombreDoctor: `${doctor.name} ${doctor.lastname}`,
      direccionDoctor: doctorInfo.direccion,
      telefonoDoctor: doctorInfo.telefono,
      especialidadDoctor: doctorInfo.especialidad,
      inscripcionCMDoctor: doctorInfo.inscripcionCM,
      registroDoctor: doctorInfo.registro,
      firmaDoctor: doctorInfo.firma,
      fechaFactura: new Date(invoice.fecha).toLocaleDateString('es-ES'),
      numeroControl: invoice.numero_control,
      nombreRazon: invoice.nombre_razon,
      dirFiscal: invoice.dir_fiscal,
      rif: invoice.rif,
      formaPago: invoice.forma_pago,
      contacto: invoice.contacto,
      descripcionServicio: invoice.descripcion_servicio,
      total: invoice.total,
    };

    const pdfBuffer = await generarFactura(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura_${patient.name}_${patient.lastname}.pdf`);

    return res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
}

// eliminar factura
export const deleteInvoice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    return res.status(200).json({ msg: 'Invoice deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};