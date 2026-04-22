import React, { useRef, useEffect, useCallback } from 'react';
import { Trash2, Maximize2 } from 'lucide-react';

export default function FlowNode({
  node,
  isDragging,
  isConnFrom,
  isConnTarget,
  isPendingConn,
  onDragStart,
  onUpdate,
  onDelete,
  onOpenDetail,
  onConnHandleDown,
  onNodeClick,
}) {
  const textareaRef = useRef(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);

  useEffect(() => { resize(); }, [node.text, resize]);

  const handleTextChange = (e) => {
    onUpdate(node.id, { text: e.target.value });
    resize();
  };

  // Start node drag from the handle bar
  const handleGripMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStart(e, node.id);
  };

  // Click on node body (for receiving connections)
  const handleNodeClick = (e) => {
    if (isPendingConn) {
      e.stopPropagation();
      onNodeClick(node.id);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const detailsPreview = node.details?.trim().split('\n')[0] || '';

  return (
    <div
      className={[
        'flow-node',
        isDragging ? 'is-dragging' : '',
        isConnTarget ? 'conn-target-hover' : '',
      ].join(' ')}
      style={{ left: node.x, top: node.y }}
      onClick={handleNodeClick}
    >
      {/* Drag grip */}
      <div className="flow-node-handle" onMouseDown={handleGripMouseDown}>
        <div className="flow-node-grip">
          <span /><span /><span />
          <span /><span /><span />
        </div>
        <div className="flow-node-actions">
          <button
            className="flow-node-btn expand"
            title="Abrir notas internas"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onOpenDetail(node.id); }}
          >
            <Maximize2 size={13} />
          </button>
          <button
            className="flow-node-btn delete"
            title="Excluir bloco"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Text area */}
      <div className="flow-node-body" onMouseDown={(e) => e.stopPropagation()}>
        <textarea
          ref={textareaRef}
          className="flow-node-textarea"
          value={node.text}
          onChange={handleTextChange}
          placeholder="Título da ideia…"
          rows={2}
        />
      </div>

      {/* Footer */}
      <div className="flow-node-footer">
        <span className="flow-node-date">{formatDate(node.createdAt)}</span>
        {detailsPreview && (
          <span className="flow-node-details-hint" title={detailsPreview}>
            {detailsPreview}
          </span>
        )}
      </div>

      {/* Connection output handle (right edge) */}
      <div
        className={`flow-node-conn-handle${isConnFrom ? ' is-from' : ''}`}
        title="Conectar a outro bloco"
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onConnHandleDown(e, node.id);
        }}
      />
    </div>
  );
}
