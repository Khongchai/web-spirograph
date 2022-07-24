import { IsNotEmpty } from 'class-validator';

export class UpdateConfigurationRequest {
  @IsNotEmpty()
  newConfig: string;
}
