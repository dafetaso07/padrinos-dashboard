import { useState, useRef, useEffect } from 'react';
import { Actividad, Estado, FiltrosState } from '../../types';

interface FilterBarProps {
  actividades: Actividad[];
  filtros: FiltrosState;
  onFiltroChange: (filtros: FiltrosState) => void;
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const displayLabel = selected.length > 0 ? `${label} (${selected.length})` : label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
          selected.length > 0
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {displayLabel}
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
          {options.length === 0 && (
            <p className="px-3 py-2 text-gray-400 text-sm">Sin opciones</p>
          )}
        </div>
      )}
    </div>
  );
}

export function FilterBar({ actividades, filtros, onFiltroChange }: FilterBarProps) {
  const padrinos = [...new Set(actividades.map((a) => a.padrino))].sort();
  const areas = [...new Set(actividades.map((a) => a.area))].sort();
  const iniciativas = [...new Set(actividades.map((a) => a.iniciativa).filter(Boolean))].sort();
  const estados: Estado[] = ['Completada', 'En ejecución', 'Vencida', 'Pendiente'];

  const hasActiveFilters =
    filtros.padrinos.length > 0 || filtros.areas.length > 0 || filtros.estados.length > 0 || filtros.iniciativas.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-600">Filtros:</span>

      <MultiSelect
        label="Padrino"
        options={padrinos}
        selected={filtros.padrinos}
        onChange={(values) => onFiltroChange({ ...filtros, padrinos: values })}
      />

      <MultiSelect
        label="Área"
        options={areas}
        selected={filtros.areas}
        onChange={(values) => onFiltroChange({ ...filtros, areas: values })}
      />

      <MultiSelect
        label="Iniciativa"
        options={iniciativas}
        selected={filtros.iniciativas}
        onChange={(values) => onFiltroChange({ ...filtros, iniciativas: values })}
      />

      <MultiSelect
        label="Estado"
        options={estados}
        selected={filtros.estados}
        onChange={(values) => onFiltroChange({ ...filtros, estados: values as Estado[] })}
      />

      {hasActiveFilters && (
        <button
          onClick={() => onFiltroChange({ padrinos: [], areas: [], estados: [], iniciativas: [] })}
          className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          ✕ Limpiar filtros
        </button>
      )}
    </div>
  );
}
