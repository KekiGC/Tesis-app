import { Request, Response } from 'express';
import Invoice from '../models/invoice';
import Counter from '../models/counter';

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
    return res.status(201).json(savedInvoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener facturas
export const getInvoices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const invoices = await Invoice.find().populate('patientId', 'name lastname cedula').populate('doctorId', 'name lastname');
    return res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener factura por id
export const getInvoice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('patientId', 'name lastname cedula').populate('doctorId', 'name lastname');
    return res.status(200).json(invoice);
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