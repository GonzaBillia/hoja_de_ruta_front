// src/api/auth/repartidores.ts
import apiClient from '../apiClient';
import { Repartidor, RepartidoresResponse } from './types/repartidor.types';


export const getRepartidores = async (): Promise<Repartidor[]> => {
  const response = await apiClient.get<RepartidoresResponse>('/api/auth/repartidores');
  return response.data.data;
};
