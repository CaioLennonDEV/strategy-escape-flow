# Priority Drag and Drop Component

Este é um componente simplificado de drag and drop focado especificamente na reordenação de prioridades, integrado ao sistema de prioridades do projeto.

## Características

- ✅ **React 18 + TypeScript**: Código moderno e tipado
- ✅ **Hooks personalizados**: Lógica reutilizável encapsulada
- ✅ **Tailwind CSS**: Estilos modernos e responsivos
- ✅ **Desktop + Mobile**: Suporte completo a mouse e touch
- ✅ **Animações**: Feedback visual suave e responsivo
- ✅ **Shadcn UI**: Componentes de interface consistentes
- ✅ **Acessibilidade**: Suporte a teclado e screen readers

## Componentes

### `PriorityDragDrop`
Componente principal que renderiza a lista de prioridades arrastável.

**Props:**
- `priorities: Action[]` - Lista de prioridades para reordenar
- `onReorder: (newOrder: Action[]) => void` - Callback quando a ordem muda
- `className?: string` - Classes CSS adicionais

### `usePriorityDragDrop`
Hook personalizado que gerencia a lógica de prioridades com drag and drop.

**Retorna:**
- `priorities` - Lista atual de prioridades
- `hasPriorities` - Se há prioridades definidas
- `prioritiesCount` - Número de prioridades
- `reorderPriorities` - Função para reordenar
- `setInitialPriorities` - Definir todas as ações como prioridades
- `clearPriorities` - Limpar todas as prioridades

## Funcionalidades

### Desktop (Mouse)
- Arrastar e soltar com mouse
- Feedback visual durante o arrasto
- Animações suaves de transição

### Mobile (Touch)
- Arrastar e soltar com toque
- Detecção de movimento mínimo (10px)
- Prevenção de scroll durante arrasto

### Gerenciamento de Prioridades
- Definir todas as ações como prioridades
- Limpar todas as prioridades
- Persistência no localStorage

### Reordenação
- Arrastar e soltar para reordenar
- Numeração automática (1, 2, 3...)
- Animações de escala e opacidade
- Feedback visual de hover e drag over

## Uso

```tsx
import { PriorityDragDrop } from './components/PriorityDragDrop';
import { usePriorityDragDrop } from './hooks/use-priority-drag-drop';

function App() {
  const {
    priorities,
    hasPriorities,
    reorderPriorities,
    setInitialPriorities,
    clearPriorities
  } = usePriorityDragDrop({
    actions: actions,
    pillarId: 'pillar-1',
    onPrioritiesChange: (newPriorities) => {
      console.log('Prioridades atualizadas:', newPriorities);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {hasPriorities ? (
        <PriorityDragDrop
          priorities={priorities}
          onReorder={reorderPriorities}
        />
      ) : (
        <button onClick={setInitialPriorities}>
          Definir Prioridades
        </button>
      )}
    </div>
  );
}
```

## Rota de Exemplo

Acesse `/priority-drag-drop-example` para ver o componente em ação.

## Melhorias sobre o Original

1. **Arquitetura**: Componentes React organizados
2. **Estado**: Gerenciamento com hooks
3. **Estilos**: Tailwind CSS moderno
4. **Mobile**: Suporte completo a touch
5. **Tipagem**: TypeScript para segurança
6. **Acessibilidade**: Melhor suporte a acessibilidade
7. **Performance**: Otimizações com useCallback
8. **UX**: Feedback visual aprimorado

## Estrutura de Arquivos

```
src/
├── components/
│   ├── PriorityDragDrop.tsx         # Componente principal
│   └── examples/
│       └── PriorityDragDropExample.tsx # Exemplo de uso
└── hooks/
    └── use-priority-drag-drop.tsx   # Hook personalizado
```

## Tecnologias Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide React (ícones)
- React Router (navegação) 