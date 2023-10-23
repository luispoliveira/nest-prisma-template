export interface LoginResponseInterface {
  accessToken: string;
  userId: number;
  email: string;
  permissions: string[];
  roles: string[];
}
