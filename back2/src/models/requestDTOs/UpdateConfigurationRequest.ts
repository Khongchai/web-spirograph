import { IsNotEmpty } from 'class-validator';

export class SaveConfigurationRequest {
  @IsNotEmpty()
  newConfig: string;
}
