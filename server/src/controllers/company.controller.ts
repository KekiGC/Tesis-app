import { Request, Response } from 'express';
import Company from '../models/company';

// obtener todas las empresas
export const getCompanies = async (req: Request, res: Response): Promise<Response> => {
  try {
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener una empresa por su id
export const getCompanyById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    return res.status(200).json(company);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// crear una empresa
export const createCompany = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, phone, address, rif } = req.body;

  try {
    if (!name || !email || !phone || !address || !rif) {
      return res.status(400).json({ msg: 'Please provide all fields' });
    }

    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();

    return res.status(201).json(savedCompany);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// actualizar una empresa
export const updateCompany = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const updatedCompany = await Company.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCompany) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    return res.status(200).json(updatedCompany);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// eliminar una empresa
export const deleteCompany = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    return res.status(200).json(deletedCompany);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};