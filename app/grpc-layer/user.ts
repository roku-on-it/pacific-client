import { loadSync } from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { ipcMain } from 'electron';
import { LoginInput } from '../../src/app/component/auth/form-input/login-input';
import { handleUnaryCall } from './helper/handle-unary-call';
import axios from 'axios';
import { Metadata } from '@grpc/grpc-js';

// @ts-ignore
const { UserService } = grpc.loadPackageDefinition(
  loadSync(__dirname + '/user.proto')
).user;

const client = new UserService(
  'localhost:5000',
  grpc.credentials.createInsecure()
);

export function initUserService() {
  handleLogin();
  handleRegister();
}

function handleRegister() {
  ipcMain.on('register', (event, payload: LoginInput) => {
    handleUnaryCall(client, event, payload, 'register');
  });
}

function handleLogin() {
  ipcMain.on('login', async (event, payload: LoginInput) => {
    const response = await axios.get('http://checkip.amazonaws.com');
    const ip = response.data.trimEnd();
    const metadata = new Metadata();
    metadata.add('ip', ip);

    switch (process.platform) {
      case 'win32':
        metadata.add('os', 'WINDOWS');
        break;

      case 'darwin':
        metadata.add('os', 'MACOS');
        break;

      default:
        metadata.add('os', 'LINUX');
        break;
    }

    handleUnaryCall(client, event, payload, 'login', metadata);
  });
}
