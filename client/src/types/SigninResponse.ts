export type SigninResponse = {
  userId: number;
  name: string;
  email: string;
  admin: boolean;
  createdAt: Date;
  token: string;
  gravatarImageUrl: string;
  lang: string;
};
