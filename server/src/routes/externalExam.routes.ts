import { Router } from 'express';
import { createExternalExam, getExternalExam, updateExternalExam, deleteExternalExam, getAllExternalExams } from '../controllers/externalExam.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/externalExams', upload.single('path'), createExternalExam);
router.get('/externalExam/:id', getExternalExam);
router.get('/externalExams/:medicalRecordId', getAllExternalExams);
router.put('/externalExams/:id', upload.single('path'), updateExternalExam);
router.delete('/externalExams/:id', deleteExternalExam);

export default router;