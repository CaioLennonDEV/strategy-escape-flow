# Missão Estratégica

Sistema de priorização estratégica para empresas, desenvolvido com React, TypeScript e Shadcn UI.

## Sobre o Projeto

**Missão Estratégica** é uma aplicação web moderna que permite às empresas organizarem e priorizarem suas ações estratégicas de forma intuitiva e visual. O sistema oferece:

- 🎯 Priorização visual com animações fluidas
- 📱 Interface responsiva para mobile e desktop
- 🎨 Design moderno com tema glassmorphism
- ⚡ Performance otimizada com React 18
- 🔒 Autenticação segura via OTP
- 💾 Persistência de dados com Supabase

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **UI**: Shadcn UI + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Build**: Vite
- **Estado**: Redux Toolkit
- **Roteamento**: React Router DOM

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre na pasta do projeto
cd strategy-escape-flow

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Acesse a aplicação

Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## Funcionalidades Principais

### 🎯 Sistema de Priorização V4
- Priorização com um clique
- Animações de deslize suaves
- Ordenação visual automática
- Interface responsiva

### 📊 Gestão de Pilares
- Criação e edição de pilares estratégicos
- Ações organizadas por categoria
- Progresso visual em tempo real

### 🔐 Autenticação
- Login via OTP (One-Time Password)
- Sessões seguras
- Proteção de rotas

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI (Shadcn)
│   └── examples/       # Exemplos de uso
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── lib/                # Utilitários e tipos
└── integrations/       # Integrações externas (Supabase)
```

## Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linting do código
```

### Padrões de Código

- **TypeScript**: Tipagem forte em todo o projeto
- **ESLint**: Configuração Airbnb
- **Prettier**: Formatação automática
- **Hooks**: Lógica encapsulada em custom hooks
- **Componentes**: Funcionais com React 18

## Deploy

O projeto pode ser deployado em qualquer plataforma que suporte aplicações React:

- **Vercel**: Deploy automático
- **Netlify**: Deploy com drag & drop
- **GitHub Pages**: Deploy via GitHub Actions
- **AWS Amplify**: Deploy na AWS

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte

Para suporte, entre em contato através do [Lovable](https://lovable.dev/projects/0580a51b-2d4b-4890-a08a-7d40a17aab63).
