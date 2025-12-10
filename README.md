# minhas-financas
### **Autor:** Eduardo de Almeida Fernandes
Esta aplicação tem como objetivo de implementar um gerenciador de despesas pessoais, onde o usuário após logar na plataforma, terá acesso a um dashboard com um resumo do saldo atual, receitas, despesas, últimas transações e cotação de moedas em tempo real. Ele também poderá adicionar uma receita ou despesas e posteriormente ter acesso a essas transações de forma facilitada, permitindo total controle sobre suas finanças.

O frontend da aplicação foi desenvolvido com **HTML**, **TailwindCSS**, **DaisyUI** e **JavaScript**, utilizando **Vite** para gerenciamento de dependências e build. O calendário foi implementado via Web Components com a biblioteca **Cally**.

## Design das Telas - Figma: 
### Web:
https://www.figma.com/design/Fr6EE1slMn1HOiaesUQxGe/Gerenciador-de-finan%C3%A7as-pessoais?node-id=3-165&p=f&t=BbvisTgYWgJ82sQB-0

### Mobile
https://www.figma.com/design/Fr6EE1slMn1HOiaesUQxGe/Gerenciador-de-finan%C3%A7as-pessoais?node-id=0-1&p=f&t=BbvisTgYWgJ82sQB-0

## Design System: 
https://www.figma.com/design/Fr6EE1slMn1HOiaesUQxGe/Gerenciador-de-finan%C3%A7as-pessoais?node-id=3-546&p=f&t=BbvisTgYWgJ82sQB-0

