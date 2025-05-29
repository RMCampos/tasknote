import { createContext } from 'react';
import { UserResponse } from '../types/UserResponse';
import { UserRegistration } from '../types/UserRegistration';

export interface AuthContextData {
  signed: boolean;
  user: UserResponse | undefined;
  checkCurrentAuthUser: (pathname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<string>;
  signOut: () => void;
  register: (payload: UserRegistration) => Promise<string>;
  isAdmin: boolean;
  updateUser: (userUpdated: UserResponse) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default AuthContext;
