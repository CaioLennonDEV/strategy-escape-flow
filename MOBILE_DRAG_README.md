# Drag & Drop para Dispositivos Móveis

## Problema Resolvido

O drag & drop nativo do HTML5 não funciona bem em dispositivos móveis. Esta implementação resolve esse problema criando uma experiência híbrida que funciona tanto em desktop quanto em mobile.

## Como Funciona

### Desktop (Mouse)
- Usa a API nativa de drag & drop do HTML5
- Funciona com `onDragStart`, `onDragOver`, `onDrop`
- Experiência tradicional de arrastar e soltar

### Mobile (Touch)
- Usa eventos de touch (`onTouchStart`, `onTouchMove`, `onTouchEnd`)
- Implementa long press (400ms) para iniciar o drag
- Feedback háptico quando disponível
- Previne scroll durante o drag

## Componentes Criados

### 1. Hook `useMobileDrag`

```typescript
const {
  isDragging,
  draggedIndex,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseUp
} = useMobileDrag({
  onDragStart: (index) => console.log('Drag started:', index),
  onDragEnd: (fromIndex, toIndex) => reorderItems(fromIndex, toIndex),
  longPressDelay: 400, // ms
  minSwipeDistance: 20 // px
});
```

### 2. CSS Classes

- `.dragging`: Estilo aplicado ao item sendo arrastado
- `.no-select`: Previne seleção de texto
- `.touch-feedback`: Feedback visual ao tocar
- `.mobile-drag-item`: Otimizações para mobile
- `.mobile-drag-container`: Container com scroll otimizado

## Como Usar

### 1. Importe o hook

```typescript
import { useMobileDrag } from '@/hooks/use-mobile-drag';
import { useIsMobile } from '@/hooks/use-mobile';
```

### 2. Configure os handlers

```typescript
const handleDragEnd = useCallback((fromIndex: number, toIndex: number) => {
  const newItems = [...items];
  const draggedItem = newItems[fromIndex];
  newItems.splice(fromIndex, 1);
  newItems.splice(toIndex, 0, draggedItem);
  setItems(newItems);
}, [items]);

const {
  isDragging,
  draggedIndex,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseUp
} = useMobileDrag({
  onDragEnd: handleDragEnd,
  longPressDelay: 400,
  minSwipeDistance: 20
});
```

### 3. Aplique os eventos no JSX

```tsx
<div 
  className={`item ${isDragging && draggedIndex === index ? 'dragging' : ''} ${
    isMobile ? 'mobile-drag-item' : 'cursor-move'
  }`}
  onTouchStart={(e) => handleTouchStart(e, index)}
  onTouchMove={handleTouchMove}
  onTouchEnd={(e) => handleTouchEnd(e, index)}
  onMouseDown={() => handleMouseDown(index)}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}
>
  {/* Conteúdo do item */}
</div>
```

## Características

### ✅ Funcionalidades
- [x] Long press para iniciar drag (400ms)
- [x] Feedback háptico
- [x] Prevenção de scroll durante drag
- [x] Animações suaves
- [x] Detecção automática de dispositivo
- [x] Fallback para desktop
- [x] Prevenção de seleção de texto

### 📱 Otimizações Mobile
- `touch-action: pan-y` para permitir scroll vertical
- `-webkit-overflow-scrolling: touch` para scroll suave
- `overscroll-behavior: contain` para evitar bounce
- `-webkit-tap-highlight-color: transparent` para remover highlight

### 🎨 Feedback Visual
- Escala e rotação do item sendo arrastado
- Sombra elevada
- Animação de pulse no ícone
- Bordas destacadas
- Z-index elevado

## Exemplo de Uso Completo

Veja o arquivo `MobileDragTest.tsx` para um exemplo completo de implementação.

## Troubleshooting

### Problema: Não funciona no iOS
**Solução**: Certifique-se de que está usando `touch-action: pan-y` e `-webkit-overflow-scrolling: touch`.

### Problema: Scroll interfere com drag
**Solução**: Use `overscroll-behavior: contain` no container.

### Problema: Texto é selecionado durante drag
**Solução**: Use a classe `.no-select` ou `user-select: none`.

### Problema: Long press não funciona
**Solução**: Verifique se o `longPressDelay` não está muito baixo (recomendado: 400ms).

## Performance

- Usa `useCallback` para evitar re-renders desnecessários
- Debounce no long press timer
- Cleanup automático de event listeners
- Otimizações CSS para GPU

## Compatibilidade

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Desktop Chrome/Firefox/Safari
- ✅ Edge
- ⚠️ IE11 (não suportado) 