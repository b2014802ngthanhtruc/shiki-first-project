export class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  adminStatus: string;
  userStatus: string;
  salerStatus: string;
  isAdmin: boolean;
  isUser: boolean;
  isSaler: boolean;

  deleteAt?: Date;
}
