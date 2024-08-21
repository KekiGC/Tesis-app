import { Router } from 'express';
import { getReports, getReport, deleteReport } from '../controllers/report.controller';

const router = Router();

// router.post('/reports', createReport);
router.get('/reports/:doctorId', getReports);
router.get('/report/:id', getReport);
router.delete('/reports/:id', deleteReport);

export default router;