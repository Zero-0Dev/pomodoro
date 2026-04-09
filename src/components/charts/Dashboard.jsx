import React, { useMemo } from 'react';
import { usePomodoro } from '../../store/PomodoroContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

// Paleta neon para os projetos no gráfico
const CATEGORY_COLORS = [
  'var(--primary-hover)', // cyan
  'var(--success)', // neon green
  'var(--warning)', // yellow
  'var(--primary)', // pink
  '#b142f5', // purple
];

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
      dataMap[day] = {};
      categories.forEach(cat => { dataMap[day][cat] = 0; });
      dataMap[day]['Sem Categoria'] = 0;
    });

    history.forEach(session => {
      const d = new Date(session.date).toDateString();
      if (dataMap[d]) {
        const cat = session.category || 'Sem Categoria';
        if (dataMap[d][cat] !== undefined) {
           dataMap[d][cat] += 1; // Incrementa pomodoro daquela categoria
        } else {
           dataMap[d][cat] = 1;
        }
      }
    });

    return last7Days.map(day => {
      const obj = { name: new Date(day).toLocaleDateString('pt-BR', { weekday: 'short' }) };
      Object.keys(dataMap[day]).forEach(k => {
        if (dataMap[day][k] > 0) {
          obj[k] = dataMap[day][k];
        }
      });
      return obj;
    });
  }, [history, categories]);

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

  // Descobre as keys ativas no chartData
  const activeKeys = useMemo(() => {
    const keys = new Set();
    chartData.forEach(d => {
      Object.keys(d).forEach(k => {
        if (k !== 'name') keys.add(k);
      });
    });
    return Array.from(keys);
  }, [chartData]);

  return (
    <div className="card" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', textShadow: '0 0 10px rgba(0,240,255,0.4)', color: 'var(--primary-hover)' }}>Produtividade Isolada</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <div className="stat-card" style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Total de Focos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', textShadow: '0 0 10px rgba(255,0,60,0.5)' }}>{history.length}</p>
        </div>
        
        <div className="stat-card" style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Taxa de Sucesso</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)', textShadow: '0 0 10px rgba(57,255,20,0.5)' }}>{taskStats.concluido}%</p>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>Focos por Categoria (Últimos 7 dias)</h3>
      {history.length === 0 ? (
        <div className="empty-state text-muted text-center" style={{ padding: '3rem 0' }}>
          Complete alguns Pomodoros para ver os gráficos Cyberpunk.
        </div>
      ) : (
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: 'var(--bg)', border: '1px solid var(--primary-hover)', borderRadius: 'var(--radius)', boxShadow: 'var(--border-glow)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {activeKeys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  stackId="a" 
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                  radius={index === activeKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
