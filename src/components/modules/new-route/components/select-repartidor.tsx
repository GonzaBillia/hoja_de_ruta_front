import React, { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command"; // Ajusta la ruta según tu estructura
import { useRepartidores } from "@/api/repartidor/hooks/useRepartidores"; // Hook para obtener repartidores
import { Repartidor } from "@/api/repartidor/types/repartidor.types"; // Interfaz de repartidor

const SelectRepartidor: React.FC = () => {
    const { data: repartidores, isLoading, error } = useRepartidores();
    const [selected, setSelected] = useState<Repartidor | null>(null);
    const [search, setSearch] = useState("");
  
    const filteredRepartidores = repartidores?.filter((r:any) =>
      r.username.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <div className="w-full max-w-sm">
        <label className="block text-sm font-medium mb-1">
          Selecciona un repartidor
        </label>
        <Command>
          <CommandInput
            placeholder="Buscar repartidor..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No se encontró repartidor.</CommandEmpty>
            <CommandGroup heading="Repartidores">
              {isLoading ? (
                <CommandItem>Loading...</CommandItem>
              ) : error ? (
                <CommandItem>Error al cargar</CommandItem>
              ) : (
                <>
                  {filteredRepartidores?.map((r:any) => (
                    <CommandItem
                      key={r.id}
                      onSelect={() => {
                        setSelected(r);
                        setSearch(r.username);
                      }}
                    >
                      {r.username}
                    </CommandItem>
                  ))}
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
        {selected && (
          <div className="mt-2 text-sm">
            <strong>Seleccionado:</strong> {selected.username} - {selected.email}
          </div>
        )}
      </div>
    );
  };
  
  export default SelectRepartidor;