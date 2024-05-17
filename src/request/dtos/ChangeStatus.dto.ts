import { RequestStatus } from '../request.entity';
import { IsEnum } from 'class-validator';

export enum AllowedRequestStatus {
  COLLECTION = RequestStatus.COLLECTION,
  ON_THE_WAY = RequestStatus.ON_THE_WAY,
  DELIVERED = RequestStatus.DELIVERED,
  WAITING_FOR_PAYMENT = RequestStatus.WAITING_FOR_PAYMENT,
}
export class ChangeStatusDto {
  @IsEnum(AllowedRequestStatus)
  status: RequestStatus;
}
