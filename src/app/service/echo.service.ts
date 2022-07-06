import { Injectable } from '@angular/core';
import { ExampleRequest, ExampleResponse } from '../../../app/grpc-layer/echo';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { UnaryCallResponse } from '../../../app/grpc-layer';
import { ServiceError } from '@grpc/grpc-js';

@Injectable({
  providedIn: 'root',
})
export class EchoService {
  constructor() {}

  unaryCall(payload: ExampleRequest): Observable<ExampleResponse> {
    const call: UnaryCallResponse = ipcRenderer.sendSync('unaryCall', payload);

    return new Observable<ExampleResponse>((subscriber) => {
      if (null != call.error) {
        subscriber.error(call.error as ServiceError);
      } else {
        subscriber.next(call.body);
      }
    });
  }
}
