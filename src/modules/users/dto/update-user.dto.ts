export class UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  adminStatus: string;
  usersStatus: string;
  isAdmin: boolean;
  isUser: boolean;

  createAt: Date;
  updateAt: Date;
  deleteAt: Date;
}
