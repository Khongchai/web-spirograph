import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { SavedConfiguration } from './SavedConfiguration';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column(() => SavedConfiguration)
  savedConfigurations: SavedConfiguration[];

  constructor(user: Omit<User, 'id'>) {
    Object.assign(this, user);
  }
}
