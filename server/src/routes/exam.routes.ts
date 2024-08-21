import { Router } from 'express';
import { createExam, getExams, getExamById, deleteExam, updateExam } from '../controllers/exam.controller';

const router = Router();

router.post('/exams', createExam);
router.get('/exams/:doctorId', getExams);
router.get('/exam/:id', getExamById);
router.put('/exam/:id', updateExam);
router.delete('/exams/:id', deleteExam);

export default router;