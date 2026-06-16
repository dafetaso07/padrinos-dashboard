import { useState } from 'react';
import { Actividad } from '../../types';
import { saveActividadesAPI, addActividadAPI, updateActividadAPI, deleteActividadAPI } from '../../services/api';
import { PadrinoSelector } from './PadrinoSelector';
import { ActividadForm } from './ActividadForm';
import { ActividadesTable } from './ActividadesTable';

interface AdminPageProps {
  actividades: Actividad[];
  onUpdate: (actividades: Actividad[]) => void;
}

export function AdminPage({ actividades, onUpdate }: AdminPageProps) {
  const [selectedPadrino, setSelectedPadrino] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingActividad, setEditingActividad] = useState<Actividad | undefined>(undefined);

  const padrinos = [...new Set(actividades.map((a) => a.padrino))].sort();
  const areas = [...new Set(actividades.map((a) => a.area))].sort();
  const iniciativas = [...new Set(actividades.map((a) => a.iniciativa).filter(Boolean))].sort();

  const padrinoActividades = selectedPadrino
    ? actividades.filter((a) => a.padrino === selectedPadrino)
    : [];

  const handleSave = (actividad: Actividad) => {
    let updated: Actividad[];

    if (editingActividad) {
      updated = actividades.map((a) => (a.id === actividad.id ? actividad : a));
      updateActividadAPI(actividad);
    } else {
      updated = [...actividades, actividad];
      addActividadAPI(actividad);
    }

    onUpdate(updated);
    setShowForm(false);
    setEditingActividad(undefined);
  };

  const handleEdit = (actividad: Actividad) => {
    setEditingActividad(actividad);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;
    const updated = actividades.filter((a) => a.id !== id);
    deleteActividadAPI(id);
    onUpdate(updated);
  };

  const handleMarkComplete = (id: string) => {
    const updated = actividades.map((a) =>
      a.id === id ? { ...a, estado: 'Completada' as const, porcentajeAvance: 100 } : a
    );
    const act = updated.find(a => a.id === id);
    if (act) updateActividadAPI(act);
    onUpdate(updated);
  };

  const handleReassign = (id: string, nuevoPadrino: string) => {
    const updated = actividades.map((a) =>
      a.id === id ? { ...a, padrino: nuevoPadrino } : a
    );
    const act = updated.find(a => a.id === id);
    if (act) updateActividadAPI(act);
    onUpdate(updated);
  };

  const handleNewPadrino = () => {
    const nombre = prompt('Nombre del nuevo padrino:');
    if (nombre && nombre.trim()) {
      setSelectedPadrino(nombre.trim());
    }
  };

  const handleEditPadrino = () => {
    if (!selectedPadrino) return;
    const nuevoNombre = prompt(`Renombrar padrino "${selectedPadrino}" a:`, selectedPadrino);
    if (nuevoNombre && nuevoNombre.trim() && nuevoNombre.trim() !== selectedPadrino) {
      const updated = actividades.map((a) =>
        a.padrino === selectedPadrino ? { ...a, padrino: nuevoNombre.trim() } : a
      );
      saveActividadesAPI(updated);
      onUpdate(updated);
      setSelectedPadrino(nuevoNombre.trim());
    }
  };

  const handleDeletePadrino = () => {
    if (!selectedPadrino) return;
    const count = padrinoActividades.length;
    const msg = count > 0
      ? `¿Eliminar al padrino "${selectedPadrino}" y sus ${count} actividades?`
      : `¿Eliminar al padrino "${selectedPadrino}"?`;
    if (!confirm(msg)) return;

    const updated = actividades.filter((a) => a.padrino !== selectedPadrino);
    // Eliminar cada actividad del padrino
    padrinoActividades.forEach(a => deleteActividadAPI(a.id));
    onUpdate(updated);
    setSelectedPadrino('');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header con selector y acciones de padrino */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PadrinoSelector
            padrinos={padrinos}
            selected={selectedPadrino}
            onSelect={setSelectedPadrino}
          />
          <button
            onClick={handleNewPadrino}
            className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            + Nuevo padrino
          </button>
          {selectedPadrino && (
            <>
              <button
                onClick={handleEditPadrino}
                title="Editar nombre del padrino"
                className="px-3 py-2 text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                ✎ Editar padrino
              </button>
              <button
                onClick={handleDeletePadrino}
                title="Eliminar padrino y sus actividades"
                className="px-3 py-2 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
              >
                ✕ Eliminar padrino
              </button>
            </>
          )}
        </div>

        {selectedPadrino && (
          <button
            onClick={() => {
              setEditingActividad(undefined);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            + Nueva actividad
          </button>
        )}
      </div>

      {/* Resumen rápido del padrino */}
      {selectedPadrino && padrinoActividades.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-800">{padrinoActividades.length}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-800">
              {padrinoActividades.filter((a) => a.estado === 'Completada').length}
            </div>
            <div className="text-xs text-green-600">Completadas</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-800">
              {padrinoActividades.filter((a) => a.estado === 'En ejecución').length}
            </div>
            <div className="text-xs text-blue-600">En ejecución</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-800">
              {padrinoActividades.filter((a) => a.estado === 'Vencida').length}
            </div>
            <div className="text-xs text-red-600">Vencidas</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-800">
              {[...new Set(padrinoActividades.map((a) => a.iniciativa).filter(Boolean))].length}
            </div>
            <div className="text-xs text-purple-600">Iniciativas</div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {showForm && selectedPadrino && (
        <ActividadForm
          padrino={selectedPadrino}
          areas={areas}
          iniciativas={iniciativas}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingActividad(undefined);
          }}
          initial={editingActividad}
        />
      )}

      {/* Tabla */}
      {selectedPadrino ? (
        <ActividadesTable
          actividades={padrinoActividades}
          padrinos={padrinos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkComplete={handleMarkComplete}
          onReassign={handleReassign}
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">Selecciona un padrino para ver y administrar sus actividades</p>
        </div>
      )}
    </main>
  );
}
