import React, { useState } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import { Trash2, Plus } from 'lucide-react';

export default function CategoriesManager() {
  const { categories, addCategory, removeCategory, history } = usePomodoro();
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    addCategory(newCat);
    setNewCat('');
  };

  const handleRemove = (cat) => {
    // Check if it's used in history
    const isUsed = history.some(item => item.category === cat);
    if (isUsed) {
      if (!window.confirm(`A categoria "${cat}" já possui registros no histórico. Deseja mesmo remover? Os registros antigos não perderão a categoria, mas ela não aparecerá mais para novas sessões.`)) {
        return;
      }
    }
    removeCategory(cat);
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Gerenciar Categorias</h2>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          className="input" 
          placeholder="Nova categoria..." 
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={!newCat.trim()}>
          <Plus size={20} /> Adicionar
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categories.length === 0 ? (
          <p className="text-muted text-center py-4">Nenhuma categoria cadastrada.</p>
        ) : (
          categories.map(cat => (
            <div key={cat} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              background: 'var(--panel-light)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)'
            }}>
              <span style={{ fontWeight: 600 }}>{cat}</span>
              <button 
                className="btn" 
                style={{ color: 'var(--danger)', padding: '0.5rem' }} 
                onClick={() => handleRemove(cat)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
