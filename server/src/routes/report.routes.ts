import { Router } from 'express';
import { createReport, getReports, getReport, deleteReport } from '../controllers/report.controller';

const router = Router();

router.post('/report', createReport);
router.get('/report/:doctorId', getReports);
router.get('/report/:id', getReport);
router.delete('/report/:id', deleteReport);

export default router;