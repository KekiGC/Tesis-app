import { Request, Response } from 'express';
import Note from '../models/note';

export const createNote = async (req: Request, res: Response): Promise<Response> => {
    const { doctorId, content } = req.body;
  
    if (!doctorId || !content) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
  
    try {
      const newNote = new Note({
        doctorId,
        content,
      });
  
      const savedNote = await newNote.save();
      return res.status(201).json(savedNote);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal server error' });
    }
};

// obtener todas las notas de un doctor
export const getNotes = async (req: Request, res: Response): Promise<Response> => {
    const { doctorId } = req.params;
  
    if (!doctorId) {
      return res.status(400).json({ msg: 'Please provide doctorId' });
    }
  
    try {
      const notes = await Note.find({ doctorId });
      return res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal server error' });
    }
};

// editar una nota
export const updateNote = async (req: Request, res: Response): Promise<Response> => {
    const { content } = req.body;
    const { noteId } = req.params;
  
    if (!content || !noteId) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
  
    try {
      const updatedNote = await Note.findByIdAndUpdate(noteId, { content }, { new: true });
      return res.status(200).json(updatedNote);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal server error' });
    }
};

// eliminar una nota
export const deleteNote = async (req: Request, res: Response): Promise<Response> => {
    const { noteId } = req.params;
  
    if (!noteId) {
      return res.status(400).json({ msg: 'Please provide noteId' });
    }
  
    try {
      await Note.findByIdAndDelete(noteId);
      return res.status(204).json();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal server error' });
    }
};