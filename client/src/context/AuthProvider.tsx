import React, { useMemo, useState } from 'react';
import AuthContext, { AuthContextData } from './AuthContext';
import { API_TOKEN, REDIRECT_PATH, USER_DATA } from '../app-constants/app-constants';
import { SigninResponse } from '../types/SigninResponse';
import api from '../api-service/api';
import ApiConfig from '../api-service/apiConfig';
import { UserResponse } from '../types/UserResponse';
import { UserRegistration } from '../types/UserRegistration';

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponse | undefined>();
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
        if (e.message !== 'No saved token!') {
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

  const updateUserSession = (userPriv: UserResponse | null, bearerToken: string): UserResponse | null => {
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

    return null;
  };

  const checkCurrentAuthUser = async (pathname: string): Promise<void> => {
    const bearerToken: SigninResponse | undefined = await fetchCurrentSession(pathname);
    if (bearerToken && bearerToken.token) {
      const userLocal = updateUserSession(null, bearerToken.token);
      if (userLocal) {
        setUser(userLocal);
      }
    }
  };

  const register = async (payload: UserRegistration): Promise<string> => {
    try {
      await api.putJSON(ApiConfig.registerUrl, payload);
      return Promise.resolve('OK');
    }
    catch (e) {
      if (e instanceof Error) {
        return Promise.reject(e);
      }
      return Promise.reject(new Error('Unknown error!'));
    }
  };

  const signIn = async (email: string, password: string): Promise<string> => {
    try {
      const payload = { email, password };
      const registerResponse: SigninResponse = await api.postJSON(ApiConfig.signInUrl, payload);
      const currentUser: UserResponse = {
        userId: registerResponse.userId,
        name: registerResponse.name,
        email: registerResponse.email,
        admin: registerResponse.admin,
        createdAt: new Date(registerResponse.createdAt),
        gravatarImageUrl: registerResponse.gravatarImageUrl,
        lang: registerResponse.lang
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
    setSigned(false);
    setUser(undefined);
    setIsAdmin(false);
    if (intervalInstance) {
      clearInterval(intervalInstance);
      setIntervalInstance(null);
    }
    localStorage.removeItem(API_TOKEN);
    localStorage.removeItem(REDIRECT_PATH);
    localStorage.removeItem(USER_DATA);
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
          console.debug('User session successfully refreshed!');
        })
        .catch(e => console.error(e));
    }, REFRESH_TIMER);

    setIntervalInstance(instance);
  }

  const updateUser = (userUpdated: UserResponse): void => {
    setUser(userUpdated);
    localStorage.setItem(USER_DATA, JSON.stringify(userUpdated));
  };

  const contextValue: AuthContextData = useMemo(() => ({
    signed,
    user,
    checkCurrentAuthUser,
    signIn,
    signOut,
    register,
    isAdmin,
    updateUser
  }), [signed, user, checkCurrentAuthUser, signIn, signOut, register, isAdmin, updateUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
