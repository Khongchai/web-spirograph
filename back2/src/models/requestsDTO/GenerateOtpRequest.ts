import { IsNotEmpty } from 'class-validator';

export class GenerateOtpRequest {
  @IsNotEmpty()
  email: string;
}
