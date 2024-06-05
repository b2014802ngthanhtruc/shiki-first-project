export class UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  adminStatus: string;
  usersStatus: string;
  salerStatus: string;
  isAdmin: boolean;
  isUser: boolean;
  isSaler: boolean;

  createAt: Date;
  updateAt: Date;
  deleteAt: Date;
}
