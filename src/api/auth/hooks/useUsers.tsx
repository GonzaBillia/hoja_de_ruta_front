import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../auth';
import { User } from '../types/auth.types';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
};

export default useUsers;
