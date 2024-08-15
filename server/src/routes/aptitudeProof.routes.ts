import { Router } from 'express';
import { getAptitudeProof, getAptitudeProofById, deleteAptitudeProof, createAptitudeProof } from '../controllers/aptitude.controller';

const router = Router();

router.get('/aptitudeProofs/:doctorId', getAptitudeProof);
router.get('/aptitudeProof/:id', getAptitudeProofById);
router.post('/aptitudeProofs', createAptitudeProof);
router.delete('/aptitudeProofs/:id', deleteAptitudeProof);

export default router;