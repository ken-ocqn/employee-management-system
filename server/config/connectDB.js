import mongoose from "mongoose";
import { createSSHTunnel, closeSSHTunnel } from "./sshTunnel.js";

export const ConnectDB = async () => {
    try {
        const useTunnel = process.env.USE_SSH_TUNNEL === 'true';

        if (useTunnel) {
            // Establish SSH tunnel first
            console.log("Connecting to EC2 MongoDB via SSH tunnel...");
            await createSSHTunnel();

            // Wait a moment for tunnel to be fully established
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            console.log("Connecting directly to MongoDB (SSH tunnel skipped)...");
        }

        // Connect to MongoDB
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected successfully ${useTunnel ? 'through SSH tunnel' : 'directly'}`);

        // Handle cleanup on process termination
        process.on('SIGINT', async () => {
            console.log('\nClosing MongoDB connection and SSH tunnel...');
            await mongoose.connection.close();
            if (useTunnel) await closeSSHTunnel();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await mongoose.connection.close();
            if (useTunnel) await closeSSHTunnel();
            process.exit(0);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        await closeSSHTunnel();
        process.exit(1);
    }
}