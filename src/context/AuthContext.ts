import { createContext } from 'react';
import { User } from '../types/User';

export interface AuthContextData {
  signed: boolean;
  user: User | null;
  checkCurrentAuthUser: (pathname: string) => Promise<void>;
  signIn: () => void;
  signOut: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default AuthContext;
