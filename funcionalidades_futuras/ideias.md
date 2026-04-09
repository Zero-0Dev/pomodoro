# Funcionalidades Futuras e Ideias

Este espaço serve como um Backlog de Produto para registrar ideias, melhorias e futuras funcionalidades para o aplicativo Pomodoro.

---

## 🚀 Backlog de Produto (Priorizado)

### Unificação Estética da Aba de Tarefas ("Cyberpunk Pareamento")
- **Problema:** A aba principal de 'Gestão de Tarefas' (`TasksManager.jsx`) não foi atualizada para a nova linguagem visual Cyberpunk. Os formulários e filtros têm um design mais tradicional que destoa da Dashboard brilhante.
- **Objetivo:** Adicionar os glows neon nas tarefas, botões e filtros. O glow deve refletir o estado do Filtro ativo (ex: Cyan para todos, vermelho/amarelo para prioridades).
- **Prioridade:** Alta
- **Observações:** Essencial para a consistência visual da aplicação.

### Janela Flutuante (Picture-in-Picture)
- **Problema:** O usuário perde a noção do tempo caso precise usar outro aplicativo ou aba em tela cheia (como ferramentas IDE ou leitores de PDF).
- **Objetivo:** Uma opção nativa (API de Document Picture-in-Picture) ou janela "Desanexar" que crie um mini-cronômetro flutuante.
- **Prioridade:** Média
- **Observações:** As APIs de PiP atuais são um pouco restritas em navegadores para Canvas/Documentos em vez de vídeo. Talvez precisemos usar um elemento Canvas simulando vídeo, ou a recém-chegada `documentPictureInPicture` (apenas Chrome 116+).

### Notificações de Navegador e PWA
- **Problema:** Somente som nem sempre é o suficiente na finalização do Pomodoro, e o app poderia ser instalável no Desktop para parecer nativo.
- **Objetivo:** Transformar em PWA, adicionando manifest json e garantindo as notificações nativas.
- **Prioridade:** Baixa
- **Observações:** A fundação existe, mas precisa de polimento para Service Workers.

---

*Nota: As implementações críticas de Estado (Ciclo 1) e Tema/Comportamentos Urgentes (Ciclo 2) estão concluídas e integradas.*