## Site em Produção - GitHub Pages
- [Link para o GitHub Pages](https://edu-almeidaf.github.io/gerenciador-de-despesas-pessoais/)

## Tecnologias e Dependências
- **TailwindCSS v4** - Framework CSS utilitário.
- **DaisyUI 5** - Biblioteca de componentes.
- **Vite** - Build tool e servidor de desenvolvimento.
- **Cally** - Web Component de calendário acessível.

## Dependências JavaScript
- **jQuery 3.7** - Manipulação do DOM, eventos e requisições AJAX.
- **JSON Server 0.17** - Simula uma API REST para persistência de dados.
- **Concurrently** - Executa múltiplos comandos em paralelo (Vite + JSON Server).
- **ESLint** - Linter para análise e correção de código JavaScript.

## Checklist | Indicadores de Desempenho (ID) dos Resultados de Aprendizagem (RA)

#### RA1 - Utilizar Frameworks CSS para estilização de elementos HTML e criação de layouts responsivos.
- [x] ID0 - Prototipa interfaces adaptáveis para no mínimo os tamanhos de tela mobile e desktop, usando ferramentas de design como Figma, Quant UX ou Sketch.
- [x] ID01 - Implementa um layout responsivo de uma página web utilizando um Framework CSS, como Bootstrap, Materialize ou Tailwind (com DaisyUI), aproveitando as técnicas de Flexbox ou Grid oferecidas pelo próprio framework, garantindo que o layout se adapte adequadamente a diferentes tamanhos de tela e dispositivos.
- [x] ID 02 - Utiliza técnica de responsividade nativa de CSS, como Flexbox ou Grid Layout, para criar layouts responsivos e fluidos em diferentes resoluções de tela.
- [x] ID 03 - Utiliza componentes CSS (ex. card, button ou outros) e JavaScript (ex. modal, carrousel ou outro) oferecidos por um Framework CSS.
- [x] ID 04 - Implementa um layout fluido e responsivo utilizando unidades relativas (vw, vh, %, em ou rem) em vez de unidades fixas (px) em diferentes dispositivos e tamanhos de tela.
- [x] ID 05 - Implementa animações em elementos da página, como fadeIn/fadeOut, slideIn/slideOut, utilizando CSS Animations ou bibliotecas de animação, como o Animate.css ou JQuery, para fornecer feedback visual ao usuário e criar uma experiência interativa.
- [x] ID 06 - Cria transições personalizadas entre diferentes estados da página ou elementos, como mudanças de layout, alterações de cor ou exibição/hide de elementos, usando CSS Transitions ou CSS Animation, para melhorar a usabilidade e a aparência da aplicação.
- [x] ID 07 - Aplica um Design System consistente, definindo diretrizes de estilo, cores, tipografia e padrões de componentes que são seguidos em toda a aplicação, garantindo uma experiência de usuário uniforme e atraente.
- [ ] ID 08 - Implementa pré-processadores CSS, como o Sass, em conjunto com um Framework CSS ou de forma isolada, para organizar e modularizar o código CSS, aplicando variáveis, mixins e funções para facilitar a manutenção e escalabilidade dos estilos.
- [x] ID 09 - Aplica tipografia responsiva utilizando media queries ou a função clamp(), em conjunto com unidades relativas como rem, em ou vw, para ajustar o tamanho da fonte de acordo com diferentes tamanhos de tela.

#### RA2 - Realizar tratamento de formulários e aplicar validações customizadas no lado cliente, utilizando a API do HTML e expressões regulares (REGEX).
- [x] ID 10 - Implementa tratamento de formulários no lado cliente com apresentação de mensagens de erro (texto próximo dos campos de entrada ou balões com mensagens) ou sucesso, utilizando os recursos da API do HTML, como validação de campos obrigatórios, tipo de entrada e limites de caracteres, garantindo que os dados inseridos sejam válidos antes de serem enviados para o servidor (via tratador de evento submit).
- [x] ID 11 - Aplica expressões regulares (REGEX) de forma eficiente para realizar validações customizadas nos campos de formulários, como formatos específicos de e-mail, telefone, data ou outros padrões personalizados definidos pelos requisitos do projeto.
- [x] ID 12 - Incorpora elementos de listagem, como checkbox, radio ou select, de maneira eficiente em formulários web, possibilitando a seleção e coleta precisa de dados pelos usuários.
- [x] ID 13 - Realiza a escrita e leitura de dados no Web Storage, permitindo a persistência de informações entre sessões de usuário e fornecendo uma maneira eficaz de armazenar dados localmente no navegador.

#### RA3 - Aplicar ferramentas para otimização do processo de desenvolvimento web, incluindo Node.js, NPM e linters para garantir a qualidade do código, juntamento com boas práticas de versionamento e organização de projetos.
- [x] ID 14 - Configura adequadamente um ambiente de desenvolvimento usando Node.js e NPM para gerenciar pacotes e dependências do projeto, facilitando a instalação e o uso de bibliotecas e ferramentas de terceiros.
- [x] ID 15 - Utiliza linters, como ESLint ou Stylelint, para analisar e corrigir automaticamente problemas de código, incluindo erros de sintaxe, estilo e boas práticas, garantindo a qualidade e consistência do código do projeto.
- [x] ID 16 - Adota boas práticas de versionamento utilizando sistemas como Git e GitHub, criando e gerenciando repositórios com branches adequados ou pelo menos o branch main.
- ~[x] ID 17 - Utiliza técnicas de minificação e otimização de recursos, como minificação de CSS e JavaScript e otimização de imagens, para melhorar o desempenho e o tempo de carregamento do site ou aplicação.~
- [x] ID 18 - Organiza o arquivo README.md conforme o template exigido na disciplina, contendo informações claras e estruturadas sobre o projeto, principalmente o checklist de tópicos devidamente preenchido.
- [x] ID 19 - Organiza os arquivos do projeto em uma estrutura coerente, lógica e modular, conforme projeto de exemplo, facilitando a localização, manutenção e escalabilidade.
- ~[ ] ID 20 - Utiliza as metodologias BEM (Block Element Modifier) ou SMACSS (Scalable and Modular Architecture for CSS) para organizar e estruturar os estilos CSS de forma eficiente, garantindo a reutilização de estilos, a legibilidade do código e a manutenção sustentável do projeto.~

#### RA4 - Aplicar bibliotecas de funções e componentes em JavaScript para aprimorar a interatividade de páginas web.
- [x] ID 21 - Utiliza a biblioteca jQuery para manipular o DOM e aprimorar a interatividade das páginas web, implementando funcionalidades como eventos, animações e manipulação de elementos HTML de forma eficiente.  
- [x] ID 22 - Seleciona e integra com sucesso um plugin jQuery, como o jQuery Mask Plugin ou outro plugin relevante para o projeto, a fim de melhorar a funcionalidade ou a aparência de elementos específicos em uma página web. *(Implementado: máscara monetária customizada estilo app bancário em transacao.js)* 
- ~[x] ID 23 - Utiliza bibliotecas de web components, como Lit, para criar componentes reutilizáveis e encapsulados, melhorando a modularidade e a manutenibilidade das páginas web.~ 
- ~[x] ID 24 - Utiliza uma biblioteca de componentes prontos, como Material Web Components ou outra de escolha, ou então, algum componente independente (standalone) a fim de oferecer funcionalidades específicas sem a necessidade de estar integrado a uma biblioteca completa.~

#### RA5 - Efetuar requisições assíncronas para uma API fake e APIs públicas, permitindo a obtenção e manipulação de dados dinamicamente.
- [x] ID 25 - Realiza requisições assíncronas para uma API fake utilizando adequadamente conceitos como AJAX, Fetch API ou bibliotecas, para persistir os dados originados de um formulário.
- [x] ID 26 - Realiza requisições assíncronas para uma API fake utilizando adequadamente conceitos como AJAX, Fetch API ou bibliotecas, para exibição dos dados na página web.

## Manual de execução

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- NPM

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
git clone https://github.com/edu-almeidaf/gerenciador-de-despesas-pessoais.git
cd gerenciador-de-despesas-pessoais
```

2. Instale as dependências:
```bash
npm install
```

### Executando o projeto

O projeto utiliza Vite para desenvolvimento e JSON Server para API fake.

#### Modo Desenvolvimento (Recomendado)

Para rodar o projeto completo (Vite + JSON Server) localmente:
```bash
npm run dev:full
```
- Frontend: http://localhost:5173 (ou porta alternativa)
- API: http://localhost:3001

#### Apenas Frontend
```bash
npm run dev
```

#### Apenas API (JSON Server)
```bash
npm run server
```

#### Verificar Código com ESLint
```bash
npm run lint
```

#### Corrigir Código Automaticamente
```bash
npm run lint:fix
```

---

Gerar Versão de Produção (Build)
Para gerar os arquivos otimizados e minificados na pasta dist/:
```bash
npm run build
```

---

Deploy no GitHub Pages
O projeto já conta com script configurado para deploy automático:
```bash
npm run deploy
```

> **Nota:** As telas são totalmente responsivas e se adaptam automaticamente entre mobile e desktop usando TailwindCSS com abordagem mobile-first.

## Funcionalidades Implementadas

### Autenticação
- **Login** Com validação de email (REGEX) e verificação de credenciais via API
- **Cadastro** Com validações de nome completo, email, senha (força) e confirmação
- **Sessão persistida** No localStorage
- **Proteção de rotas** - Redireciona para login se não autenticado
- **Logout** Com animação de saída

### Dashboard
- **Cards dinâmicos** - Saldo, Receitas e Despesas calculados das transações
- **Últimas 10 transações** - Ordenadas por data
- **Cotações em tempo real** - Dólar e Euro via API AwesomeAPI
- **Nome do usuário** Exibido dinamicamente

### Adicionar Transação
- **Input de valor estilo bancário** - Digita da direita para esquerda (centavos → reais)
- **Máscara de moeda customizada** - Implementação própria inspirada em apps de banco
- **Calendário interativo** - Seleção de data com Web Component Cally
- **Categorias** - Select com opções pré-definidas
- **Validação REGEX** - Descrição, valor e data obrigatórios
- **Persistência** - Salva transação via API (JSON Server)

### Todas as Transações
- **Listagem completa** - Exibe todas as transações do usuário
- **Paginação** - 10 itens por página com navegação intuitiva
- **Filtro por busca** - Pesquisa por descrição com debounce
- **Filtro por tipo** - Receitas, Despesas ou Todas
- **Filtro por período** - Este mês, Mês passado, Últimos 3 meses, Este ano
- **Limpar filtros** - Botão para resetar todos os filtros (aparece quando há filtro ativo)
- **Exclusão** - Remove transações com confirmação

### Validações com REGEX
- Email: padrão RFC 5322 simplificado
- Nome: letras, acentos, espaços (mínimo nome + sobrenome)
- Senha: força com indicador visual (fraca/média/forte)
- Descrição: mínimo 3 caracteres, máximo 100
- Valor: formato monetário brasileiro (1.234,56)
- Data: formato DD/MM/AAAA

### UX/Acessibilidade
- **Botões disabled** - Botões de submit ficam desabilitados até preencher todos os campos obrigatórios
- **Feedback visual** - Inputs com estados de sucesso/erro e mensagens inline
- **Animações** - Transições suaves entre páginas (fadeIn/fadeOut)
- **Shake animation** - Feedback visual em erros de formulário
- **Loading states** - Indicadores de carregamento durante requisições

## Telas da aplicação

Todas as telas são responsivas e unificadas (mobile e web no mesmo arquivo):

- [Login](./index.html) - Tela de login responsiva
- [Cadastro](./cadastro.html) - Tela de cadastro de novo usuário responsiva
- [Dashboard](./dashboard.html) - Dashboard com cards e transações responsivo
- [Adicionar Transação](./adicionar-transacao.html) - Formulário para adicionar transação responsivo
- [Todas as Transações](./todas-transacoes.html) - Lista/tabela de todas as transações responsiva

### Estrutura de arquivos

```
├── adicionar-transacao.html     # Adicionar transação (mobile + web)
├── cadastro.html                # Tela de cadastro (mobile + web)
├── dashboard.html               # Dashboard (mobile + web)
├── db.json                      # Banco de dados fake (JSON Server)
├── eslint.config.js             # Configuração do ESLint
├── index.html                   # Tela de login (mobile + web)
├── package.json                 # Dependências      
├── package-lock.json            # Dependências secundárias necessárias
├── README.md                    # Documentação do projeto
├── src
│   ├── css
│   │   └── style.css            # Estilos customizados e configurações Tailwind
│   └── js
│       ├── auth.js              # Módulo de autenticação (login, cadastro, sessão)
│       ├── cadastro.js          # Lógica da página de cadastro
│       ├── calendar.js          # Configuração do calendário Cally
│       ├── dashboard.js         # Lógica do dashboard (transações, cotações)
│       ├── login.js             # Lógica da página de login
│       ├── main.js              # Arquivo principal (importa CSS e libs)
│       ├── protegido.js         # Script para páginas que requerem autenticação
│       ├── transacao.js         # Lógica da página de adicionar transação
│       ├── transacoes.js        # Lógica da página de todas as transações
│       └── validacao.js         # Módulo de validações com REGEX
├── todas-transacoes.html        # Todas as transações (mobile + web)
└── vite.config.js               # Configurações do Vite
```

## Usuário de Teste

Para testar a aplicação, use as credenciais:
- **Email:** `ricardo@email.com`
- **Senha:** `123456`
