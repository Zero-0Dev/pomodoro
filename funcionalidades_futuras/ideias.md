# Funcionalidades Futuras e Ideias

Este espaço serve como um Backlog de Produto para registrar ideias, melhorias e futuras funcionalidades para o aplicativo Pomodoro.

---

## 🚀 Backlog de Produto (Priorizado)

### Controle Manual de Ciclos
Data adicionada: 2026-04-22

- Problema: Após finalizar um ciclo, falta flexibilidade para continuar ou pular etapas.
- Objetivo: Permitir controle total sobre o fluxo do Pomodoro.
- Funcionalidades esperadas:
  - Botão "Pular pausa"
  - Botão "Continuar próximo ciclo"
  - Botão "Finalizar ciclo manualmente"
  - Botão "Reiniciar ciclo"
  - Opção de fluxo contínuo sem pausa obrigatória
- Prioridade: Alta
- Observações: Essencial para melhorar o fluxo contínuo.

### [CONCLUÍDO] Indicador Visual de Sequência de Ciclos
Data adicionada: 2026-04-22

- Problema: Não há visualização clara da sequência de ciclos concluídos.
- Objetivo: Mostrar progresso visual contínuo.
- Funcionalidades esperadas:
  - Bolinhas visuais representando ciclos (ex: ● ● ● ○)
  - Destaque do ciclo atual
  - Histórico visual dos últimos ciclos
  - Feedback visual ao concluir ciclo
- Prioridade: Alta

### [CONCLUÍDO] Sincronização entre Tarefas e Timer
Data adicionada: 2026-04-22

- Problema: Tarefas não estão totalmente conectadas aos ciclos.
- Objetivo: Permitir que tarefas sejam vinculadas diretamente ao timer.
- Funcionalidades esperadas:
  - Escolher tarefa antes de iniciar ciclo
  - Ativar tarefa durante ciclo
  - Registrar ciclos por tarefa
  - Permitir vários ciclos por tarefa
  - Manter tarefa ativa por vários dias
- Prioridade: Alta

### [CONCLUÍDO] Notificação ao Finalizar Ciclo
Data adicionada: 2026-04-22

- Problema: O fim do ciclo não é perceptível o suficiente.
- Objetivo: Criar um aviso claro e discreto ao finalizar um ciclo.
- Funcionalidades esperadas:
  - Notificação sonora suave
  - Notificação visual na tela
  - Opção de ativar/desativar som
  - Opção de escolher volume
  - Animação leve ao finalizar ciclo
- Prioridade: Alta
- Observações: O som deve ser discreto, curto e não irritante.

### Auto-Início Inteligente de Ciclos
Data adicionada: 2026-04-22

- Problema: O usuário precisa iniciar manualmente cada etapa.
- Objetivo: Automatizar fluxo quando desejado.
- Funcionalidades esperadas:
  - Auto iniciar pausa após foco
  - Auto iniciar foco após pausa
  - Opção de ativar/desativar
- Prioridade: Alta

### [CONCLUÍDO] Tarefa Ativa Sempre Visível
Data adicionada: 2026-04-22

- Problema: A tarefa atual não fica clara durante o uso.
- Objetivo: Mostrar claramente qual tarefa está sendo executada.
- Funcionalidades esperadas:
  - Mostrar sempre: Tarefa atual, Quantidade de pomodoros feitos, Tempo acumulado
- Prioridade: Alta

### [CONCLUÍDO] Unificação Estética da Aba de Tarefas ("Cyberpunk Pareamento")
Data adicionada: 2026-04-08

- Problema: A aba principal de 'Gestão de Tarefas' não foi atualizada para a nova linguagem visual Cyberpunk. Os formulários e filtros têm um design mais tradicional que destoa da Dashboard brilhante.
- Objetivo: Adicionar os glows neon nas tarefas, botões e filtros. O glow deve refletir o estado do Filtro ativo (ex: Cyan para todos, vermelho/amarelo para prioridades).
- Funcionalidades esperadas:
  - Estilização completa das tarefas, botões e filtros.
  - Cores correspondentes aos filtros (Neon Cyan, Vermelho, Amarelo).
