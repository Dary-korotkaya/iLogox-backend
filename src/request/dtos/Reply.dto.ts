import { IsBoolean } from 'class-validator';

export class ReplyDto {
  @IsBoolean()
  confirm: boolean;
}
