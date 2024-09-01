import { Router } from 'express';
import { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } from '../controllers/company.controller';

const router = Router();

router.get('/company', getCompanies);
router.get('/company/:id', getCompanyById);
router.post('/company', createCompany);
router.put('/company/:id', updateCompany);
router.delete('/company/:id', deleteCompany);

export default router;