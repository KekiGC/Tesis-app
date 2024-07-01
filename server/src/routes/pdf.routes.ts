// server/src/routes/pdf.routes.ts

import express from 'express';
import { PdfcreatorController } from '../controllers/pdfcreator.controller';

const router = express.Router();

router.post('/createPDF', PdfcreatorController.createMedicalRestPDF);

export default router;
