export type JwtPayloadType = {
  userId: number;
  email: string;
  permissions: string[];
  roles: string[];
};
