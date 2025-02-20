import TablaGenericaGestion from "@/components/modules/gestion/components/table"
import useUsersData from "./hooks/useUsuariosData"
import CrearUsuario from "./components/CrearUsuario"
import DetalleUsuario from "./components/DetalleUsuario"
import EditarUsuario from "./components/EditarUsuario"

const Usuarios = () => {
    const {users, columnNames} = useUsersData()
  return (
    <div className="p-4 pt-0 h-full flex-grow">
        <TablaGenericaGestion data={users} columnNames={columnNames} CreateComponent={CrearUsuario} DetailComponent={DetalleUsuario} EditComponent={EditarUsuario} />
    </div>
  )
}

export default Usuarios