"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useRepartidores } from "@/api/repartidor/hooks/useRepartidores";
import useRepartidorSucursales from "@/api/repartidor-sucursal/hooks/useRepartidoresSucursales";
import { Repartidor } from "@/api/repartidor/types/repartidor.types";
import { cn } from "@/lib/utils";

interface SelectRepartidorBySucursalProps {
  selectedRepartidor: Repartidor | null;
  onSelect: (repartidor: Repartidor) => void;
  sucursalId: number;
  initialRepartidorId?: number;
}

const SelectRepartidorBySucursal: React.FC<SelectRepartidorBySucursalProps> = ({
  selectedRepartidor,
  onSelect,
  sucursalId,
  initialRepartidorId,
}) => {
  // Obtiene la lista completa de repartidores
  const { data: repartidores, isLoading: repLoading, error: repError } = useRepartidores();
  // Obtiene los repartidores asignados a sucursales
  const { data: repSucData, isLoading: repSucLoading, error: repSucError } = useRepartidorSucursales();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Efecto para establecer el valor inicial si se pasó initialRepartidorId
  useEffect(() => {
    if (initialRepartidorId && !selectedRepartidor && repartidores) {
      const rep = repartidores.find((r) => r.id === initialRepartidorId);
      if (rep) {
        onSelect(rep);
        setSearch(rep.username);
      }
    }
  }, [initialRepartidorId, selectedRepartidor, repartidores, onSelect]);

  // También sincronizamos el input si selectedRepartidor cambia.
  useEffect(() => {
    if (selectedRepartidor) {
      setSearch(selectedRepartidor.username);
    }
  }, [selectedRepartidor]);

  // Filtrar los repartidores asignados a la sucursal indicada.
  const validUserIds = new Set(
    (repSucData ?? [])
      .filter((rs) => rs.sucursal_id === sucursalId)
      .map((rs) => rs.user_id)
  );

  // Filtrar la lista de repartidores:
  // 1. Que el id del repartidor esté en validUserIds.
  // 2. Que el username coincida (según el search).
  const filteredRepartidores: Repartidor[] = (repartidores ?? []).filter((r) => {
    if (!r) return false;
    if (!validUserIds.has(r.id)) return false;
    return r.username.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelect = (r: Repartidor) => {
    onSelect(r);
    setSearch(r.username);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative py-4"
      tabIndex={0}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <label className="block text-sm font-medium mb-1">
        Selecciona un repartidor para la sucursal {sucursalId}
      </label>
      <Command>
        <CommandInput
          placeholder="Buscar repartidor..."
          value={selectedRepartidor ? selectedRepartidor.username : search}
          onValueChange={(value) => {
            setSearch(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        <CommandList
          className={cn(open ? "absolute z-50 w-full" : "hidden")}
          style={{ top: "70%", left: 0 }}
        >
          <CommandGroup heading="Repartidores" className="bg-background">
            {repLoading || repSucLoading ? (
              <CommandItem value="loading">Cargando...</CommandItem>
            ) : repError || repSucError ? (
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
          <strong>Seleccionado:</strong> {selectedRepartidor.username}
        </div>
      )}
    </div>
  );
};

export default SelectRepartidorBySucursal;
