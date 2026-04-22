import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { usePomodoro } from '../../store/PomodoroContext';
import FlowToolbar from './FlowToolbar';
import FlowNode from './FlowNode';
import './FlowBoard.css';

// ─── Convert-to-Task Modal ─────────────────────────────────────────────────
function ConvertModal({ node, categories, onConfirm, onClose }) {
  const [priority, setPriority] = useState('normal');
  const [categoryId, setCategoryId] = useState('');

  const handleConfirm = () => {
    onConfirm(node, { priority, categoryId });
    onClose();
  };

  return (
    <div className="flow-convert-modal-overlay" onClick={onClose}>
      <div className="flow-convert-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Converter em Tarefa</h3>
        <p>O texto do bloco será usado como nome da tarefa.</p>

        <label>Categoria</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Sem Categoria</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label>Prioridade</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Baixa</option>
          <option value="normal">Normal</option>
          <option value="high">Alta</option>
        </select>

        <div className="flow-convert-modal-actions">
          <button className="flow-btn flow-btn-muted" onClick={onClose}>
            Cancelar
          </button>
          <button className="flow-btn flow-btn-primary" onClick={handleConfirm}>
            Converter
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main FlowBoard ───────────────────────────────────────────────────────
export default function FlowBoard() {
  const [nodes, setNodes] = useLocalStorage('pomodoro_flow_nodes', []);
  const [showGrid, setShowGrid] = useLocalStorage('pomodoro_flow_grid', true);
  const [convertTarget, setConvertTarget] = useState(null);
  const [dragging, setDragging] = useState(null); // { nodeId, offsetX, offsetY }

  const canvasRef = useRef(null);
  const { addTask, categories } = usePomodoro();

  // ── Drag ──────────────────────────────────────────────────────────────
  const handleDragStart = useCallback((e, nodeId) => {
    e.preventDefault();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    setDragging({
      nodeId,
      offsetX: e.clientX - canvasRect.left - node.x,
      offsetY: e.clientY - canvasRect.top - node.y,
    });
  }, [nodes]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const rawX = e.clientX - canvasRect.left - dragging.offsetX;
    const rawY = e.clientY - canvasRect.top - dragging.offsetY;

    const x = Math.max(0, Math.min(rawX, canvasRect.width - 220));
    const y = Math.max(0, Math.min(rawY, canvasRect.height - 110));

    setNodes((prev) =>
      prev.map((n) => (n.id === dragging.nodeId ? { ...n, x, y } : n))
    );
  }, [dragging, setNodes]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // ── Node CRUD ─────────────────────────────────────────────────────────
  const addNode = () => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const canvasW = canvasRect ? canvasRect.width : 800;
    const canvasH = canvasRect ? canvasRect.height : 500;

    // Scatter new nodes with a bit of randomness to avoid stacking
    const x = Math.max(20, Math.min(canvasW - 240, 60 + (nodes.length * 30) % (canvasW - 280)));
    const y = Math.max(20, Math.min(canvasH - 130, 40 + (nodes.length * 25) % (canvasH - 150)));

    const newNode = {
      id: Date.now().toString(),
      text: '',
      x,
      y,
      createdAt: new Date().toISOString(),
      linkedTaskId: null,
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const updateNode = useCallback((id, changes) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...changes } : n)));
  }, [setNodes]);

  const deleteNode = (id) => {
    if (window.confirm('Remover este bloco de ideia?')) {
      setNodes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const clearAll = () => {
    if (nodes.length === 0) return;
    if (window.confirm(`Remover todos os ${nodes.length} bloco(s)?`)) {
      setNodes([]);
    }
  };

  // ── Convert to Task ───────────────────────────────────────────────────
  const handleConvertConfirm = (node, { priority, categoryId }) => {
    const taskId = addTask({
      text: node.text || 'Ideia do Flow Board',
      categoryId,
      priority,
      status: 'pending',
    });
    updateNode(node.id, { linkedTaskId: taskId });
  };

  return (
    <div className="flowboard-wrapper">
      {/* Header */}
      <header className="flowboard-header">
        <h1>Flow Board</h1>
        <p>Organize seus pensamentos e ideias em blocos visuais arrastáveis.</p>
      </header>

      {/* Toolbar */}
      <FlowToolbar
        nodeCount={nodes.length}
        showGrid={showGrid}
        onAddNode={addNode}
        onClearAll={clearAll}
        onToggleGrid={() => setShowGrid((v) => !v)}
      />

      {/* Canvas */}
      <div
        id="flowboard-canvas"
        ref={canvasRef}
        className={`flowboard-canvas${dragging ? ' dragging-canvas' : ''}`}
      >
        {/* Grid */}
        {showGrid && <div className="flowboard-grid" />}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="flowboard-empty">
            <div className="flowboard-empty-icon">
              <Lightbulb size={64} color="var(--primary-hover)" />
            </div>
            <p>Clique em "Nova Ideia" para começar</p>
          </div>
        )}

        {/* Nodes */}
        {nodes.map((node) => (
          <FlowNode
            key={node.id}
            node={node}
            isDragging={dragging?.nodeId === node.id}
            onDragStart={handleDragStart}
            onUpdate={updateNode}
            onDelete={deleteNode}
            onConvert={setConvertTarget}
          />
        ))}
      </div>

      {/* Convert modal */}
      {convertTarget && (
        <ConvertModal
          node={convertTarget}
          categories={categories}
          onConfirm={handleConvertConfirm}
          onClose={() => setConvertTarget(null)}
        />
      )}
    </div>
  );
}
