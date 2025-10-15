import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import api from '../lib/api';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../lib/storage';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

// --- API Functions ---

const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const { data } = await api.post('/Auth/login', credentials);
  return data;
};

const register = async (userData: RegisterRequest): Promise<any> => {
  const { data } = await api.post('/Auth/register', userData);
  return data;
};

const getMe = async (): Promise<User> => {
  const { data } = await api.get('/Auth/me');
  return data;
};

const logout = () => {
    removeLocalStorage('token');
    removeLocalStorage('refershToken'); // Note: using 'refershToken' as per API response
}

// --- Custom Hooks ---

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      if (data && data.token && data.refreshToken) {
        setLocalStorage('token', data.token);
        setLocalStorage('refreshToken', data.refreshToken);
        setLocalStorage('user', JSON.stringify(data));

        queryClient.invalidateQueries({ queryKey: ['me'] });
        
        router.push('/dashboard');
      }
    },
    onError: (error) => {
      debugger;
      console.error('Login failed:', error);
    }
  });
};

export const useRegister = () => {
  return useMutation<any, Error, RegisterRequest>({
    mutationFn: register,
  });
};

export const useMe = () => {
  return useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!getLocalStorage('token'),
    retry: 1,
    staleTime: Infinity,
  });
};

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useCallback(() => {
        logout();
        queryClient.setQueryData(['me'], null);
        router.push('/login');
    }, [queryClient, router]);
}

export const useLoginUser = () => {
  return useMe();
};
