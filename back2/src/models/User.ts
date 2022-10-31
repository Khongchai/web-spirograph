import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { SavedConfiguration } from './SavedConfiguration';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  email: string;

  @Column()
  savedConfigurations: SavedConfiguration[];

  @Column()
  selectedConfiguration: number;

  constructor(user: Omit<User, 'id'>) {
    Object.assign(this, user);
  }
}
