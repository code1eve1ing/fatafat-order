import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Load the proto file
const PROTO_PATH = path.join(__dirname, '../../shared/proto/shop.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const shopProto = grpc.loadPackageDefinition(packageDefinition).shop as any;

// Create gRPC client
const AUTH_SERVICE_URL = process.env.AUTH_GRPC_URL || '127.0.0.1:50051';
const client = new shopProto.ShopService(AUTH_SERVICE_URL, grpc.credentials.createInsecure());

// Interface for shop data
export interface ShopData {
    id: string;
    name: string;
    shop_code: string;
    category_id: string;
    created_at: string;
    updated_at: string;
    // enriched fields
    category_name?: string;
    district_id?: string;
    district_name?: string;
    city_id?: string;
    city_name?: string;
    state_id?: string;
    state_name?: string;
}

// Interface for validation response
export interface ValidationResponse {
    success: boolean;
    message: string;
    shop: ShopData | null;
}

export interface ListShopsParams {
    page?: number;
    limit?: number;
    name?: string;
    category_id?: string;
    district_id?: string;
    city_id?: string;
    state_id?: string;
}

export interface ListShopsResponse {
    shops: ShopData[];
    total: number;
    page: number;
    limit: number;
}

// Validate shop code function
export const validateShopCode = (shop_code: string): Promise<ValidationResponse> => {
    return new Promise((resolve, reject) => {
        // Set a timeout for the gRPC call
        const deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 5); // 5 second timeout

        client.ValidateShopCode({ shop_code }, { deadline }, (error: any, response: any) => {
            if (error) {
                console.error('gRPC client error:', error);
                
                // Return a graceful error response instead of rejecting
                resolve({
                    success: false,
                    message: 'Shop validation service unavailable. Please try again later.',
                    shop: null
                });
                return;
            }

            resolve({
                success: response.success,
                message: response.message,
                shop: response.shop || null
            });
        });
    });
};

// List shops with pagination and filters
export const listShops = (params: ListShopsParams = {}): Promise<ListShopsResponse> => {
    return new Promise((resolve, reject) => {
        const deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 5);

        const request = {
            page: params.page || 1,
            limit: params.limit || 20,
            name: params.name || '',
            category_id: params.category_id || '',
            district_id: params.district_id || '',
            city_id: params.city_id || '',
            state_id: params.state_id || '',
        };

        client.ListShops(request, { deadline }, (error: any, response: any) => {
            if (error) {
                console.error('gRPC ListShops error:', error);
                return reject(error);
            }
            resolve({
                shops: response.shops || [],
                total: response.total || 0,
                page: response.page || request.page,
                limit: response.limit || request.limit,
            });
        });
    });
};

// Test connection function
export const testGrpcConnection = (): Promise<boolean> => {
    return new Promise((resolve) => {
        // Set a short timeout for connection test
        const deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 3); // 3 second timeout for test

        // Test with a dummy shop code to check connectivity
        client.ValidateShopCode({ shop_code: 'TEST-0000' }, { deadline }, (error: any, response: any) => {
            if (error) {
                console.error('gRPC connection test failed:', error.message || error);
                resolve(false);
                return;
            }
            console.log('gRPC connection test successful');
            resolve(true);
        });
    });
};

export default client;
