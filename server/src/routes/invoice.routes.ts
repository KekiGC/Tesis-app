import { Router } from 'express';
import { createInvoice, getInvoices, getInvoice, deleteInvoice, getInvoicesByCompany } from '../controllers/invoice.controller';

const router = Router();

router.post('/invoices', createInvoice);
router.get('/invoices/:doctorId', getInvoices);
router.get('/invoice/:id', getInvoice);
router.post('/invoices/filter', getInvoicesByCompany);
router.delete('/invoices/:id', deleteInvoice);

export default router;