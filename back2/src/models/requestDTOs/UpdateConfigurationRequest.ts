import { IsNotEmpty } from 'class-validator';
import DecoratorUtils from 'src/utils/decoratorUtils';

export class SaveConfigurationRequest {
  @IsNotEmpty()
  newConfig: string;
}
