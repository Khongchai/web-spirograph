import { randomUUID } from 'crypto';

export class SavedConfiguration {
  //Just a unique identifier, as this is not a typeORM entity
  id: string;

  data: string;

  constructor(savedConfiguration: Omit<SavedConfiguration, 'id'>) {
    Object.assign(this, {
      id: randomUUID(),
      data: savedConfiguration.data,
    } as SavedConfiguration);
  }
}
