import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import Shop from '../models/Shop';

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
        } else {
            // Find shop by shop_code
            shop = await Shop.findOne({ shop_code }).populate('category_id');
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
                shop_code: shop.shop_code,
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

// Create and start gRPC server
export const startGrpcServer = () => {
    const server = new grpc.Server();

    // Add the service implementation
    server.addService(shopProto.ShopService.service, {
        ValidateShopCode: validateShopCode,
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
