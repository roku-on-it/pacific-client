import { initUserService } from './user';

export interface UnaryCallResponse<T = any> {
  body: T;
  error: {
    code: number;
    details: string;
    metadata: object;
  };
}

export function bootstrapGrpcLayer() {
  initUserService();
}
