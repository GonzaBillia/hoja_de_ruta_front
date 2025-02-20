import TablaGenericaGestion from "@/components/modules/gestion/components/table"
import useDepositosData from "./hooks/useDepositosData"
import DetalleDeposito from "./components/DetalleDeposito"
import EditarDeposito from "./components/EditarDeposito"
import CrearDeposito from "./components/CrearDeposito"


const Depositos = () => {
    const {depositos, columnNames} = useDepositosData()
  return (
    <div className="p-4 pt-0 h-full flex-grow">
        <TablaGenericaGestion data={depositos} columnNames={columnNames} DetailComponent={DetalleDeposito} EditComponent={EditarDeposito} CreateComponent={CrearDeposito} />
    </div>
  )
}

export default Depositos