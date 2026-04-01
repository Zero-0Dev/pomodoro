# Pomodoro PRO 🍅

Fala pessoal! 👋 Esse é um aplicativo de Pomodoro que criei para me ajudar (e ajudar quem precisar) a focar melhor nas tarefas do dia a dia e evitar a procrastinação.

Eu já tinha feito uma versão mais simples antes, mas ela acabava dando uns bugs no timer (principalmente quando eu mudava de aba no navegador). Então, decidi **refatorar esse projeto do zero** usando uma stack mais moderna e robusta para garantir que ele ficasse 100% estável e funcional para o meu uso real.

🔗 **[Acessar o Pomodoro PRO online](https://zero-0dev.github.io/pomodoro/)**

## O que tem de legal aqui? 🚀

- **Timer à prova de bugs:** Ele não pausa e nem "desacelera" se você trocar de aba. O tempo é calculado com base no relógio do sistema.
- **Chega de procrastinar:** Antes de focar, ele te pergunta *o que* você vai fazer. No fim do foco, você avalia se conseguiu terminar ou não.
- **Histórico e Gráficos:** Tem uma aba só para você ver todo o seu progresso, com gráficos mostrando suas estatísticas de sucesso nas tarefas (tudo construído com Recharts).
- **Sem banco de dados, muita privacidade:** Salva tudo localmente no seu navegador de forma segura (`localStorage`).
- **Backup dos dados:** Nas configurações, dá pra exportar todo o seu histórico e configurações para um JSON e importar em outra máquina.

## Ferramentas que usei 🛠️

- **React + Vite:** Para criar a interface rápida e componentizada, sem dores de cabeça.
- **CSS puro (modules global):** Mantendo a simplicidade e leveza, sem bibliotecas pesadas de estilo, mas com uma pegada Dark Mode moderna.
- **Lucide React:** Para uns ícones minimalistas e bacanas.
- **Recharts:** Para os gráficos do dashboard.

## Como rodar o projeto na sua máquina 💻

Se você quiser clonar e rodar o projeto localmente para dar uma olhada no código, é super simples:

1. Clone esse repositório
2. Abra seu terminal na pasta do projeto e rode o comando pra instalar as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor local de desenvolvimento:
   ```bash
   npm run dev
   ```

## Próximos passos (talvez?)
- Futuramente penso em tentar colocar um banco de dados de verdade em nuvem (tipo Firebase) pra poder acessar o mesmo histórico do computador e do celular.

Fique à vontade para usar o app ou fuçar no código! 🍻
