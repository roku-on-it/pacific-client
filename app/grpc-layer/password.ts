import { loadSync } from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { ClientWritableStream, Metadata } from '@grpc/grpc-js';
import { ipcMain } from 'electron';
import { CreatePassword } from '../../src/app/component/layout/component/home/form-input/create-password';
import { dialog } from 'electron';

// @ts-ignore
const { PasswordService } = grpc.loadPackageDefinition(
  loadSync(__dirname + '/password.proto')
).password;

const client = new PasswordService(
  'localhost:5000',
  grpc.credentials.createInsecure()
);

export function initPasswordService() {
  handlePasswordCreate();
  handlePasswordList();
}

function handlePasswordCreate() {
  ipcMain.on('password-create-start', () => {
    const metadata = new Metadata();

    metadata.set('qid', '5573211587324dffb68d55e92702f945');
    const call: ClientWritableStream<CreatePassword> = client.create(
      metadata,
      () => {}
    );

    ipcMain.removeAllListeners('password-create-chunk');
    ipcMain.on('password-create-chunk', (event, chunk: CreatePassword) => {
      console.log('chunk');
      call.write(chunk);
    });

    ipcMain.removeAllListeners('password-create-end');
    ipcMain.once('password-create-end', () => {
      console.log('ended stream');
      call.end();
    });
  });
}

function handlePasswordList() {
  ipcMain.on('password-list-start', (event) => {
    const metadata = new Metadata();

    metadata.set('qid', '5573211587324dffb68d55e92702f945');

    const call = client.list(metadata);

    call.on('error', (e) => {
      if (1 !== e.code) {
        dialog.showMessageBox({
          message: e.details,
          type: 'warning',
        });
      }
    });

    call.on('data', (data) => {
      event.sender.send('password-list-data', data);
    });

    ipcMain.removeAllListeners('password-list-chunk');
    ipcMain.on('password-list-chunk', (event, chunk) => {
      call.write(chunk);
    });

    ipcMain.once('password-list-end', () => {
      call.cancel();
    });
  });
}
