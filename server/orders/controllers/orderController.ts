import { Request, Response } from 'express';
import Order, { IOrder, IOrderItem } from '../models/Order';
import { validateShopCode } from '../services/grpcClient';
import { sendEmailOTP, sendMobileOTP, verifyOTP, isOTPVerified } from '../services/otpService';

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { identifier, type } = req.body;

        let result;
        if (type === 'email') {
            result = await sendEmailOTP(identifier);
        } else {
            result = await sendMobileOTP(identifier);
        }

        res.status(200).json({
            success: result.success,
            message: result.message
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const verifyOTPController = async (req: Request, res: Response) => {
    try {
        const { identifier, otp, type } = req.body;

        const result = await verifyOTP(identifier, otp, type);

        res.status(result.success ? 200 : 400).json({
            success: result.success,
            message: result.message
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const {
            shop_id,
            customer_email,
            customer_mobile,
            customer_name,
            items,
            subtotal,
            tax_amount = 0,
            total_amount,
            notes
        } = req.body;

        // Validate that at least email or mobile is provided
        if (!customer_email && !customer_mobile) {
            return res.status(400).json({
                success: false,
                message: 'Either email or mobile number is required'
            });
        }

        // Verify OTP for the provided identifier
        let otpVerified = false;
        if (customer_email) {
            otpVerified = await isOTPVerified(customer_email, 'email');
        }
        if (!otpVerified && customer_mobile) {
            otpVerified = await isOTPVerified(customer_mobile, 'mobile');
        }

        if (!otpVerified) {
            return res.status(400).json({
                success: false,
                message: 'Please verify your email or mobile number with OTP before placing the order'
            });
        }

        // Validate shop exists (using gRPC call to auth service)
        try {
            const shopValidation = await validateShopCode(shop_id);
            if (!shopValidation.success || !shopValidation.shop) {
                return res.status(404).json({
                    success: false,
                    message: shopValidation.message || 'Shop not found'
                });
            }
        } catch (error) {
            console.error('Error validating shop:', error);
            // Continue with order creation even if gRPC fails
        }

        // Calculate totals for each item
        const orderItems: IOrderItem[] = items.map((item: any) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        }));

        // Verify calculated totals
        const calculatedSubtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
            return res.status(400).json({
                success: false,
                message: 'Subtotal calculation mismatch'
            });
        }

        const calculatedTotal = calculatedSubtotal + tax_amount;
        if (Math.abs(calculatedTotal - total_amount) > 0.01) {
            return res.status(400).json({
                success: false,
                message: 'Total amount calculation mismatch'
            });
        }

        // Create the order
        const order = new Order({
            shop_id,
            customer_email,
            customer_mobile,
            customer_name,
            items: orderItems,
            subtotal: calculatedSubtotal,
            tax_amount,
            total_amount: calculatedTotal,
            notes,
            status: 'pending',
            payment_status: 'pending'
        });

        const savedOrder = await order.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order_id: savedOrder.order_id,
                _id: savedOrder._id,
                status: savedOrder.status,
                total_amount: savedOrder.total_amount,
                created_at: savedOrder.created_at
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            $or: [
                { order_id: orderId },
                { _id: orderId }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getOrdersByShop = async (req: Request, res: Response) => {
    try {
        const { shopId } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        const query: any = { shop_id: shopId };
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .sort({ created_at: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                $or: [
                    { order_id: orderId },
                    { _id: orderId }
                ]
            },
            { status, updated_at: new Date() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
