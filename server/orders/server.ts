import app from './app';
import { testGrpcConnection } from './services/grpcClient';

const PORT = process.env.PORT || 5002;

app.listen(PORT, async () => {
    console.log(`Orders server is running on port ${PORT}`);

    // Test gRPC connection to auth service
    const isConnected = await testGrpcConnection();
    if (isConnected) {
        console.log('✅ gRPC connection to auth service established');
    } else {
        console.warn('⚠️  gRPC connection to auth service failed. Shop validation may not work.');
        console.warn('Make sure auth service is running on the configured gRPC port.');
    }
});
