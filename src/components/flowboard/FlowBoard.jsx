import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getNodeColor } from './flowColors';
import FlowToolbar from './FlowToolbar';
import FlowNode from './FlowNode';
import './FlowBoard.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const NODE_WIDTH  = 248;
const NODE_CONN_Y = 55;
const MIN_SCALE   = 0.2;
const MAX_SCALE   = 2.5;
const SCALE_STEP  = 0.15;

// Build SVG bezier path between two points
function buildPath(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1);
  const cx = Math.min(80, dx * 0.6);
  return `M ${x1} ${y1} C ${x1 + cx} ${y1} ${x2 - cx} ${y2} ${x2} ${y2}`;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
function DetailModal({ node, onSave, onClose }) {
  const [text, setText] = useState(node.text);
  const [details, setDetails] = useState(node.details || '');
  const color = getNodeColor(node.color);

  const handleSave = () => {
    onSave(node.id, { text, details });
    onClose();
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="flow-detail-overlay" onClick={handleSave}>
      <div className="flow-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Colored accent bar matching node color */}
        <div className="flow-detail-color-bar" style={{ background: color.accent }} />

        <div className="flow-detail-header">
          <input
            className="flow-detail-title-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Título da ideia…"
            autoFocus
            style={{ caretColor: color.accent }}
          />
          <button className="flow-detail-close-btn" onClick={handleSave} title="Salvar e fechar">
            <X size={16} />
          </button>
        </div>

        <textarea
          className="flow-detail-notes"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Adicione notas, detalhes, links, referências…"
          style={{ caretColor: color.accent }}
        />

        <div className="flow-detail-footer">
          <span className="flow-detail-date">{formatDate(node.createdAt)}</span>
          <button className="flow-btn flow-btn-primary" style={{ borderColor: color.accent, color: color.accent }} onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main FlowBoard ──────────────────────────────────────────────────────────
export default function FlowBoard() {
  // Persisted data
  const [nodes, setNodes] = useLocalStorage('pomodoro_flow_nodes', []);
  const [connections, setConnections] = useLocalStorage('pomodoro_flow_connections', []);
  const [showGrid, setShowGrid] = useLocalStorage('pomodoro_flow_grid', true);

  // Canvas transform
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 40, y: 40 });

  // Interaction modes (mutually exclusive)
  const [nodeDrag, setNodeDrag] = useState(null);    // { nodeId, startCanvasX, startCanvasY, startNodeX, startNodeY }
  const [canvasPan, setCanvasPan] = useState(null);  // { startClientX, startClientY, startOffX, startOffY }
  const [pendingConn, setPendingConn] = useState(null); // { fromId }
  const [cursorCanvas, setCursorCanvas] = useState({ x: 0, y: 0 });

  // UI state
  const [detailNodeId, setDetailNodeId] = useState(null);
  const [hoveredTarget, setHoveredTarget] = useState(null); // nodeId when hovering while connecting

  const canvasRef = useRef(null);

  // ── Coordinate helpers ──────────────────────────────────────────────────
  const clientToCanvas = useCallback((cx, cy) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (cx - rect.left - offset.x) / scale,
      y: (cy - rect.top - offset.y) / scale,
    };
  }, [offset, scale]);

  // ── Global mouse events ─────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (nodeDrag) {
        const pos = clientToCanvas(e.clientX, e.clientY);
        const nx = Math.max(0, pos.x - nodeDrag.startCanvasX + nodeDrag.startNodeX);
        const ny = Math.max(0, pos.y - nodeDrag.startCanvasY + nodeDrag.startNodeY);
        setNodes((prev) =>
          prev.map((n) => (n.id === nodeDrag.nodeId ? { ...n, x: nx, y: ny } : n))
        );
      } else if (canvasPan) {
        setOffset({
          x: canvasPan.startOffX + (e.clientX - canvasPan.startClientX),
          y: canvasPan.startOffY + (e.clientY - canvasPan.startClientY),
        });
      }

      if (pendingConn) {
        setCursorCanvas(clientToCanvas(e.clientX, e.clientY));
      }
    };

    const onUp = () => {
      setNodeDrag(null);
      setCanvasPan(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [nodeDrag, canvasPan, pendingConn, clientToCanvas, setNodes]);

  // ── Wheel zoom ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.91;
      setScale((prev) => {
        const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev * factor));
        const ratio = next / prev;
        setOffset((off) => ({
          x: cx - ratio * (cx - off.x),
          y: cy - ratio * (cy - off.y),
        }));
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── Canvas background mousedown → pan ───────────────────────────────────
  const handleCanvasBgMouseDown = (e) => {
    if (pendingConn) {
      // Cancel connection on background click
      setPendingConn(null);
      setHoveredTarget(null);
      return;
    }
    if (e.button === 0) {
      setCanvasPan({
        startClientX: e.clientX,
        startClientY: e.clientY,
        startOffX: offset.x,
        startOffY: offset.y,
      });
    }
  };

  // ── Node drag start ─────────────────────────────────────────────────────
  const handleNodeDragStart = useCallback((e, nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    const pos = clientToCanvas(e.clientX, e.clientY);
    setNodeDrag({
      nodeId,
      startCanvasX: pos.x,
      startCanvasY: pos.y,
      startNodeX: node.x,
      startNodeY: node.y,
    });
  }, [nodes, clientToCanvas]);

  // ── Connection handle mousedown → start connection ──────────────────────
  const handleConnHandleDown = useCallback((e, fromId) => {
    const pos = clientToCanvas(e.clientX, e.clientY);
    setPendingConn({ fromId });
    setCursorCanvas(pos);
    setHoveredTarget(null);
  }, [clientToCanvas]);

  // ── Node click when in connection mode → complete connection ────────────
  const handleNodeClick = useCallback((toId) => {
    if (!pendingConn || toId === pendingConn.fromId) {
      setPendingConn(null);
      setHoveredTarget(null);
      return;
    }
    // Avoid duplicate connections
    const exists = connections.some(
      (c) =>
        (c.fromId === pendingConn.fromId && c.toId === toId) ||
        (c.fromId === toId && c.toId === pendingConn.fromId)
    );
    if (!exists) {
      setConnections((prev) => [
        ...prev,
        { id: Date.now().toString(), fromId: pendingConn.fromId, toId },
      ]);
    }
    setPendingConn(null);
    setHoveredTarget(null);
  }, [pendingConn, connections, setConnections]);

  // ── Delete connection ───────────────────────────────────────────────────
  const deleteConnection = useCallback((connId) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
  }, [setConnections]);

  // ── Node CRUD ───────────────────────────────────────────────────────────
  const addNode = () => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cw = rect ? rect.width : 800;
    const ch = rect ? rect.height : 500;

    // Scatter with slight offset per count
    const base = (nodes.length % 6) * 40;
    const cx = (cw / 2 - offset.x) / scale - NODE_WIDTH / 2 + (base - 60);
    const cy = (ch / 2 - offset.y) / scale - 60 + base;

    setNodes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: '',
        details: '',
        color: 'default',
        x: Math.max(10, cx),
        y: Math.max(10, cy),
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const updateNode = useCallback((id, changes) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...changes } : n)));
  }, [setNodes]);

  const deleteNode = (id) => {
    if (!window.confirm('Remover este bloco?')) return;
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.fromId !== id && c.toId !== id));
  };

  const clearAll = () => {
    if (nodes.length === 0) return;
    if (!window.confirm(`Remover todos os ${nodes.length} bloco(s) e conexões?`)) return;
    setNodes([]);
    setConnections([]);
  };

  // ── Zoom controls ────────────────────────────────────────────────────────
  const zoomBy = (delta) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 400;
    const cy = rect ? rect.height / 2 : 300;
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta));
      const ratio = next / prev;
      setOffset((off) => ({
        x: cx - ratio * (cx - off.x),
        y: cy - ratio * (cy - off.y),
      }));
      return next;
    });
  };

  const zoomReset = () => { setScale(1); setOffset({ x: 40, y: 40 }); };

  // ── Detail modal ─────────────────────────────────────────────────────────
  const detailNode = nodes.find((n) => n.id === detailNodeId) || null;

  // ── Pending connection SVG line ──────────────────────────────────────────
  const pendingFrom = pendingConn ? nodes.find((n) => n.id === pendingConn.fromId) : null;

  // Cursor classes for canvas
  const canvasClass = [
    'flowboard-canvas',
    canvasPan ? 'is-panning' : '',
    pendingConn ? 'is-connecting' : '',
  ].join(' ');

  return (
    <div className="flowboard-wrapper">
      {/* Header */}
      <header className="flowboard-header">
        <h1>Flow Board</h1>
        <p>
          Organize seus pensamentos em blocos visuais.{' '}
          {pendingConn && (
            <span style={{ color: 'var(--primary-hover)', fontWeight: 600 }}>
              Clique em outro bloco para conectar • ESC para cancelar
            </span>
          )}
        </p>
      </header>

      {/* Toolbar */}
      <FlowToolbar
        nodeCount={nodes.length}
        showGrid={showGrid}
        scale={scale}
        onAddNode={addNode}
        onClearAll={clearAll}
        onToggleGrid={() => setShowGrid((v) => !v)}
        onZoomIn={() => zoomBy(SCALE_STEP)}
        onZoomOut={() => zoomBy(-SCALE_STEP)}
        onZoomReset={zoomReset}
      />

      {/* Canvas */}
      <div
        id="flowboard-canvas"
        ref={canvasRef}
        className={canvasClass}
        onMouseDown={handleCanvasBgMouseDown}
        onKeyDown={(e) => {
          if (e.key === 'Escape') { setPendingConn(null); setHoveredTarget(null); }
        }}
        tabIndex={0}
      >
        {/* Transformable inner layer */}
        <div
          className="flowboard-inner"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        >
          {/* Grid */}
          {showGrid && <div className="flowboard-grid" />}

          {/* SVG connections */}
          <svg
            className="flowboard-svg"
            width={6000}
            height={6000}
            style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
          >
            {/* Existing connections */}
            {connections.map((conn) => {
              const from = nodes.find((n) => n.id === conn.fromId);
              const to   = nodes.find((n) => n.id === conn.toId);
              if (!from || !to) return null;
              const x1 = from.x + NODE_WIDTH;
              const y1 = from.y + NODE_CONN_Y;
              const x2 = to.x;
              const y2 = to.y + NODE_CONN_Y;
              const d = buildPath(x1, y1, x2, y2);
              return (
                <g key={conn.id}>
                  {/* Wide transparent hit area */}
                  <path
                    d={d}
                    className="flow-conn-hit"
                    onClick={(e) => { e.stopPropagation(); deleteConnection(conn.id); }}
                    title="Clique para remover conexão"
                  />
                  <path d={d} className="flow-conn-path" />
                </g>
              );
            })}

            {/* Pending connection line */}
            {pendingFrom && (
              <path
                d={buildPath(
                  pendingFrom.x + NODE_WIDTH,
                  pendingFrom.y + NODE_CONN_Y,
                  cursorCanvas.x,
                  cursorCanvas.y,
                )}
                className="flow-conn-pending"
              />
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <FlowNode
              key={node.id}
              node={node}
              isDragging={nodeDrag?.nodeId === node.id}
              isConnFrom={pendingConn?.fromId === node.id}
              isConnTarget={hoveredTarget === node.id}
              isPendingConn={!!pendingConn && pendingConn.fromId !== node.id}
              onDragStart={handleNodeDragStart}
              onUpdate={updateNode}
              onDelete={deleteNode}
              onOpenDetail={setDetailNodeId}
              onConnHandleDown={handleConnHandleDown}
              onNodeClick={handleNodeClick}
            />
          ))}
        </div>

        {/* Empty state (outside inner to keep it centered) */}
        {nodes.length === 0 && (
          <div className="flowboard-empty">
            <Lightbulb size={56} color="var(--primary-hover)" style={{ opacity: 0.15 }} />
            <p>Clique em "Nova Ideia" para começar</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailNode && (
        <DetailModal
          node={detailNode}
          onSave={updateNode}
          onClose={() => setDetailNodeId(null)}
        />
      )}
    </div>
  );
}
