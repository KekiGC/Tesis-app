import { Router } from 'express';
import { createTreatment, getTreatments, updateTreatment, deleteTreatment, getTreatment } from '../controllers/treatment.controller';

const router = Router();

router.post('/treatments', createTreatment);
router.get('/treatments/:medicalRecordId', getTreatments);
router.get('/treatment/:id', getTreatment);
router.put('/treatments/:id', updateTreatment);
router.delete('/treatments/:id', deleteTreatment);

export default router;