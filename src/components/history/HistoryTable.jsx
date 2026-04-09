import React, { useState } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import { Trash2, Calendar, Filter, Download } from 'lucide-react';
import './HistoryTable.css';

export default function HistoryTable() {
  const { history, deleteHistoryEntry, clearHistory, categories } = usePomodoro();
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Filtros
  const filteredHistory = history.filter(item => {
    // Categoria
    if (filterCategory && item.category !== filterCategory) return false;
    
    // Período
    if (filterPeriod !== 'all') {
      const itemDate = new Date(item.date);
      const now = new Date();
      
      const diffTime = Math.abs(now - itemDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (filterPeriod === 'today' && itemDate.toDateString() !== now.toDateString()) return false;
      if (filterPeriod === 'week' && diffDays > 7) return false;
      if (filterPeriod === 'month' && diffDays > 30) return false;
    }
    
    return true;
  });

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div className="history-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ textShadow: '0 0 10px rgba(0,240,255,0.4)', color: 'var(--primary-hover)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar size={24} /> Histórico de Sessões
        </h2>
        <button className="btn btn-secondary small" onClick={clearHistory} style={{ color: 'var(--danger)', borderColor: 'rgba(255,0,60,0.3)' }}>
          Limpar Tudo
        </button>
      </div>

      <div className="filters-container" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <select 
            className="input" 
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          >
            <option value="">Todas as Categorias</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <Filter size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-hover)' }} />
        </div>
        
        <div style={{ flex: 1, minWidth: '200px' }}>
          <select 
            className="input" 
            value={filterPeriod} 
            onChange={e => setFilterPeriod(e.target.value)}
          >
            <option value="all">Todo o período</option>
            <option value="today">Hoje</option>
            <option value="week">Últimos 7 dias</option>
            <option value="month">Últimos 30 dias</option>
          </select>
        </div>
      </div>

      <div className="table-responsive" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'rgba(0,0,0,0.3)' }}>
        {filteredHistory.length === 0 ? (
          <div className="empty-state text-muted text-center" style={{ padding: '4rem 2rem' }}>
            Nenhuma sessão encontrada para os filtros aplicados.
          </div>
        ) : (
          <table className="history-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--panel-light)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--primary-hover)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Data</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--primary-hover)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Tarefa</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--primary-hover)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Categoria</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--primary-hover)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--primary-hover)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: index === filteredHistory.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s' }} className="history-row">
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{item.task}</td>
                  <td style={{ padding: '1rem' }}><span style={{ background: 'var(--panel)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>{item.category}</span></td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {item.evaluation === 'concluido' && <span title="Concluído">✅</span>}
                    {item.evaluation === 'parcial' && <span title="Parcial">⚠️</span>}
                    {item.evaluation === 'nao_concluido' && <span title="Não Concluído">❌</span>}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => deleteHistoryEntry(item.id)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--danger)', padding: '0.4rem' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
