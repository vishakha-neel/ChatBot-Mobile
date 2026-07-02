import apiClient from './client';

export interface LoginResponse {
  token: string;
  username: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', {
    username,
    password,
  });
  return response.data;
}

export async function register(username: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/register', {
    username,
    password,
  });
  return response.data;  
}