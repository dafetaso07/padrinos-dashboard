interface PadrinoSelectorProps {
  padrinos: string[];
  selected: string;
  onSelect: (padrino: string) => void;
}

export function PadrinoSelector({ padrinos, selected, onSelect }: PadrinoSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Padrino:</label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">-- Seleccionar padrino --</option>
        {padrinos.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
