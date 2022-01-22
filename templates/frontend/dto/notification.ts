import { Expose } from 'class-transformer'

export default class Notification {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  detail: string;

  @Expose()
  link: string|null;

  @Expose({ name: 'is_read' })
  isRead: boolean;

  @Expose({ name: 'created_at' })
  createdAt: any;
}
