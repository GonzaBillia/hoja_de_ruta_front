// NuevaRuta.tsx
import { useState, useEffect } from "react";
import SelectRepartidor from "@/components/modules/new-route/components/select-repartidor";
import SelectSucursal from "@/components/modules/new-route/components/select-sucursal";
import { Repartidor } from "@/api/repartidor/types/repartidor.types";

const NuevaRuta = () => {
  const [selectedRepartidor, setSelectedRepartidor] = useState<Repartidor | null>(null);

  useEffect(() => {
    console.log("repartidor desde padre:", selectedRepartidor);
  }, [selectedRepartidor]);

  return (
    <div className="mx-auto h-full">
      <SelectRepartidor
        selectedRepartidor={selectedRepartidor}
        onSelect={(r) => setSelectedRepartidor(r)}
      />
      {selectedRepartidor && <SelectSucursal repartidorId={selectedRepartidor.id} />}
    </div>
  );
};

export default NuevaRuta;
