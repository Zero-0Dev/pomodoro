import React from 'react';
import { Plus, Trash2, Grid, LayoutGrid, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function FlowToolbar({
  nodeCount,
  showGrid,
  scale,
  onAddNode,
  onClearAll,
  onToggleGrid,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) {
  return (
    <div className="flowboard-toolbar">
      {/* Add node */}
      <div className="toolbar-group">
        <button id="flow-add-node-btn" className="flow-btn flow-btn-primary" onClick={onAddNode}>
          <Plus size={14} /> Nova Ideia
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Zoom controls */}
      <div className="toolbar-group flow-zoom-group">
        <button className="flow-zoom-btn" title="Diminuir zoom (Ctrl+-)" onClick={onZoomOut}>−</button>
        <span className="flow-zoom-label">{Math.round(scale * 100)}%</span>
        <button className="flow-zoom-btn" title="Aumentar zoom (Ctrl++)" onClick={onZoomIn}>+</button>
        <button className="flow-zoom-btn" title="Resetar zoom" onClick={onZoomReset} style={{ fontSize: '0.7rem', width: 'auto', padding: '0 6px' }}>
          Fit
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Grid toggle */}
      <div className="toolbar-group">
        <button
          id="flow-toggle-grid-btn"
          className={`flow-btn flow-btn-muted${showGrid ? ' active' : ''}`}
          onClick={onToggleGrid}
          title="Alternar grade"
        >
          {showGrid ? <LayoutGrid size={14} /> : <Grid size={14} />}
          Grade
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Clear all */}
      <div className="toolbar-group">
        <button id="flow-clear-all-btn" className="flow-btn flow-btn-danger" onClick={onClearAll}>
          <Trash2 size={14} /> Limpar
        </button>
      </div>

      <span className="toolbar-node-count">
        {nodeCount === 0 ? 'Nenhum bloco' : `${nodeCount} bloco${nodeCount !== 1 ? 's' : ''}`}
      </span>
    </div>
  );
}
