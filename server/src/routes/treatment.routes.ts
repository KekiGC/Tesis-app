import { Router } from 'express';
import { createTreatment, getTreatments, updateTreatment } from '../controllers/treatment.controller';

const router = Router();

router.post('/treatments', createTreatment);
router.get('/treatments', getTreatments);
router.put('/treatments/:id', updateTreatment);

export default router;