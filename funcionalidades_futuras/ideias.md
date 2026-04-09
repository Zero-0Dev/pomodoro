# Funcionalidades Futuras e Ideias

Este espaço serve como um Backlog de Produto para registrar ideias, melhorias e futuras funcionalidades para o aplicativo Pomodoro.

---

## 🚀 Backlog de Produto (Priorizado)

### Cores de Urgência em Tarefas ("Estilo Post-it avançado")
- **Problema:** O layout lado a lado já existe, mas todas as tarefas pendentes parecem iguais, não transmitindo noção de urgência ou de "tarefas esquecidas".
- **Objetivo:** Implementar um sistema de cores dinâmico. Tarefas novas começam com cores frias (azul, verde) e "esquentam" (amarelo, vermelho) conforme os dias passam e elas não são concluídas.
- **Prioridade:** Alta
- **Observações:** O layout básico na lateral já foi feito. Esta etapa complementa dando vida ao UI/UX.

### Gráficos Avançados por Categoria ("Isolamento de Escopo")
- **Problema:** A visualização do esforço não permite entender facilmente em qual projeto ou área (Ex: Estudos vs. PI) o tempo está sendo gasto.
- **Objetivo:** Adicionar filtros e gráficos segmentados na aba 'Estatísticas', alimentados diretamente pelos dados do contexto isolado.
- **Prioridade:** Alta
- **Observações:** Depende de uma base sólida de categorização nas tarefas, que já possuímos.

### Inserção Fluida de Tarefas Diárias
- **Problema:** O fluxo obriga a criar categorias como "afazeres diários" que poluem a tela, o que dificulta micro-tarefas.
- **Objetivo:** Criar um atalho rápido ou grupo "Sem Projeto" visível na Dashboard Principal para despejar micro-tarefas do dia a dia sem fricção.
- **Prioridade:** Média
- **Observações:** Pode ser um campo rápido acima da lista de tarefas pendentes do Dashboard.

### Alerta Psicológico de Inatividade (Efeito Emocional)
- **Problema:** Quando o cronômetro está pausado, os usuários tendem a esquecer e demorar a voltar à atividade.
- **Objetivo:** Acompanhar as inatividades e tocar um leve som de "tic tac" contínuo de relógio quando em pausa, para criar um gatilho de retorno ao foco.
- **Prioridade:** Média
- **Observações:** Além do som, pode exibir "Tempo em pausa: X min" para reforçar a conscientização.

### Janela Flutuante (Picture-in-Picture)
- **Problema:** O usuário perde a noção do tempo caso precise usar outro aplicativo ou aba em tela cheia.
- **Objetivo:** Opção de desanexar o timer como uma janela flutuante que sobrepõe outras janelas (como um mini-player).
- **Prioridade:** Baixa
- **Observações:** Pode exigir uso da API de Picture-in-Picture dos navegadores para a web app.

---

*Nota: O problema Crítico de **Reset de Cronômetro Involuntário**, o **Layout Lado-a-Lado**, e o **Fluxo de Conclusão Padrão Acidental** foram resolvidos no Ciclo 1.*
