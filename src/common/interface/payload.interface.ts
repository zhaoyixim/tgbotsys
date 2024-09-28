import { Role } from '../../backend/common/enums/role.enum';

export interface UserPayload {
  id: string;
  username: string;
  role: Role;
}
