import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class SavedConfiguration {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  data: string;

  constructor(savedConfiguration: Omit<SavedConfiguration, 'id'>) {
    Object.assign(this, savedConfiguration);
  }
}
