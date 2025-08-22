# Sistema de Ordenação com Botões

## Visão Geral

Este sistema substitui o drag & drop por botões simples e intuitivos para reorganizar itens. Cada item tem botões para mover para cima (↑) e para baixo (↓), funcionando perfeitamente tanto em desktop quanto em mobile.

## Características

### ✅ Funcionalidades
- [x] Botões de mover para cima e baixo
- [x] Validação automática (primeiro item não pode subir, último não pode descer)
- [x] Feedback visual com animações
- [x] Responsivo para mobile e desktop
- [x] Touch-friendly
- [x] Ícones claros e intuitivos

### 📱 Otimizações Mobile
- Botões com tamanho adequado para toque (36px)
- Espaçamento generoso para evitar cliques acidentais
- Feedback háptico quando disponível
- Animações suaves

### 🎨 Design
- Interface limpa e minimalista
- Ícones de setas (↑ ↓) claros
- Badge mostrando a posição atual
- Animações de feedback visual
- Cores consistentes com o tema

## Como Funciona

### 1. Hook `useQuickOrdering`

```typescript
const {
  orderedItems,
  moveItem,
  canMoveUp,
  canMoveDown,
  getItemPosition
} = useQuickOrdering({
  items: actions,
  onReorder: (newItems) => {
    // Callback quando a ordem muda
  },
  onItemMove: (itemId) => {
    // Callback quando um item é movido (para animação)
  }
});
```

### 2. Componente `QuickActions`

```tsx
<QuickActions
  onMoveUp={() => moveItem(action.id, 'up')}
  onMoveDown={() => moveItem(action.id, 'down')}
  canMoveUp={canMoveUp(action.id)}
  canMoveDown={canMoveDown(action.id)}
  disabled={isCompleted}
/>
```

### 3. Animação de Feedback

```tsx
const { triggerAnimation, isAnimating } = useReorderAnimation();

// No JSX
<div className={`item ${isAnimating(item.id) ? 'item-reordering' : ''}`}>
  {/* Conteúdo do item */}
</div>
```

## Vantagens sobre Drag & Drop

### ✅ Prós
- **Simplicidade**: Interface mais clara e intuitiva
- **Mobile-friendly**: Funciona perfeitamente em dispositivos touch
- **Acessibilidade**: Suporte completo a teclado
- **Performance**: Menos complexidade de eventos
- **Feedback**: Usuário vê exatamente o que acontece
- **Validação**: Prevenção automática de ações inválidas

### ❌ Contras
- **Mais cliques**: Para grandes mudanças, requer mais interações
- **Menos visual**: Não há feedback visual de movimento contínuo

## Implementação

### 1. Hook Principal

O hook `useQuickOrdering` gerencia:
- Estado dos itens ordenados
- Lógica de movimentação
- Validação de movimentos possíveis
- Callbacks para mudanças

### 2. Componente de Botões

O `QuickActions` oferece:
- Dois botões com ícones claros
- Validação automática (desabilita quando não pode mover)
- Estilos responsivos
- Feedback visual

### 3. Animação

O `useReorderAnimation` adiciona:
- Animação de pulse quando item é movido
- Feedback visual imediato
- Duração controlada (300ms)

## Estilos CSS

Os estilos estão definidos em `App.css`:

```css
.quick-actions-button {
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.quick-actions-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-reordering {
  animation: reorderPulse 0.3s ease-in-out;
}
```

## Exemplo de Uso Completo

```tsx
import { useQuickOrdering } from '@/hooks/use-quick-ordering';
import { useReorderAnimation } from '@/hooks/use-reorder-animation';
import { QuickActions } from '@/components/ui/quick-actions';

const MyComponent = () => {
  const { triggerAnimation, isAnimating } = useReorderAnimation();
  
  const {
    orderedItems,
    moveItem,
    canMoveUp,
    canMoveDown,
    getItemPosition
  } = useQuickOrdering({
    items: myItems,
    onItemMove: triggerAnimation
  });

  return (
    <div>
      {orderedItems.map((item) => (
        <div 
          key={item.id}
          className={`item ${isAnimating(item.id) ? 'item-reordering' : ''}`}
        >
          <div className="content">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          
          <div className="actions">
            <Badge>{getItemPosition(item.id)}º</Badge>
            <QuickActions
              onMoveUp={() => moveItem(item.id, 'up')}
              onMoveDown={() => moveItem(item.id, 'down')}
              canMoveUp={canMoveUp(item.id)}
              canMoveDown={canMoveDown(item.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Responsividade

### Desktop
- Botões com hover effects
- Animações suaves
- Layout otimizado para mouse

### Mobile
- Botões maiores (36px)
- Espaçamento generoso
- Touch-friendly
- Feedback visual claro

## Troubleshooting

### Problema: Botões não respondem
**Solução**: Verifique se o `idField` está correto no hook.

### Problema: Animação não funciona
**Solução**: Certifique-se de que o `onItemMove` está sendo passado.

### Problema: Botões muito pequenos no mobile
**Solução**: Os estilos CSS já incluem otimizações mobile, mas você pode ajustar o tamanho se necessário.

## Migração

Para migrar de drag & drop:

1. Remover imports de drag & drop
2. Adicionar imports do novo sistema
3. Substituir estado de drag por `useQuickOrdering`
4. Adicionar `useReorderAnimation` para feedback visual
5. Atualizar JSX para usar `QuickActions`
6. Remover eventos de drag & drop
7. Atualizar estilos CSS se necessário 