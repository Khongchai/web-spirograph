import { IsNotEmpty } from 'class-validator';

export class DeleteConfigurationRequest {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  configurationId: string;
}
