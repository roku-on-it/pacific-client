import { initUserService } from './user';
import { initPasswordService } from './password';

export function bootstrapGrpcLayer() {
  initUserService();
  initPasswordService();
}
