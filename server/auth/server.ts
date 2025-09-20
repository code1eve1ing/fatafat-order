import app from './app';
import { startGrpcServer } from './services/grpcServer';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Start gRPC server
startGrpcServer();