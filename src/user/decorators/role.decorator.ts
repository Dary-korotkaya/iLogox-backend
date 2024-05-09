import { SetMetadata } from '@nestjs/common';
import { Roles } from '../domain/roles.enum';

export const Role = (role: Roles) => SetMetadata('role', role);