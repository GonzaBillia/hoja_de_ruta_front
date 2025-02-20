import useUsers from "@/api/auth/hooks/useUsers";
import { User } from "@/api/auth/types/auth.types";
import useRoles from "@/api/roles/hooks/useRoles";
import useDepositos from "@/api/deposito/hooks/useDepositos";
import useSucursales from "@/api/sucursal/hooks/useSucursales";
import { ColumnName } from "@/components/common/table/types/table";

export interface UserWithRoleName extends User {
  roleName?: string;
  deposito?: string;  // Nombre del depósito, si aplica.
  sucursal?: string;  // Nombre de la sucursal, si aplica.
  // Para repartidor se omitirá este campo aquí y se manejará de forma separada.
}

const useUsersData = () => {
  const { data, isLoading, error } = useUsers();
  const { data: roles } = useRoles();
  const { data: depositos } = useDepositos();
  const { data: sucursalesData } = useSucursales();

  // Garantizamos que siempre se retorne un arreglo de usuarios.
  const users: User[] = data ?? [];

  const usersWithRoleName: UserWithRoleName[] = users.map((user) => {
    const role = roles?.find((r) => r.id === user.role_id);
    if (role?.name === "deposito") {
      const depositoName = depositos?.find((dep) => dep.id === user.deposito_id)?.nombre;
      return { ...user, deposito: depositoName, roleName: role.name };
    } else if (role?.name === "sucursal") {
      const sucursalName = sucursalesData?.find((sucu) => sucu.id === user.sucursal_id)?.nombre;
      return { ...user, sucursal: sucursalName, roleName: role.name };
    } else if (role?.name === "repartidor") {
      // Para repartidor, no tenemos un sucursal_id; se usará el hook useRepartidorSucursales
      // en el componente que renderiza la celda o detalle, por lo que aquí no se asigna.
      return { ...user, roleName: role.name };
    }
    return { ...user, roleName: role ? role.name : "Sin asignar" };
  });

  // Definición de columnas para la tabla de usuarios
  const columnNames: ColumnName[] = [
    { key: "id", label: "ID" },
    { key: "username", label: "Usuario" },
    { key: "email", label: "Email" },
    { key: "roleName", label: "Rol", opcional: true },
    // Puedes agregar columnas adicionales para depósito o sucursal si lo deseas.
  ];

  return { users: usersWithRoleName, isLoading, error, columnNames };
};

export default useUsersData;
