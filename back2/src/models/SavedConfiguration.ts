import { randomUUID } from 'crypto';

export class SavedConfiguration {
  //Just a unique identifier, as this is not a typeORM entity
  id: string;

  // Milliseconds
  date: number;

  data: string;

  constructor({ id, data }: { id?: string; data?: string }) {
    Object.assign(this, {
      id: id ?? randomUUID(),
      date: Date.now(),
      data: data,
    } as SavedConfiguration);
  }
}
