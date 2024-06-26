export class JwtAccessPayload {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isAdmin: string;
  isUser: string;
  isSaler: string;
}
