import React, { useRef, useEffect, useCallback } from 'react';
import { Trash2, ArrowRightCircle, Link } from 'lucide-react';

export default function FlowNode({
  node,
  onDragStart,
  onUpdate,
  onDelete,
  onConvert,
  isDragging,
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);

  useEffect(() => {
    resize();
  }, [node.text, resize]);

  const handleTextChange = (e) => {
    onUpdate(node.id, { text: e.target.value });
    resize();
  };

  const handleMouseDown = (e) => {
    // Only start drag from the handle area
    if (e.target.closest('.flow-node-textarea') || e.target.closest('.flow-node-action-btn')) {
      return;
    }
    onDragStart(e, node.id);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flow-node${isDragging ? ' is-dragging' : ''}${node.linkedTaskId ? ' is-linked' : ''}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag handle */}
      <div className="flow-node-handle">
        <div className="flow-node-handle-dots">
          <span /><span /><span />
          <span /><span /><span />
        </div>

        <div className="flow-node-actions">
          {!node.linkedTaskId && (
            <button
              className="flow-node-action-btn convert"
              title="Converter em tarefa"
              onClick={(e) => { e.stopPropagation(); onConvert(node); }}
            >
              <ArrowRightCircle size={14} />
            </button>
          )}
          <button
            className="flow-node-action-btn delete"
            title="Excluir bloco"
            onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Text body */}
      <div className="flow-node-body">
        <textarea
          ref={textareaRef}
          className="flow-node-textarea"
          value={node.text}
          onChange={handleTextChange}
          placeholder="Digite sua ideia…"
          rows={2}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>

      {/* Footer */}
      <div className="flow-node-footer">
        <span className="flow-node-date">{formatDate(node.createdAt)}</span>
        {node.linkedTaskId && (
          <span className="flow-node-linked-badge">
            <Link size={10} /> tarefa
          </span>
        )}
      </div>
    </div>
  );
}
