import { PartialType } from '@nestjs/mapped-types';
import { CreateVchatDto } from './create-vchat.dto';

export class UpdateVchatDto extends PartialType(CreateVchatDto) {
  id: number;
}
