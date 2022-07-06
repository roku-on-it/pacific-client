import { loadSync } from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { ipcMain } from 'electron';

export interface ExampleRequest {
  name: string;
}

export interface ExampleResponse {
  message: string;
}

// @ts-ignore
const { EchoService } = grpc.loadPackageDefinition(
  loadSync(__dirname + '/echo.proto')
).echo;

const client = new EchoService(
  'localhost:5000',
  grpc.credentials.createInsecure()
);

export function initEchoService() {
  handleUnaryCall();
}

function handleUnaryCall() {
  ipcMain.on('unaryCall', (event, payload: ExampleRequest) => {
    client.unaryCall(payload, (err, response) => {
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
