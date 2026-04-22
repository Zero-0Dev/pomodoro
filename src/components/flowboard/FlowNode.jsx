import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Maximize2, Palette } from 'lucide-react';
import { NODE_COLORS, getNodeColor } from './flowColors';

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
  const pickerRef   = useRef(null);
  const [showPicker, setShowPicker] = useState(false);

  const color = getNodeColor(node.color);

  /* Auto-resize textarea */
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);
  useEffect(() => { resize(); }, [node.text, resize]);

  /* Close picker when clicking outside */
  useEffect(() => {
    if (!showPicker) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPicker]);

  /* ── Handlers ── */
  const handleGripMouseDown = (e) => {
    e.preventDefault(); e.stopPropagation();
    onDragStart(e, node.id);
  };

  const handleNodeClick = (e) => {
    if (isPendingConn) { e.stopPropagation(); onNodeClick(node.id); }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  const detailsPreview = node.details?.trim().split('\n')[0] || '';

  /* ── Inline color styles ── */
  const nodeStyle = {
    left: node.x,
    top:  node.y,
    background: color.bg,
    border: `1.5px solid ${color.border}`,
    boxShadow: isDragging
      ? `0 14px 44px rgba(0,0,0,0.75), 0 0 24px ${color.glow}`
      : isConnTarget
      ? `0 10px 32px rgba(0,0,0,0.7), 0 0 30px ${color.glow.replace('0.', '0.5')}`
      : `0 6px 24px rgba(0,0,0,0.6), 0 0 16px ${color.glow}`,
  };

  return (
    <div
      className={[
        'flow-node',
        isDragging    ? 'is-dragging'       : '',
        isConnTarget  ? 'conn-target-hover' : '',
      ].join(' ')}
      style={nodeStyle}
      onClick={handleNodeClick}
    >
      {/* Left accent stripe */}
      <div className="flow-node-accent" style={{ background: color.accent }} />

      {/* Drag handle + actions */}
      <div className="flow-node-handle" onMouseDown={handleGripMouseDown}>
        <div className="flow-node-grip">
          <span /><span /><span />
          <span /><span /><span />
        </div>

        <div className="flow-node-actions">
          {/* Color picker trigger */}
          <div style={{ position: 'relative' }} ref={pickerRef}>
            <button
              className="flow-node-btn palette"
              title="Escolher cor"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setShowPicker((v) => !v); }}
            >
              <Palette size={13} />
            </button>

            {showPicker && (
              <div className="flow-node-color-picker">
                {NODE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    className={`flow-color-dot${(node.color ?? 'default') === c.id ? ' is-active' : ''}`}
                    style={{
                      background: c.id === 'default' ? '#2a2a45' : c.accent,
                      boxShadow:  c.id !== 'default' ? `0 0 6px ${c.glow}` : 'none',
                    }}
                    title={c.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate(node.id, { color: c.id });
                      setShowPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Open detail modal */}
          <button
            className="flow-node-btn expand"
            title="Abrir notas internas"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onOpenDetail(node.id); }}
          >
            <Maximize2 size={13} />
          </button>

          {/* Delete */}
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

      {/* Text */}
      <div className="flow-node-body" onMouseDown={(e) => e.stopPropagation()}>
        <textarea
          ref={textareaRef}
          className="flow-node-textarea"
          value={node.text}
          onChange={(e) => { onUpdate(node.id, { text: e.target.value }); resize(); }}
          placeholder="Título da ideia…"
          rows={2}
          style={{ caretColor: color.accent }}
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

      {/* Connection handle */}
      <div
        className={`flow-node-conn-handle${isConnFrom ? ' is-from' : ''}`}
        title="Conectar a outro bloco"
        style={isConnFrom ? { background: color.accent, borderColor: color.accent } : { borderColor: color.border }}
        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); onConnHandleDown(e, node.id); }}
      />
    </div>
  );
}
