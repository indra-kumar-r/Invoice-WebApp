import Company from '../models/company.model.js';

// Create
export const createCompany = async (req: any, res: any) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create company', error });
    }
};

// Get All
export const getAllCompanies = async (_req: any, res: any) => {
    try {
        const companies = await Company.find().sort({ created_at: -1 });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch companies', error });
    }
};

// Get One
export const getCompanyByUUID = async (req: any, res: any) => {
    try {
        const company = await Company.findOne({ uuid: req.params.uuid });
        if (!company)
            return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error });
    }
};

// Update
export const updateCompany = async (req: any, res: any) => {
    try {
        const company = await Company.findOneAndUpdate(
            { uuid: req.params.uuid },
            req.body,
            { new: true }
        );
        if (!company)
            return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error updating company', error });
    }
};

// Delete
export const deleteCompany = async (req: any, res: any) => {
    try {
        const company = await Company.findOneAndDelete({
            uuid: req.params.uuid,
        });
        if (!company)
            return res.status(404).json({ message: 'Company not found' });
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company', error });
    }
};
