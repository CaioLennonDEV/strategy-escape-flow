# Sistema de Priorização com Popover

Este sistema implementa um componente de priorização que utiliza Popover em vez de Modal para seleção de prioridades, oferecendo uma experiência mais fluida e intuitiva.

## Componentes Principais

### 1. `usePriorityPopover` Hook
**Arquivo:** `src/hooks/use-priority-popover.tsx`

Hook personalizado que gerencia todo o estado das prioridades:

```typescript
const {
  priorities,           // Array de prioridades definidas
  isPopoverOpen,       // Estado do popover
  selectedAction,      // Ação selecionada no popover
  openPopover,         // Função para abrir popover
  closePopover,        // Função para fechar popover
  assignPosition,      // Atribuir posição a uma ação
  removePosition,      // Remover posição de uma ação
  clearAllPriorities,  // Limpar todas as prioridades
  getOccupiedPositions,    // Obter posições ocupadas
  getAvailablePositions,   // Obter posições disponíveis
  getActionPosition,       // Obter posição de uma ação
  getOrderedActions,       // Obter ações ordenadas
  hasPriority             // Verificar se ação tem prioridade
} = usePriorityPopover({
  actions,
  pillarId,
  onPrioritiesChange
});
```

### 2. `PriorityPopover` Component
**Arquivo:** `src/components/ui/priority-popover.tsx`

Componente que renderiza o popover de seleção de posições:

```typescript
<PriorityPopover
  action={action}
  currentPosition={currentPosition}
  availablePositions={availablePositions}
  occupiedPositions={occupiedPositions}
  onAssignPosition={assignPosition}
  onRemovePosition={removePosition}
  isOpen={isPopoverOpen}
  onOpenChange={onOpenChange}
  disabled={isCompleted}
/>
```

### 3. `PriorityList` Component
**Arquivo:** `src/components/ui/priority-list.tsx`

Componente principal que integra tudo:

```typescript
<PriorityList
  pillar={pillar}
  actions={actions}
  onComplete={handleComplete}  // Chamado apenas ao clicar em "Concluir Pilar"
  isCompleted={isCompleted}
  className={className}
/>
```

## Funcionalidades

### ✅ Prioridades sem Números Iniciais
- As ações são listadas sem posições atribuídas inicialmente
- O usuário escolhe a posição ao clicar em "Priorizar"

### ✅ Seleção de Posição
- Grid de posições numeradas (1, 2, 3, ...)
- Posições ocupadas ficam bloqueadas (ícone de cadeado)
- Posição atual destacada com ícone de check

### ✅ Persistência em localStorage
- Prioridades são salvas automaticamente no localStorage durante a edição
- Chave única por pilar: `priorities_${pillarId}`
- Carregamento automático ao abrir o componente
- **Importante**: Só salva no Supabase quando clicar em "Concluir Pilar"

### ✅ Posições Bloqueadas
- Posições já ocupadas não podem ser selecionadas
- Feedback visual claro com ícone de cadeado
- Apenas a posição atual pode ser alterada

### ✅ Troca de Posições
- Clicar na posição atual remove a prioridade
- Selecionar nova posição atribui a prioridade
- Reorganização automática das posições

### ✅ Expansibilidade para N Prioridades
- Sistema dinâmico que se adapta ao número de ações
- Botão "Adicionar posição" para novas posições
- Sem limite fixo de prioridades

## Fluxo de Uso

1. **Lista de Ações**: Ações são exibidas sem posições
2. **Clicar em "Priorizar"**: Abre popover com grid de posições
3. **Selecionar Posição**: Clicar em uma posição disponível
4. **Feedback Visual**: Badge mostra posição selecionada
5. **Trocar Posição**: Clicar em "Priorizar" novamente
6. **Remover**: Clicar na posição atual ou botão X
7. **Salvar no localStorage**: Prioridades são salvas automaticamente
8. **Concluir Pilar**: Botão "Concluir Pilar" salva no Supabase e finaliza

## Estilização

### Cores e Feedback Visual
- **Posição Atual**: Verde com ícone de check
- **Posição Ocupada**: Cinza com ícone de cadeado
- **Posição Disponível**: Branco com hover verde
- **Ação Priorizada**: Badge colorido com posição

### Responsividade
- Design mobile-first
- Grid adaptativo de posições
- Popover responsivo
- Botões e textos escaláveis

## Integração com MissionConsole

O `MissionConsole` foi atualizado para usar o novo sistema:

```typescript
// Antes (Modal)
const {
  orderedItems: actionRanking,
  isModalOpen,
  // ... outros estados do modal
} = useSwapModalOrdering({ items: actions });

// Agora (Popover)
<PriorityList
  pillar={pillar}
  actions={actions}
  onComplete={handlePrioritiesComplete}
  isCompleted={isCompleted}
  className={className}
/>
```

## Vantagens do Popover vs Modal

### ✅ Popover
- **Menos intrusivo**: Não bloqueia toda a tela
- **Mais rápido**: Abertura/feche instantâneo
- **Melhor UX**: Mantém contexto visual
- **Mobile-friendly**: Melhor em telas pequenas

### ❌ Modal (anterior)
- **Intrusivo**: Bloqueia toda a interface
- **Mais lento**: Animações de entrada/saída
- **Perda de contexto**: Esconde o conteúdo principal
- **Problemas mobile**: Ocupa toda a tela

## Exemplo de Uso

```typescript
import { PriorityList } from '@/components/ui/priority-list';

const MyComponent = () => {
  const handleComplete = (priorities) => {
    console.log('Prioridades:', priorities);
    // Salvar no Supabase, etc.
  };

  return (
    <PriorityList
      pillar={pillar}
      actions={actions}
      onComplete={handleComplete}
      isCompleted={false}
    />
  );
};
```

## Estrutura de Dados

### PriorityItem
```typescript
interface PriorityItem {
  actionId: string;
  position: number;
  action: Action;
}
```

### localStorage
```json
{
  "priorities_pillar_123": [
    {
      "actionId": "action_1",
      "position": 1,
      "action": { /* Action object */ }
    },
    {
      "actionId": "action_2", 
      "position": 2,
      "action": { /* Action object */ }
    }
  ]
}
```

## Teste o Sistema

Execute o exemplo incluído:

```typescript
import { PriorityExample } from '@/components/examples/PriorityExample';

// Adicione à sua rota para testar
<Route path="/priority-example" element={<PriorityExample />} />
```

Este sistema oferece uma experiência de priorização mais intuitiva e eficiente, mantendo a flexibilidade para expansão futura. 