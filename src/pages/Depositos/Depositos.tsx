import TablaGenericaGestion from "@/components/modules/gestion/components/table"
import useDepositosData from "./hooks/useDepositosData"
import DetalleDeposito from "./DetalleDeposito"
import EditarDeposito from "./EditarDeposito"
import CrearDeposito from "./CrearDeposito"


const Depositos = () => {
    const {depositos, columnNames} = useDepositosData()
  return (
    <div className="p-4 pt-0 h-full flex-grow">
        <TablaGenericaGestion data={depositos} columnNames={columnNames} DetailComponent={DetalleDeposito} EditComponent={EditarDeposito} CreateComponent={CrearDeposito} />
    </div>
  )
}

export default Depositos