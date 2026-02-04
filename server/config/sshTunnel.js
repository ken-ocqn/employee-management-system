import { Client } from 'ssh2';
import net from 'net';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sshClient = null;
let server = null;

/**
 * SSH Tunnel Configuration for EC2 MongoDB Connection
 * This establishes a secure SSH tunnel to the EC2 instance where MongoDB is hosted
 */
export const createSSHTunnel = async () => {
    return new Promise((resolve, reject) => {
        try {
            // Read the private key file
            const privateKeyPath = path.join(__dirname, 'ssh', 'id_ed25519');
            const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

            const sshConfig = {
                host: process.env.SSH_HOST || '47.130.162.157',
                port: parseInt(process.env.SSH_PORT) || 22,
                username: process.env.SSH_USER || 'ubuntu',
                privateKey: privateKey
            };

            const localPort = parseInt(process.env.LOCAL_MONGODB_PORT) || 27017;
            const remoteHost = '127.0.0.1';
            const remotePort = parseInt(process.env.MONGODB_PORT) || 27017;

            console.log(`Establishing SSH tunnel to ${sshConfig.username}@${sshConfig.host}:${sshConfig.port}...`);

            // Create SSH client
            sshClient = new Client();

            // Create local server to forward connections
            server = net.createServer((localSocket) => {
                sshClient.forwardOut(
                    '127.0.0.1',
                    localPort,
                    remoteHost,
                    remotePort,
                    (err, stream) => {
                        if (err) {
                            console.error('Error forwarding connection:', err);
                            localSocket.end();
                            return;
                        }
                        localSocket.pipe(stream).pipe(localSocket);
                    }
                );
            });

            // Handle SSH connection
            sshClient.on('ready', () => {
                console.log('SSH connection established');

                // Start listening on local port
                server.listen(localPort, '127.0.0.1', () => {
                    console.log('SSH tunnel established successfully');
                    console.log(`Local port ${localPort} is now forwarding to remote MongoDB at ${remoteHost}:${remotePort}`);
                    resolve({ sshClient, server });
                });
            });

            sshClient.on('error', (err) => {
                console.error('SSH connection error:', err.message);
                reject(err);
            });

            // Connect to SSH server
            sshClient.connect(sshConfig);

        } catch (error) {
            console.error('Failed to establish SSH tunnel:', error.message);
            reject(error);
        }
    });
};

/**
 * Close the SSH tunnel
 */
export const closeSSHTunnel = async () => {
    return new Promise((resolve) => {
        try {
            if (server) {
                server.close(() => {
                    console.log('Local forwarding server closed');
                });
            }

            if (sshClient) {
                sshClient.end();
                console.log('SSH connection closed');
            }

            resolve();
        } catch (error) {
            console.error('Error closing SSH tunnel:', error.message);
            resolve();
        }
    });
};

/**
 * Get the current tunnel instances
 */
export const getTunnel = () => ({ sshClient, server });
