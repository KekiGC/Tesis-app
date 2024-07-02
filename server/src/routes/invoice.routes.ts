import { Router } from 'express';
import { createInvoice, getInvoices } from '../controllers/invoice.controller';

const router = Router();

router.post('/invoices', createInvoice);
router.get('/invoices', getInvoices);

export default router;