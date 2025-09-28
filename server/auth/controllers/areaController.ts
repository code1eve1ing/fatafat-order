import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import State from '../models/State';
import City from '../models/City';
import District from '../models/District';
import { AuthRequest } from '../middleware/auth';

// State Controllers
export const createState = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, code } = req.body;

        // Check if state already exists
        const existingState = await State.findOne({ 
            $or: [
                { name: name.trim() },
                { code: code.trim().toUpperCase() }
            ]
        });
        
        if (existingState) {
            return res.status(400).json({ 
                message: 'State with this name or code already exists' 
            });
        }

        const state = new State({
            name: name.trim(),
            code: code.trim().toUpperCase()
        });

        await state.save();

        res.status(201).json({
            message: 'State created successfully',
            state: {
                id: state._id,
                name: state.name,
                code: state.code
            }
        });
    } catch (error: any) {
        console.error('Create state error:', error);
        res.status(500).json({ message: 'Server error while creating state' });
    }
};

export const getStates = async (req: Request, res: Response) => {
    try {
        const states = await State.find()
            .select('_id name code')
            .sort({ name: 1 });

        res.json({
            states,
            count: states.length
        });
    } catch (error: any) {
        console.error('Get states error:', error);
        res.status(500).json({ message: 'Server error while fetching states' });
    }
};

export const getState = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const state = await State.findById(id);
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        res.json({
            state: {
                id: state._id,
                name: state.name,
                code: state.code
            }
        });
    } catch (error: any) {
        console.error('Get state error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid state ID format' });
        }
        res.status(500).json({ message: 'Server error while fetching state' });
    }
};

export const updateState = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, code } = req.body;

        const state = await State.findById(id);
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        // Check if another state already has this name or code
        const existingState = await State.findOne({
            $or: [
                { name: name.trim() },
                { code: code.trim().toUpperCase() }
            ],
            _id: { $ne: id }
        });

        if (existingState) {
            return res.status(400).json({ 
                message: 'Another state with this name or code already exists' 
            });
        }

        state.name = name.trim();
        state.code = code.trim().toUpperCase();
        await state.save();

        res.json({
            message: 'State updated successfully',
            state: {
                id: state._id,
                name: state.name,
                code: state.code
            }
        });
    } catch (error: any) {
        console.error('Update state error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid state ID format' });
        }
        res.status(500).json({ message: 'Server error while updating state' });
    }
};

export const deleteState = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Check if state has cities
        const citiesCount = await City.countDocuments({ stateId: id });
        if (citiesCount > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete state with existing cities. Delete cities first.' 
            });
        }

        const state = await State.findByIdAndDelete(id);
        if (!state) {
            return res.status(404).json({ message: 'State not found' });
        }

        res.json({
            message: 'State deleted successfully',
            state: {
                id: state._id,
                name: state.name,
                code: state.code
            }
        });
    } catch (error: any) {
        console.error('Delete state error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid state ID format' });
        }
        res.status(500).json({ message: 'Server error while deleting state' });
    }
};

// City Controllers
export const createCity = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, stateId } = req.body;

        // Check if state exists
        const state = await State.findById(stateId);
        if (!state) {
            return res.status(400).json({ message: 'State not found' });
        }

        // Check if city already exists in this state
        const existingCity = await City.findOne({ 
            name: name.trim(),
            stateId 
        });
        
        if (existingCity) {
            return res.status(400).json({ 
                message: 'City with this name already exists in the selected state' 
            });
        }

        const city = new City({
            name: name.trim(),
            stateId
        });

        await city.save();

        // Populate state information
        await city.populate('stateId', 'name code');

        res.status(201).json({
            message: 'City created successfully',
            city: {
                id: city._id,
                name: city.name,
                state: city.stateId
            }
        });
    } catch (error: any) {
        console.error('Create city error:', error);
        res.status(500).json({ message: 'Server error while creating city' });
    }
};

export const getCities = async (req: Request, res: Response) => {
    try {
        const { stateId } = req.query;
        
        let query = {};
        if (stateId) {
            query = { stateId };
        }

        const cities = await City.find(query)
            .populate('stateId', 'name code')
            .select('_id name stateId')
            .sort({ name: 1 });

        res.json({
            cities,
            count: cities.length
        });
    } catch (error: any) {
        console.error('Get cities error:', error);
        res.status(500).json({ message: 'Server error while fetching cities' });
    }
};

export const getCity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const city = await City.findById(id).populate('stateId', 'name code');
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        res.json({
            city: {
                id: city._id,
                name: city.name,
                state: city.stateId
            }
        });
    } catch (error: any) {
        console.error('Get city error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid city ID format' });
        }
        res.status(500).json({ message: 'Server error while fetching city' });
    }
};

