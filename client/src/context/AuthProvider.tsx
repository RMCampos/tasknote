import React, { useMemo, useState } from 'react';
import { User } from '../types/User';
import AuthContext, { AuthContextData } from './AuthContext';
import { API_TOKEN, REDIRECT_PATH, USER_DATA } from '../app-constants/app-constants';
import { SigninResponse } from '../types/SigninResponse';
import {
  authenticateUser,
  logoutUser,
  registerUser
} from '../api-service/authService';
import api from '../api-service/api';
import ApiConfig from '../api-service/apiConfig';

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [intervalInstance, setIntervalInstance] = useState<NodeJS.Timeout | null>(null);

  const fetchCurrentSession = async (pathname: string): Promise<SigninResponse | undefined> => {
    const token = localStorage.getItem(API_TOKEN);
    if (!token) {
      return undefined;
    }
    try {
      const bearerToken: SigninResponse = await api.getJSON(ApiConfig.refreshTokenUrl);
      setSigned(true);
      return bearerToken;
    }
    catch (e) {
      if (e instanceof Error) {
        if (e.message !== 'No saved token!' && e.message !== 'Forbidden! Access denied') {
          console.warn(e.message);
        }
      }
      else if (e) {
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

  const updateUserSession = (userPriv: User | null, bearerToken: string): User => {
    if (userPriv) {
      localStorage.setItem(USER_DATA, JSON.stringify(userPriv));
    }
    localStorage.setItem(API_TOKEN, bearerToken);

    if (userPriv) {
      return userPriv;
    }

    const savedUser = localStorage.getItem(USER_DATA);
    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return { email: 'undefined' };
  };

  const checkCurrentAuthUser = async (pathname: string): Promise<void> => {
    const bearerToken: SigninResponse | undefined = await fetchCurrentSession(pathname);
    if (bearerToken && bearerToken.token) {
      const userLocal = updateUserSession(null, bearerToken.token);
      setUser(userLocal);
    }
  };

  const register = async (email: string, password: string): Promise<string> => {
    try {
      const registerResponse: SigninResponse = await registerUser(email, password);
      const currentUser: User = {
        email
      };

      setSigned(true);
      setUser(currentUser);
      updateUserSession(currentUser, registerResponse.token);
      return Promise.resolve('OK');
    }
    catch (e) {
      if (e instanceof Error) {
        return Promise.reject(new Error(e.message));
      }
      return Promise.reject(new Error('Unknown error!'));
    }
  };

  const signIn = async (email: string, password: string): Promise<string> => {
    try {
      const registerResponse: SigninResponse = await authenticateUser(email, password);
      const currentUser: User = {
        email
      };

      setSigned(true);
      setUser(currentUser);
      updateUserSession(currentUser, registerResponse.token);
      return Promise.resolve('OK');
    }
    catch (e) {
      return Promise.reject(e);
    }
  };

  const signOut = (): void => {
    logoutUser();
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
      const userLocal = updateUserSession(null, bearerToken.token);
      setUser(userLocal);
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
        .catch(e => console.error(e));
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
