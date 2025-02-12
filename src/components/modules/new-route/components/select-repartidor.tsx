// components/modules/new-route/components/select-repartidor.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command"; // Ajusta la ruta según tu estructura
import { useRepartidores } from "@/api/repartidor/hooks/useRepartidores"; // Hook para obtener repartidores
import { Repartidor } from "@/api/repartidor/types/repartidor.types"; // Interfaz de repartidor

interface SelectRepartidorProps {
  selectedRepartidor: Repartidor | null;
  onSelect: (repartidor: Repartidor) => void;
}

const SelectRepartidor: React.FC<SelectRepartidorProps> = ({ selectedRepartidor, onSelect }) => {
  const { data: repartidores, isLoading, error } = useRepartidores();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Registro de datos para depurar
  useEffect(() => {
    console.log("Repartidores recibidos:", repartidores);
  }, [repartidores]);

  // Garantizamos que repartidores sea siempre un array
  const filteredRepartidores: Repartidor[] = (repartidores ?? []).filter((r) => {
    if (!r || !r.username) {
      console.error("Elemento repartidor inválido:", r);
      return false;
    }
    return r.username.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    console.log("Filtered repartidores:", filteredRepartidores);
  }, [filteredRepartidores]);

  const handleSelect = (r: Repartidor) => {
    console.log("Seleccionado repartidor:", r);
    onSelect(r);
    setSearch(r.username);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-sm relative"
      tabIndex={0}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          console.log("onBlur: cerrando dropdown");
          setOpen(false);
        }
      }}
    >
      <label className="block text-sm font-medium mb-1">
        Selecciona un repartidor
      </label>
      <Command>
        <CommandInput
          placeholder="Buscar repartidor..."
          value={selectedRepartidor ? selectedRepartidor.username : search}
          onValueChange={(value) => {
            console.log("onValueChange:", value);
            setSearch(value);
            setOpen(true);
          }}
          onFocus={() => {
            console.log("Input enfocado");
            setOpen(true);
          }}
        />
        {/* Siempre renderizamos CommandList; la visibilidad se controla con la clase "hidden" */}
        <CommandList className={open ? "" : "hidden"}>
          <CommandGroup heading="Repartidores">
            {isLoading ? (
              <CommandItem value="loading">Loading...</CommandItem>
            ) : error ? (
              <CommandItem value="error">Error al cargar</CommandItem>
            ) : filteredRepartidores.length > 0 ? (
              filteredRepartidores.map((r: Repartidor) => (
                <CommandItem
                  key={r.id}
                  value={r.username}
                  onSelect={() => handleSelect(r)}
                >
                  {r.username}
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>No se encontró repartidor.</CommandEmpty>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
      {selectedRepartidor && (
        <div className="mt-2 text-sm">
          <strong>Seleccionado:</strong> {selectedRepartidor.username} -{" "}
          {selectedRepartidor.email}
        </div>
      )}
    </div>
  );
};

export default SelectRepartidor;
