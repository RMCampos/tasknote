import { createContext } from 'react';
import { User } from '../types/User';
import { SigninResponse } from '../types/SigninResponse';

export interface AuthContextData {
  signed: boolean;
  user: User | undefined;
  checkCurrentAuthUser: (pathname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<string>;
  signOut: () => void;
  register: (email: string, password: string) => Promise<string>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default AuthContext;
