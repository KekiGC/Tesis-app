import { Router } from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.controller';

const router = Router();

router.post('/user/note', createNote);
router.get('/user/note/:doctorId', getNotes);
router.put('/user/note/:noteId', updateNote);
router.delete('/user/note/:noteId', deleteNote);

export default router;