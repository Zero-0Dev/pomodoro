import React from 'react';
import { Plus, Trash2, Grid, LayoutGrid } from 'lucide-react';

export default function FlowToolbar({ nodeCount, showGrid, onAddNode, onClearAll, onToggleGrid }) {
  return (
    <div className="flowboard-toolbar">
      <div className="toolbar-group">
        <button
          id="flow-add-node-btn"
          className="flow-btn flow-btn-primary"
          onClick={onAddNode}
          title="Adicionar novo bloco de ideia"
        >
          <Plus size={15} />
          Nova Ideia
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button
          id="flow-toggle-grid-btn"
          className={`flow-btn flow-btn-muted${showGrid ? ' active' : ''}`}
          onClick={onToggleGrid}
          title={showGrid ? 'Ocultar grade' : 'Mostrar grade'}
        >
          {showGrid ? <LayoutGrid size={15} /> : <Grid size={15} />}
          Grade
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button
          id="flow-clear-all-btn"
          className="flow-btn flow-btn-danger"
          onClick={onClearAll}
          title="Remover todos os blocos"
        >
          <Trash2 size={15} />
          Limpar
        </button>
      </div>

      <span className="toolbar-node-count">
        {nodeCount === 0 ? 'Nenhum bloco' : `${nodeCount} bloco${nodeCount !== 1 ? 's' : ''}`}
      </span>
    </div>
  );
}
