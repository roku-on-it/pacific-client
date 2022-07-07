import { Client, Metadata } from '@grpc/grpc-js';
import IpcMainEvent = Electron.IpcMainEvent;

export function handleUnaryCall(
  client: Client,
  event: IpcMainEvent,
  payload: object,
  method: string,
  metadata: Metadata = new Metadata()
) {
  const responseObject: any = { error: {} };
  const unaryRequest = client[method](payload, metadata, (err, response) => {
    responseObject.body = response;

    if (err) {
      const { metadata, ...restErr } = err;
      responseObject.error = { ...responseObject.error, ...restErr };
    }

    event.sender.send(method + 'Response', responseObject);
  });

  unaryRequest.on('metadata', (metadata: Metadata) => {
    responseObject.error.metadata = metadata.getMap();
  });
}
