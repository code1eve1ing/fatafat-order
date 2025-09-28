import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import Shop from '../models/Shop';
import District from '../models/District';
import City from '../models/City';

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

// Implement the validateShopCode function (supports both shop code and shop ID)
export const validateShopCode = async (call: any, callback: any) => {
    try {
        const { shop_code } = call.request;

        if (!shop_code) {
            return callback(null, {
                success: false,
                message: 'Shop code or ID is required',
                shop: null
            });
        }

        // Check if the parameter is a MongoDB ObjectId or shop code
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(shop_code);
        let shop: any;

        if (isObjectId) {
            // Find shop by _id
            shop = await Shop.findById(shop_code).populate('category_id');
        }

        if (!shop) {
            return callback(null, {
                success: false,
                message: `Shop not found with the provided ${isObjectId ? 'ID' : 'shop code'}`,
                shop: null
            });
        }

        // Return shop details
        callback(null, {
            success: true,
            message: 'Shop found successfully',
            shop: {
                id: shop._id.toString(),
                name: shop.name,
                category_id: shop.category_id?._id?.toString() || shop.category_id?.toString(),
                created_at: shop.createdAt?.toISOString() || '',
                updated_at: shop.updatedAt?.toISOString() || ''
            }
        });
    } catch (error) {
        console.error('gRPC validateShopCode error:', error);
        callback(null, {
            success: false,
            message: 'Internal server error',
            shop: null
        });
    }
};

// Implement ListShops with pagination and filters
export const listShops = async (call: any, callback: any) => {
    try {
        const {
            page = 1,
            limit = 20,
            name = '',
            category_id = '',
            district_id = '',
            city_id = '',
            state_id = '',
        } = call.request || {};

        const pageNum = Math.max(1, Number(page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));

        // Build base filter
        const filter: any = {};

        if (name) {
            filter.name = { $regex: new RegExp(name, 'i') };
        }
        if (category_id) {
            filter.category_id = category_id;
        }

        // Resolve district filter based on district/city/state ids
        let districtIds: string[] = [];
        
        try {
            if (district_id) {
                districtIds = [district_id];
            } else if (city_id) {
                const districts = await District.find({ cityId: city_id }).select('_id').lean();
                districtIds = districts.map((d) => d._id.toString());
            } else if (state_id) {
                const cities = await City.find({ stateId: state_id }).select('_id').lean();
                const cityIds = cities.map((c) => c._id.toString());
                if (cityIds.length > 0) {
                    const districts = await District.find({ cityId: { $in: cityIds } }).select('_id').lean();
                    districtIds = districts.map((d) => d._id.toString());
                }
            }
            
            if (districtIds.length > 0) {
                filter.district_id = { $in: districtIds };
            }
        } catch (error) {
            console.error('Error resolving district filters:', error);
            // Continue with empty district filter if there's an error
        }

        const total = await Shop.countDocuments(filter);

        const shops = await Shop.find(filter)
            .sort({ _id: -1 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .populate('category_id')
            .populate({
                path: 'district_id',
                populate: {
                    path: 'cityId',
                    populate: {
                        path: 'stateId'
                    }
                }
            });

        const mapped = shops.map((s: any) => {
            const district: any = s.district_id || {};
            const city: any = district?.cityId || {};
            const state: any = city?.stateId || {};
            const category: any = s.category_id || {};
            return {
                id: s._id.toString(),
                name: s.name,
                shop_code: s.shop_code || '',
                category_id: category?._id?.toString() || '',
                created_at: s.createdAt?.toISOString?.() || '',
                updated_at: s.updatedAt?.toISOString?.() || '',
                category_name: category?.name || '',
                district_id: district?._id?.toString() || '',
                district_name: district?.name || '',
                city_id: city?._id?.toString() || '',
                city_name: city?.name || '',
                state_id: state?._id?.toString() || '',
                state_name: state?.name || '',
            };
        });

        callback(null, { shops: mapped, total, page: pageNum, limit: pageSize });
    } catch (error) {
        console.error('gRPC ListShops error:', error);
        callback(error);
    }
};

// Create and start gRPC server
export const startGrpcServer = () => {
    const server = new grpc.Server();

    // Add the service implementation
    server.addService(shopProto.ShopService.service, {
        ValidateShopCode: validateShopCode,
        ListShops: listShops,
    });

    const port = process.env.GRPC_PORT || '50051';
    const address = `127.0.0.1:${port}`;

    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
        if (err) {
            console.error('Failed to start gRPC server:', err);
            return;
        }
        console.log(`gRPC server running on ${address} (port ${boundPort})`);
        // Note: server.start() is no longer needed in newer versions of @grpc/grpc-js
    });

    return server;
};