export const updateCity = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, stateId } = req.body;

        const city = await City.findById(id);
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        // Check if state exists
        const state = await State.findById(stateId);
        if (!state) {
            return res.status(400).json({ message: 'State not found' });
        }

        // Check if another city already has this name in the same state
        const existingCity = await City.findOne({
            name: name.trim(),
            stateId,
            _id: { $ne: id }
        });

        if (existingCity) {
            return res.status(400).json({ 
                message: 'Another city with this name already exists in the selected state' 
            });
        }

        city.name = name.trim();
        city.stateId = stateId;
        await city.save();

        await city.populate('stateId', 'name code');

        res.json({
            message: 'City updated successfully',
            city: {
                id: city._id,
                name: city.name,
                state: city.stateId
            }
        });
    } catch (error: any) {
        console.error('Update city error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid city ID format' });
        }
        res.status(500).json({ message: 'Server error while updating city' });
    }
};

export const deleteCity = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Check if city has districts
        const districtsCount = await District.countDocuments({ cityId: id });
        if (districtsCount > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete city with existing districts. Delete districts first.' 
            });
        }

        const city = await City.findByIdAndDelete(id).populate('stateId', 'name code');
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        res.json({
            message: 'City deleted successfully',
            city: {
                id: city._id,
                name: city.name,
                state: city.stateId
            }
        });
    } catch (error: any) {
        console.error('Delete city error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid city ID format' });
        }
        res.status(500).json({ message: 'Server error while deleting city' });
    }
};

// District Controllers
export const createDistrict = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, cityId } = req.body;

        // Check if city exists
        const city = await City.findById(cityId).populate('stateId', 'name code');
        if (!city) {
            return res.status(400).json({ message: 'City not found' });
        }

        // Check if district already exists in this city
        const existingDistrict = await District.findOne({ 
            name: name.trim(),
            cityId 
        });
        
        if (existingDistrict) {
            return res.status(400).json({ 
                message: 'District with this name already exists in the selected city' 
            });
        }

        const district = new District({
            name: name.trim(),
            cityId
        });

        await district.save();

        // Populate city and state information
        await district.populate({
            path: 'cityId',
            populate: {
                path: 'stateId',
                select: 'name code'
            }
        });

        res.status(201).json({
            message: 'District created successfully',
            district: {
                id: district._id,
                name: district.name,
                city: district.cityId
            }
        });
    } catch (error: any) {
        console.error('Create district error:', error);
        res.status(500).json({ message: 'Server error while creating district' });
    }
};

export const getDistricts = async (req: Request, res: Response) => {
    try {
        const { cityId } = req.query;
        
        let query = {};
        if (cityId) {
            query = { cityId };
        }

        const districts = await District.find(query)
            .populate({
                path: 'cityId',
                populate: {
                    path: 'stateId',
                    select: 'name code'
                }
            })
            .select('_id name cityId')
            .sort({ name: 1 });

        res.json({
            districts,
            count: districts.length
        });
    } catch (error: any) {
        console.error('Get districts error:', error);
        res.status(500).json({ message: 'Server error while fetching districts' });
    }
};

export const getDistrict = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const district = await District.findById(id)
            .populate({
                path: 'cityId',
                populate: {
                    path: 'stateId',
                    select: 'name code'
                }
            });
            
        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        res.json({
            district: {
                id: district._id,
                name: district.name,
                city: district.cityId
            }
        });
    } catch (error: any) {
        console.error('Get district error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid district ID format' });
        }
        res.status(500).json({ message: 'Server error while fetching district' });
    }
};

export const updateDistrict = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, cityId } = req.body;

        const district = await District.findById(id);
        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        // Check if city exists
        const city = await City.findById(cityId);
        if (!city) {
            return res.status(400).json({ message: 'City not found' });
        }

        // Check if another district already has this name in the same city
        const existingDistrict = await District.findOne({
            name: name.trim(),
            cityId,
            _id: { $ne: id }
        });

        if (existingDistrict) {
            return res.status(400).json({ 
                message: 'Another district with this name already exists in the selected city' 
            });
        }

        district.name = name.trim();
        district.cityId = cityId;
        await district.save();

        await district.populate({
            path: 'cityId',
            populate: {
                path: 'stateId',
                select: 'name code'
            }
        });

        res.json({
            message: 'District updated successfully',
            district: {
                id: district._id,
                name: district.name,
                city: district.cityId
            }
        });
    } catch (error: any) {
        console.error('Update district error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid district ID format' });
        }
        res.status(500).json({ message: 'Server error while updating district' });
    }
};

export const deleteDistrict = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const district = await District.findByIdAndDelete(id)
            .populate({
                path: 'cityId',
                populate: {
                    path: 'stateId',
                    select: 'name code'
                }
            });
            
        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        res.json({
            message: 'District deleted successfully',
            district: {
                id: district._id,
                name: district.name,
                city: district.cityId
            }
        });
    } catch (error: any) {
        console.error('Delete district error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid district ID format' });
        }
        res.status(500).json({ message: 'Server error while deleting district' });
    }
};

// Get all areas with hierarchy
export const getAllAreas = async (req: Request, res: Response) => {
    try {
        const districts = await District.find()
            .populate({
                path: 'cityId',
                populate: {
                    path: 'stateId',
                    select: 'name code'
                }
            })
            .select('_id name cityId')
            .sort({ name: 1 });

        res.json({
            areas: districts,
            count: districts.length
        });
    } catch (error: any) {
        console.error('Get all areas error:', error);
        res.status(500).json({ message: 'Server error while fetching areas' });
    }
};
