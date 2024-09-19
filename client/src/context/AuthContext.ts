import { createContext } from 'react';
import { User } from '../types/User';

export interface AuthContextData {
  signed: boolean;
  user: User | undefined;
  checkCurrentAuthUser: (pathname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default AuthContext;
