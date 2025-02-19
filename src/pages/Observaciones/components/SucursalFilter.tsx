import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SucursalFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: number[];
}

const SucursalFilter: React.FC<SucursalFilterProps> = ({ value, onChange, options }) => {
  return (
    <div className="flex flex-col">
      <Label htmlFor="sucursal" className="mb-1">
        Sucursal
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="sucursal" className="w-[180px]">
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          {/* Usamos "all" como valor por defecto */}
          <SelectItem value="all">Todas</SelectItem>
          {options.map((sucursalId) => (
            <SelectItem key={sucursalId} value={sucursalId.toString()}>
              {`Sucursal ${sucursalId}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SucursalFilter;
