import { loadSync } from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';
import { ipcMain } from 'electron';
import { LoginInput } from '../../src/app/component/auth/form-input/login-input';

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
    const responseObject: any = { error: {} };
    const unaryRequest = client.register(payload, (err, response) => {
      responseObject.body = response;

      if (err) {
        const { metadata, ...restErr } = err;
        responseObject.error = { ...responseObject.error, ...restErr };
      }

      event.sender.send('registerResponse', responseObject);
    });

    unaryRequest.on('metadata', (metadata: Metadata) => {
      responseObject.error.metadata = metadata.getMap();
    });
  });
}

function handleLogin() {
  ipcMain.on('login', (event, payload: LoginInput) => {
    client.login(payload, (err, response) => {
      event.returnValue = {
        ...(err && {
          error: {
            code: err.code,
            details: err.details,
            metadata: err.metadata,
          },
        }),
        response,
      };
    });
  });
}
