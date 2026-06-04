import { useState } from 'react';
import { Actividad, Estado } from '../../types';
import { generateId } from '../../services/storage';

interface ActividadFormProps {
  padrino: string;
  areas: string[];
  iniciativas: string[];
  onSave: (actividad: Actividad) => void;
  onCancel: () => void;
  initial?: Actividad;
}

const ESTADOS: Estado[] = ['Pendiente', 'En ejecución', 'Completada', 'Vencida'];

export function ActividadForm({ padrino, areas, iniciativas, onSave, onCancel, initial }: ActividadFormProps) {
  const [form, setForm] = useState({
    area: initial?.area ?? (areas[0] ?? ''),
    iniciativa: initial?.iniciativa ?? '',
    actividad: initial?.actividad ?? '',
    fechaCompromiso: initial
      ? initial.fechaCompromiso.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    estado: initial?.estado ?? ('Pendiente' as Estado),
    porcentajeAvance: initial?.porcentajeAvance ?? 0,
    retos: initial?.retos ?? '',
    observaciones: initial?.observaciones ?? '',
    avanceUltimoPeriodo: initial?.avanceUltimoPeriodo ?? '',
  });

  const [newArea, setNewArea] = useState('');
  const [showNewArea, setShowNewArea] = useState(false);
  const [newIniciativa, setNewIniciativa] = useState('');
  const [showNewIniciativa, setShowNewIniciativa] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.actividad.trim()) return;

    const actividad: Actividad = {
      id: initial?.id ?? generateId(),
      padrino,
      area: showNewArea ? newArea.trim() : form.area,
      iniciativa: showNewIniciativa ? newIniciativa.trim() : form.iniciativa,
      actividad: form.actividad.trim(),
      fechaCompromiso: new Date(form.fechaCompromiso),
      estado: form.estado,
      porcentajeAvance: Math.max(0, Math.min(100, form.porcentajeAvance)),
      retos: form.retos.trim(),
      observaciones: form.observaciones.trim(),
      avanceUltimoPeriodo: form.avanceUltimoPeriodo.trim(),
    };

    onSave(actividad);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {initial ? 'Editar Actividad' : 'Nueva Actividad'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Iniciativa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Iniciativa</label>
          {!showNewIniciativa ? (
            <div className="flex gap-2">
              <select
                value={form.iniciativa}
                onChange={(e) => setForm({ ...form, iniciativa: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">-- Seleccionar --</option>
                {iniciativas.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewIniciativa(true)}
                className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                + Nueva
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newIniciativa}
                onChange={(e) => setNewIniciativa(e.target.value)}
                placeholder="Nueva iniciativa..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewIniciativa(false)}
                className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Área */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
          {!showNewArea ? (
            <div className="flex gap-2">
              <select
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewArea(true)}
                className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                + Nueva
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Nueva área..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewArea(false)}
                className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Actividad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Actividad *</label>
          <input
            type="text"
            value={form.actividad}
            onChange={(e) => setForm({ ...form, actividad: e.target.value })}
            placeholder="Descripción de la actividad"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Fecha compromiso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha compromiso</label>
          <input
            type="date"
            value={form.fechaCompromiso}
            onChange={(e) => setForm({ ...form, fechaCompromiso: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={form.estado}
            onChange={(e) => {
              const estado = e.target.value as Estado;
              const avance = estado === 'Completada' ? 100 : form.porcentajeAvance;
              setForm({ ...form, estado, porcentajeAvance: avance });
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Porcentaje de avance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Porcentaje de avance: {form.porcentajeAvance}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={form.porcentajeAvance}
            onChange={(e) => setForm({ ...form, porcentajeAvance: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Avance último periodo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Avance último periodo</label>
          <textarea
            value={form.avanceUltimoPeriodo}
            onChange={(e) => setForm({ ...form, avanceUltimoPeriodo: e.target.value })}
            placeholder="Describe el avance logrado en el último periodo..."
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Retos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Retos</label>
        <textarea
          value={form.retos}
          onChange={(e) => setForm({ ...form, retos: e.target.value })}
          placeholder="Obstáculos o desafíos..."
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          value={form.observaciones}
          onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
          placeholder="Notas adicionales..."
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {initial ? 'Guardar cambios' : 'Agregar actividad'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
