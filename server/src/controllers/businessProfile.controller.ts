import BusinessProfile from '../models/businessProfile.model.js';

export const createProfile = async (req: any, res: any) => {
    try {
        const existing = await BusinessProfile.findOne();
        if (existing)
            return res.status(400).json({ message: 'Profile already exists' });

        const profile = await BusinessProfile.create(req.body);
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create profile', error });
    }
};

export const getProfile = async (_req: any, res: any) => {
    try {
        const profile = await BusinessProfile.findOne();
        if (!profile)
            return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get profile', error });
    }
};

export const updateProfile = async (req: any, res: any) => {
    try {
        const profile = await BusinessProfile.findOneAndUpdate(
            { uuid: req.params.uuid },
            req.body,
            { new: true }
        );
        if (!profile)
            return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error });
    }
};
