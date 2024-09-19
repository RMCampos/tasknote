/* eslint-disable no-console */
import React, { useMemo, useState } from 'react';
import { User } from '../types/User';
import { env } from '../env';
import ApiConfig from '../api-service/apiConfig';
import AuthContext, { AuthContextData } from './AuthContext';
import { API_TOKEN, REDIRECT_PATH, USER_DATA } from '../app-constants/app-constants';
import { SigninResponse } from '../types/SigninResponse';

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [intervalInstance, setIntervalInstance] = useState<NodeJS.Timeout | null>(null);

  const fetchCurrentSession = async (pathname: string): Promise<SigninResponse | undefined> => {
    try {
      const bearerToken: SigninResponse | undefined = await ApiConfig.currentSessionState();
      if (bearerToken && bearerToken.token) {
        setSigned(true);
      }
      return bearerToken;
    } catch (e) {
      if (e instanceof Error) {
        console.warn(e.message);
      } else if (e) {
        console.warn(e);
      }
      // Clear stored client id and name
      localStorage.clear();
      localStorage.setItem(REDIRECT_PATH, pathname);
      setUser(undefined);
      setSigned(false);
    }
    return undefined;
  };

  const updateUserSession = (userPriv: User | null, bearerToken: string) => {
    if (userPriv) {
      localStorage.setItem(USER_DATA, JSON.stringify(userPriv));
    }
    localStorage.setItem(API_TOKEN, bearerToken);
  };

  const checkCurrentAuthUser = async (pathname: string): Promise<void> => {
    const bearerToken: SigninResponse | undefined = await fetchCurrentSession(pathname);
    if (bearerToken && bearerToken.token) {
      updateUserSession(null, bearerToken.token);
    }
  };

  const register = async (email: string, password: string): Promise<string> => {
    const registerResponse: SigninResponse | Error = await ApiConfig.register(email, password);
    
    if (registerResponse instanceof Error) {
      return Promise.reject(registerResponse.message);
    }

    const currentUser: User = {
      email
    };

    setSigned(true);
    setUser(currentUser);
    updateUserSession(currentUser, registerResponse.token);
    return Promise.resolve('OK');
  };

  const signIn = async (email: string, password: string): Promise<string> => {
    const registerResponse: SigninResponse | Error = await ApiConfig.login(email, password);

    if (registerResponse instanceof Error) {
      return Promise.reject(registerResponse.message);
    }

    const currentUser: User = {
      email
    };

    setSigned(true);
    setUser(currentUser);
    updateUserSession(currentUser, registerResponse.token);
    return Promise.resolve('OK');
  };

  const signOut = async (): Promise<void> => {
    ApiConfig.logout();
    setSigned(false);
    setUser(undefined);
    setIsAdmin(false);
    if (intervalInstance) {
      clearInterval(intervalInstance);
      setIntervalInstance(null);
    }
    localStorage.clear();
  };

  const refreshTokenPvt = async (): Promise<void> => {
    const bearerToken: SigninResponse | undefined = await fetchCurrentSession('/');
    if (bearerToken) {
      updateUserSession(null, bearerToken.token);
    }
    return Promise.resolve();
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

  const contextValue: AuthContextData = useMemo(() => ({
    signed,
    user,
    checkCurrentAuthUser,
    signIn,
    signOut,
    register,
    isAdmin
  }), [signed, user, checkCurrentAuthUser, signIn, signOut, register, isAdmin]);

  return (
    <AuthContext.Provider value={contextValue}>
      { children }
    </AuthContext.Provider>
  );
};

export default AuthProvider;