- Prioridade: Alta
- Observações: Essencial para a consistência visual da aplicação.

### [CONCLUÍDO] Meta Diária de Pomodoros
Data adicionada: 2026-04-22

- Problema: Falta um objetivo diário claro.
- Objetivo: Criar meta diária.
- Funcionalidades esperadas:
  - Meta: 8 Pomodoros
  - Progresso: 5/8
- Prioridade: Média

### [CONCLUÍDO] Streak (Sequência de Dias)
Data adicionada: 2026-04-22

- Problema: Falta motivação de continuidade.
- Objetivo: Mostrar sequência de dias produtivos.
- Funcionalidades esperadas:
  - Exibir: 🔥 3 dias seguidos
- Prioridade: Média

### Indicador Visual de Modo Atual
Data adicionada: 2026-04-22

- Problema: Não é fácil identificar rapidamente o estado atual do cronômetro pelas cores, apenas pelo texto.
- Objetivo: Usar cores para indicar o modo de forma mais clara.
- Funcionalidades esperadas:
  - Vermelho → Foco
  - Verde → Pausa
  - Azul → Pausa longa
- Prioridade: Média

### Timer no Título da Aba
Data adicionada: 2026-04-22

- Problema: O tempo restante não aparece ao trocar de aba no navegador.
- Objetivo: Mostrar tempo restante no título do navegador.
- Funcionalidades esperadas:
  - Exemplo: "(12:32) Pomodoro" no `<title>`
- Prioridade: Média

### Janela Flutuante (Picture-in-Picture)
Data adicionada: 2026-04-08

- Problema: O usuário perde a noção do tempo caso precise usar outro aplicativo ou aba em tela cheia.
- Objetivo: Criar um mini-cronômetro flutuante.
- Funcionalidades esperadas:
  - Opção nativa (API de Document Picture-in-Picture) ou janela "Desanexar".
- Prioridade: Média
- Observações: As APIs de PiP atuais são um pouco restritas em navegadores.

### Notificações de Navegador e PWA
Data adicionada: 2026-04-08

- Problema: Somente som nem sempre é o suficiente na finalização do Pomodoro, e o app poderia ser instalável no Desktop para parecer nativo.
- Objetivo: Transformar em PWA, adicionando manifest json e garantindo as notificações nativas.
- Funcionalidades esperadas:
  - Manifest.json para PWA
  - Suporte a Service Workers
  - Notificações nativas do S.O.
- Prioridade: Baixa

---

## 💡 Ideias de Expansão

### [IMPLEMENTADO] Flow de Ideias (Thought Flow Board)
Data adicionada: 2026-04-22

- Problema: Falta um espaço visual para capturar e organizar pensamentos livres durante sessões de foco.
- Objetivo: Criar um quadro visual interativo onde o usuário possa organizar pensamentos em blocos arrastáveis.
- Funcionalidades implementadas:
  - Aba dedicada "Flow Board" na navegação lateral
  - Criar blocos de ideias com texto editável inline
  - Arrastar blocos livremente pelo canvas com mouse drag-and-drop nativo
  - Grade visual opcional (ativável/desativável)
  - Persistência completa via localStorage (`pomodoro_flow_nodes`)
  - Botão "Converter em tarefa" — cria tarefa no sistema e vincula ao bloco
  - Bloco exibe badge verde quando vinculado a uma tarefa
  - Botão de excluir bloco individual
  - Botão de limpar todos os blocos
  - Visual dark Cyberpunk consistente com o restante do app
- Componentes criados:
  - `FlowBoard.jsx` — Canvas principal com lógica de drag e persistência
  - `FlowNode.jsx` — Bloco individual arrastável
  - `FlowToolbar.jsx` — Barra de ações superior
  - `FlowBoard.css` — Estilos Cyberpunk dedicados
- Prioridade: Média
- Observações: Implementado sem React Flow para manter o bundle enxuto. Drag via mouse events nativos do browser.

---

*Nota: As implementações críticas de Estado (Ciclo 1) e Tema/Comportamentos Urgentes (Ciclo 2) estão concluídas e integradas.*

