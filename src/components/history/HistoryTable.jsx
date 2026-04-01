import React, { useState } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import { Trash2 } from 'lucide-react';
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
      <div className="history-header">
        <h2>Histórico de Sessões</h2>
        <button className="btn btn-secondary small" onClick={clearHistory}>
          Limpar Tudo
        </button>
      </div>

      <div className="filters-container">
        <select 
          className="input" 
          value={filterCategory} 
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        
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

      <div className="table-responsive">
        {filteredHistory.length === 0 ? (
          <div className="empty-state text-muted text-center" style={{ padding: '2rem' }}>
            Nenhuma sessão encontrada para os filtros aplicados.
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tarefa</th>
                <th>Categoria</th>
                <th>Avaliação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(item => (
                <tr key={item.id}>
                  <td>{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}</td>
                  <td>{item.task}</td>
                  <td><span className="badge">{item.category}</span></td>
                  <td>
                    {item.evaluation === 'concluido' && '✅'}
                    {item.evaluation === 'parcial' && '⚠️'}
                    {item.evaluation === 'nao_concluido' && '❌'}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteHistoryEntry(item.id)}>
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
