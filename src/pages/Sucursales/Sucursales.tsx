import TablaGenericaGestion from "@/components/modules/gestion/components/table"
import DetalleSucursal from "./DetalleSucursal"
import EditarSucursal from "./EditarSucursal"
import useSucursalesData from "./hooks/useSucursalesData"
import CrearSucursal from "./CrearSucursal"


const Sucursales = () => {
    const {sucursales, columnNames} = useSucursalesData()
  return (
    <div className="p-4 pt-0 h-full flex-grow">
        <TablaGenericaGestion columnNames={columnNames} data={sucursales} DetailComponent={DetalleSucursal} EditComponent={EditarSucursal} CreateComponent={CrearSucursal} />
    </div>
  )
}

export default Sucursales