import { useMemo, useState } from "react";
import { User } from "../types/User";
import { env } from "../env";
import ApiConfig from "../api-service/apiConfig";
import AuthContext, { AuthContextData } from "./AuthContext";
import { REDIRECT_PATH } from "../app-constants/app-constants";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}: Props) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [intervalInstance, setIntervalInstance] = useState<NodeJS.Timeout | null>(null);

  const checkCurrentAuthUser = async (pathname: string): Promise<void> => {
    const currentUser = await fetchCurrentSession(pathname);
    if (currentUser) {
      updateUserSession(currentUser);
      setUser(currentUser);
    }
  };

  const signIn = async (): Promise<void> => {
    // const appEnv = 'DEV';
    await ApiConfig.loginFake();
    setSigned(true);
    const currentUser: User = {
      name: 'Ricardo',
      email: 'ricardompcampos@gmail.com'
    };

    setUser(currentUser);
  };

  const signOut = async (): Promise<void> => {
    await ApiConfig.logoutFake();
    setSigned(false);
    setUser(null);
    setIsAdmin(false);
    if (intervalInstance) {
      console.log('stopping refresh token');
      clearInterval(intervalInstance);
      setIntervalInstance(null);
    }
    localStorage.clear();
  };

  const refreshTokenPvt = async () => {
    const currentUser = await fetchCurrentSession('/');
    if (currentUser) {
      updateUserSession(currentUser);
    }
  };

  // 2 minutes
  const second = 1000;
  const minute = second * 60;
  const REFRESH_TIMER = minute * 2;

  if (intervalInstance == null && signed) {
    const instance = setInterval(() => {
      refreshTokenPvt()
        .then(() => {
          console.log('User session successfully refreshed!');
        })
        .catch((e) => console.error(e));
    }, REFRESH_TIMER);

    setIntervalInstance(instance);
  }

  const fetchCurrentSession = async (pathname: string): Promise<User | null> => {
    try {
      const currentUser = await ApiConfig.currentSessionFake();
      if (currentUser) {
        setSigned(true);
      }
      return currentUser;
    } catch (e) {
      console.warn(e);
      // Clear stored client id and name
      localStorage.clear();
      localStorage.setItem(REDIRECT_PATH, pathname);
      setUser(null);
      setSigned(false);
    }
    return null;
  };

  const updateUserSession = (user: User) => {
    localStorage.setItem('TaskNote-token', user.email);
  };

  const contextValue: AuthContextData = useMemo(() => ({
    signed,
    user,
    checkCurrentAuthUser,
    signIn,
    signOut,
    isAdmin
  }), [signed, user, checkCurrentAuthUser, signIn, signOut, isAdmin]);

  return (
    <AuthContext.Provider value={contextValue}>
      { children }
    </AuthContext.Provider>
  )
}

export default AuthProvider;
