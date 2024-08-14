import { Router } from 'express';
import { getAptitudeProof, getAptitudeProofById, deleteAptitudeProof, createAptitudeProof } from '../controllers/aptitude.controller';

const router = Router();

router.get('/aptitudeProof/:doctorId', getAptitudeProof);
router.get('/aptitudeProof/:id', getAptitudeProofById);
router.post('/aptitudeProof', createAptitudeProof);
router.delete('/aptitudeProof/:id', deleteAptitudeProof);

export default router;