import React, { useMemo } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';

export default function Dashboard() {
  const { history, categories } = usePomodoro();

  const chartData = useMemo(() => {
    // Agrupa sessões dos últimos 7 dias
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toDateString();
    });

    const dataMap = {};
    last7Days.forEach(day => {
      dataMap[day] = 0;
    });

    history.forEach(session => {
      const d = new Date(session.date).toDateString();
      if (dataMap[d] !== undefined) {
        dataMap[d] += 1; // conta apenas número de sessões
      }
    });

    return last7Days.map(day => ({
      name: new Date(day).toLocaleDateString('pt-BR', { weekday: 'short' }),
      Pomodoros: dataMap[day]
    }));
  }, [history]);

  const taskStats = useMemo(() => {
    const total = history.length;
    if(total === 0) return { concluido: 0, parcial: 0, nao_concluido: 0 };
    
    const count = { concluido: 0, parcial: 0, nao_concluido: 0 };
    history.forEach(s => {
      if(s.evaluation) count[s.evaluation]++;
    });
    
    return {
      concluido: Math.round((count.concluido / total) * 100),
      parcial: Math.round((count.parcial / total) * 100),
      nao_concluido: Math.round((count.nao_concluido / total) * 100)
    };
  }, [history]);

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Estatísticas de Produtividade</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <div className="stat-card" style={{ background: 'var(--panel-light)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Total de Focos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{history.length}</p>
        </div>
        
        <div className="stat-card" style={{ background: 'var(--panel-light)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Taxa de Sucesso</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{taskStats.concluido}%</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>Focos nos Últimos 7 Dias</h3>
      {history.length === 0 ? (
        <div className="empty-state text-muted text-center" style={{ padding: '3rem 0' }}>
          Complete alguns Pomodoros para ver os gráficos.
        </div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <Bar dataKey="Pomodoros" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="var(--primary)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
