import { IsNotEmpty } from 'class-validator';

export class DeleteConfigurationRequest {
  @IsNotEmpty()
  configurationId: string;
}
