import app from './app';
import { testGrpcConnection } from './services/grpcClient';

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
    console.log(`Products server is running on port ${PORT}`);

    // Test gRPC connection to auth service
    try {
        //TODO: use low load api call here
        await testGrpcConnection();
        console.log('✅ gRPC connection to auth service established');
    } catch (error) {
        console.warn('⚠️  gRPC connection to auth service failed. Shop validation may not work.');
        console.warn('Make sure auth service is running on the configured gRPC port.');
    }
});
