import { Router } from 'express';
import { createMedicine, getMedicines, updateMedicine, deleteMedicine } from '../controllers/medicine.controller';

const router = Router();

router.post('/medicines', createMedicine);
router.get('/medicines', getMedicines);
router.put('/medicines/:id', updateMedicine);
router.delete('/medicines/:id', deleteMedicine);

export default router;