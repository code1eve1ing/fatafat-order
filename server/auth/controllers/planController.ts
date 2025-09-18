import { Request, Response } from 'express';
import Plan, { IPlan } from '../models/Plan';
import { validationResult } from 'express-validator';

// Create a new plan (Admin only)
export const createPlan = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, desc, features, applicable_role, price, usage_period } = req.body;

        // Check if plan with same title already exists
        const existingPlan = await Plan.findOne({ title: title.trim() });
        if (existingPlan) {
            return res.status(400).json({
                success: false,
                message: 'Plan with this title already exists'
            });
        }

        const plan = new Plan({
            title,
            desc,
            features,
            applicable_role,
            price,
            usage_period
        });

        const savedPlan = await plan.save();

        res.status(201).json({
            success: true,
            message: 'Plan created successfully',
            data: savedPlan
        });
    } catch (error: any) {
        console.error('Create plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all plans
export const getPlans = async (req: Request, res: Response) => {
    try {
        const { role, active } = req.query;
        
        let filter: any = {};
        
        if (role) {
            filter.applicable_role = { $in: [role, 'both'] };
        }
        
        if (active !== undefined) {
            filter.isActive = active === 'true';
        }

        const plans = await Plan.find(filter)
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            success: true,
            message: 'Plans retrieved successfully',
            data: plans,
            count: plans.length
        });
    } catch (error: any) {
        console.error('Get plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get a single plan by ID
export const getPlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findById(id).select('-__v');
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Plan retrieved successfully',
            data: plan
        });
    } catch (error: any) {
        console.error('Get plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update a plan (Admin only)
export const updatePlan = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { title, desc, features, applicable_role, price, usage_period, isActive } = req.body;

        // Check if plan exists
        const existingPlan = await Plan.findById(id);
        if (!existingPlan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        // Check if title is being changed and if new title already exists
        if (title && title.trim() !== existingPlan.title) {
            const planWithSameTitle = await Plan.findOne({ 
                title: title.trim(),
                _id: { $ne: id }
            });
            if (planWithSameTitle) {
                return res.status(400).json({
                    success: false,
                    message: 'Plan with this title already exists'
                });
            }
        }

        const updateData: Partial<IPlan> = {};
        if (title !== undefined) updateData.title = title;
        if (desc !== undefined) updateData.desc = desc;
        if (features !== undefined) updateData.features = features;
        if (applicable_role !== undefined) updateData.applicable_role = applicable_role;
        if (price !== undefined) updateData.price = price;
        if (usage_period !== undefined) updateData.usage_period = usage_period;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedPlan = await Plan.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-__v');

        res.status(200).json({
            success: true,
            message: 'Plan updated successfully',
            data: updatedPlan
        });
    } catch (error: any) {
        console.error('Update plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete a plan (Admin only)
export const deletePlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findById(id);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        // Soft delete by setting isActive to false
        const deletedPlan = await Plan.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).select('-__v');

        res.status(200).json({
            success: true,
            message: 'Plan deleted successfully',
            data: deletedPlan
        });
    } catch (error: any) {
        console.error('Delete plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Validate plan for payment service
export const validatePlan = async (req: Request, res: Response) => {
    try {
        const { plan_id } = req.body;

        if (!plan_id) {
            return res.status(400).json({
                success: false,
                valid: false,
                message: 'Plan ID is required'
            });
        }

        const plan = await Plan.findById(plan_id);
        
        if (!plan || !plan.isActive) {
            return res.status(404).json({
                success: false,
                valid: false,
                message: 'Plan not found or inactive'
            });
        }

        res.status(200).json({
            success: true,
            valid: true,
            message: 'Plan is valid',
            data: {
                id: plan._id,
                title: plan.title,
                price: plan.price,
                applicable_role: plan.applicable_role
            }
        });
    } catch (error: any) {
        console.error('Validate plan error:', error);
        res.status(500).json({
            success: false,
            valid: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
