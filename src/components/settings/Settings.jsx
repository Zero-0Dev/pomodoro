import React, { useState } from 'react';
import { usePomodoro, DEFAULT_SETTINGS } from '../../store/PomodoroContext';

export default function Settings() {
  const { settings, updateSettings, history, categories } = usePomodoro();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value)
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(localSettings);
    alert('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    if (confirm("Deseja restaurar as configurações padrão?")) {
      setLocalSettings(DEFAULT_SETTINGS);
      updateSettings(DEFAULT_SETTINGS);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ settings, history, categories }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'pomodoro_backup.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target.result);
        if (obj.settings && Array.isArray(obj.history) && Array.isArray(obj.categories)) {
          // Atualizando as chaves reais no localStorage (A função useLocalStorage no react atualizará nos re-renders)
          localStorage.setItem('pomodoro_settings', JSON.stringify(obj.settings));
          localStorage.setItem('pomodoro_history', JSON.stringify(obj.history));
          localStorage.setItem('pomodoro_categories', JSON.stringify(obj.categories));
          alert("Importado com sucesso! O aplicativo será recarregado para aplicar as mudanças.");
          window.location.reload();
        } else {
          alert('Formato de backup inválido. A estrutura não bate.');
        }
      } catch (err) {
        alert('Erro ao carregar arquivo de backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Configurações Globais</h2>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 100px', gap: '1rem', alignItems: 'center' }}>
          <label className="text-muted" style={{ fontWeight: 600 }}>Tamanho do Foco (min)</label>
          <input type="number" name="pomodoroTime" className="input" value={localSettings.pomodoroTime} onChange={handleChange} min="1" max="180"/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 100px', gap: '1rem', alignItems: 'center' }}>
          <label className="text-muted" style={{ fontWeight: 600 }}>Pausa Curta (min)</label>
          <input type="number" name="shortBreakTime" className="input" value={localSettings.shortBreakTime} onChange={handleChange} min="1" max="60"/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 100px', gap: '1rem', alignItems: 'center' }}>
          <label className="text-muted" style={{ fontWeight: 600 }}>Pausa Longa (min)</label>
          <input type="number" name="longBreakTime" className="input" value={localSettings.longBreakTime} onChange={handleChange} min="1" max="120"/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 100px', gap: '1rem', alignItems: 'center' }}>
          <label className="text-muted" style={{ fontWeight: 600 }}>Focos até Pausa Longa</label>
          <input type="number" name="cyclesBeforeLongBreak" className="input" value={localSettings.cyclesBeforeLongBreak} onChange={handleChange} min="1" max="12"/>
        </div>

        <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="text-muted" style={{ fontWeight: 600 }}>Auto-iniciar Próximo Ciclo</label>
          <input type="checkbox" name="autoStartNext" checked={localSettings.autoStartNext} onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="text-muted" style={{ fontWeight: 600 }}>Alarme Sonoro</label>
          <input type="checkbox" name="soundEnabled" checked={localSettings.soundEnabled} onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="text-muted" style={{ fontWeight: 600 }}>Notificações Desktop</label>
          <input type="checkbox" name="notificationsEnabled" checked={localSettings.notificationsEnabled} onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={handleReset} style={{ flex: 1 }}>Restaurar Defaults</button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Salvar Alterações</button>
        </div>
      </form>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
         <h3 style={{ marginBottom: '1rem' }}>Gerenciamento de Dados</h3>
         <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={exportData}>Exportar Backup</button>
            <label className="btn btn-secondary">
               Importar Backup
               <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            </label>
         </div>
         <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
           A importação substituirá todo o seu histórico atual de pomodoro.
         </p>
      </div>
    </div>
  );
}
