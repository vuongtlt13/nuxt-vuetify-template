import { Expose } from 'class-transformer'

export default class User {
  constructor (data: User = {} as User) {
    this.id = data.id
    this.name = data.name
    this.password = data.password
    this.email = data.email
  }

  @Expose()
  id: number | null;

  @Expose()
  name: string;

  @Expose()
  password: string;

  @Expose()
  email: string;
}
