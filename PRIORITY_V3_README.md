# Sistema de Priorização V3 - Sequencial

Esta é a terceira versão do sistema de priorização, que implementa um fluxo mais simples e intuitivo onde o usuário adiciona prioridades sequencialmente (1º, 2º, 3º, etc.) sem precisar escolher posições específicas.

## 🎯 Conceito da V3

### ✅ **Fluxo Simplificado**
- **Sem grid de números**: Não mostra todas as posições disponíveis
- **Adição sequencial**: Usuário clica e a ação vira automaticamente a próxima prioridade
- **Interface mais limpa**: Menos elementos visuais, mais foco na ação

### 🔄 **Como Funciona**

1. **Primeira prioridade**: Usuário clica em "Adicionar" → vira 1ª prioridade
2. **Segunda prioridade**: Usuário clica em "Adicionar" → vira 2ª prioridade
3. **E assim por diante**: Cada clique adiciona a próxima posição sequencial

## 📁 Componentes da V3

### 1. **Hook `usePriorityPopoverV3`**
**Arquivo:** `src/hooks/use-priority-popover-v3.tsx`

```typescript
const {
  priorities,           // Array de prioridades definidas
  isPopoverOpen,       // Estado do popover
  selectedAction,      // Ação selecionada no popover
  openPopover,         // Função para abrir popover
  closePopover,        // Função para fechar popover
  addAsNextPriority,   // Adicionar como próxima prioridade
  removePriority,      // Remover prioridade de uma ação
  clearAllPriorities,  // Limpar todas as prioridades
  getCurrentPriorities, // Obter prioridades atuais
  getActionPosition,   // Obter posição de uma ação
  getOrderedActions,   // Obter ações ordenadas
  hasPriority,         // Verificar se ação tem prioridade
  getNextPosition      // Obter próxima posição disponível
} = usePriorityPopoverV3({
  actions,
  pillarId
});
```

### 2. **Componente `PriorityPopoverV3`**
**Arquivo:** `src/components/ui/priority-popover-v3.tsx`

```typescript
<PriorityPopoverV3
  action={action}
  currentPosition={currentPosition}
  nextPosition={getNextPosition()}
  onAddAsNextPriority={addAsNextPriority}
  onRemovePriority={removePriority}
  isOpen={isPopoverOpen}
  onOpenChange={onOpenChange}
  disabled={isCompleted}
/>
```

### 3. **Componente `PriorityListV3`**
**Arquivo:** `src/components/ui/priority-list-v3.tsx`

```typescript
<PriorityListV3
  pillar={pillar}
  actions={actions}
  onComplete={handleComplete}
  isCompleted={isCompleted}
  className={className}
/>
```

## 🚀 Funcionalidades

### ✅ **Adição Sequencial**
- Cada ação adicionada vira automaticamente a próxima prioridade
- Não há escolha de posição - é sempre sequencial
- Interface mais simples e direta

### ✅ **Remoção Inteligente**
- Ao remover uma prioridade, as outras são reordenadas automaticamente
- Se remover a 2ª prioridade, a 3ª vira 2ª, 4ª vira 3ª, etc.

### ✅ **Feedback Visual**
- Botão mostra "Adicionar" quando não priorizada
- Botão mostra "1º", "2º", etc. quando priorizada
- Badge colorido indica a posição atual

### ✅ **Persistência**
- Salva automaticamente no localStorage
- Carrega prioridades ao abrir o componente
- Só envia para Supabase ao clicar "Concluir Pilar"

## 🎨 Interface

### 📱 **Botão Trigger**
- **Sem prioridade**: Ícone + "Adicionar" (ou "Add" em mobile)
- **Com prioridade**: Ícone + "1º", "2º", etc.

### 🎯 **Popover**
- **Descrição completa**: Mostra toda a descrição da ação
- **Próxima posição**: Indica qual será a posição se adicionar
- **Botão de ação**: "Adicionar como Xª Prioridade"
- **Remoção**: Botão X para remover prioridade

### 🎨 **Estilo**
- Consistente com o design da página
- Cores Unimed e tema escuro
- Responsivo para mobile

## 🔄 **Fluxo de Uso**

1. **Lista de Ações**: Ações são exibidas sem prioridades
2. **Clicar em "Adicionar"**: Abre popover com descrição completa
3. **Confirmar Adição**: Clica em "Adicionar como Xª Prioridade"
4. **Feedback Visual**: Badge mostra a posição atribuída
5. **Próxima Ação**: Repete o processo para a próxima prioridade
6. **Remover se necessário**: Clica no X para remover e reordenar
7. **Concluir**: Botão "Concluir Pilar" salva no Supabase

## 📊 **Vantagens da V3**

### ✅ **Simplicidade**
- Interface mais limpa e focada
- Menos decisões para o usuário
- Fluxo mais intuitivo

### ✅ **Velocidade**
- Menos cliques para priorizar
- Não precisa escolher posição específica
- Processo mais rápido

### ✅ **Menos Erro**
- Não há conflito de posições
- Reordenação automática
- Menos chance de erro do usuário

### ✅ **Mobile-Friendly**
- Interface mais simples para telas pequenas
- Menos elementos para interagir
- Melhor experiência touch

## 🔧 **Diferenças das Versões Anteriores**

| Versão | Seleção de Posição | Interface | Complexidade |
|--------|-------------------|-----------|--------------|
| V1 (Modal) | Grid de números | Modal intrusivo | Alta |
| V2 (Popover) | Grid de números | Popover elegante | Média |
| V3 (Sequencial) | Sequencial automática | Popover simples | Baixa |

## 🧪 **Teste a V3**

Execute o exemplo incluído:

```typescript
import { PriorityExampleV3 } from '@/components/examples/PriorityExampleV3';

// Adicione à sua rota para testar
<Route path="/priority-example-v3" element={<PriorityExampleV3 />} />
```

## 🎯 **Casos de Uso Ideais**

- **Usuários menos técnicos**: Interface mais simples
- **Priorização rápida**: Quando não precisa de controle fino
- **Mobile-first**: Melhor experiência em dispositivos móveis
- **Fluxos simples**: Quando a ordem sequencial é suficiente

A V3 oferece a experiência mais simples e direta para priorização, ideal para usuários que preferem um fluxo mais linear e menos complexo! 