import { IsNotEmpty } from 'class-validator';

export class SaveConfigurationRequest {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  newConfig: string;
}
