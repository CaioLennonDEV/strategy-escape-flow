# Sistema de Ordenação Numérica

## Visão Geral

Este sistema substitui o drag & drop por uma ordenação simples e intuitiva via números, funcionando perfeitamente tanto em desktop quanto em mobile.

## Características

### ✅ Funcionalidades
- [x] Inputs numéricos para cada item
- [x] Botões de incremento/decremento
- [x] Validação automática de posições
- [x] Reordenação automática da lista
- [x] Prevenção de números duplicados
- [x] Responsivo para mobile e desktop
- [x] Suporte a teclado (setas ↑↓)

### 📱 Otimizações Mobile
- Inputs touch-friendly
- Botões com tamanho adequado para toque
- Layout responsivo que se adapta ao tamanho da tela
- Feedback visual claro

### 🎨 Design
- Interface limpa e intuitiva
- Ícones de hash (#) para indicar posição
- Cores consistentes com o tema da aplicação
- Animações suaves

## Como Funciona

### 1. Hook `useNumberOrdering`

```typescript
const {
  orderedItems,
  updatePosition,
  getPosition,
  totalItems
} = useNumberOrdering({
  items: actions,
  onReorder: (newItems) => {
    // Callback quando a ordem muda
  }
});
```

### 2. Componente `PositionInput`

```tsx
<PositionInput
  value={getPosition(action.id)}
  onChange={(newPosition) => updatePosition(action.id, newPosition)}
  max={totalItems}
  disabled={isCompleted}
/>
```

### 3. Lógica de Reordenação

- Quando um item muda de posição, todos os outros itens se ajustam automaticamente
- Não há posições duplicadas
- A ordem sempre vai de 1 até N (total de itens)
- Validação automática de valores

## Vantagens sobre Drag & Drop

### ✅ Prós
- **Simplicidade**: Interface mais clara e intuitiva
- **Mobile-friendly**: Funciona perfeitamente em dispositivos touch
- **Acessibilidade**: Suporte completo a teclado
- **Performance**: Menos complexidade de eventos
- **Validação**: Prevenção automática de erros
- **Feedback**: Usuário vê exatamente qual posição está definindo

### ❌ Contras
- **Menos intuitivo**: Alguns usuários podem preferir drag & drop
- **Mais cliques**: Requer mais interações para grandes mudanças
- **Menos visual**: Não há feedback visual de movimento

## Implementação

### 1. Hook Personalizado

O hook `useNumberOrdering` gerencia:
- Estado das posições de cada item
- Lógica de reordenação automática
- Validação de valores
- Callbacks para mudanças

### 2. Componente de Input

O `PositionInput` oferece:
- Input numérico centralizado
- Botões de incremento/decremento
- Suporte a teclado
- Estilos responsivos

### 3. Integração

Para usar em qualquer lista:

```tsx
import { useNumberOrdering } from '@/hooks/use-number-ordering';
import { PositionInput } from '@/components/ui/position-input';

// No componente
const { orderedItems, updatePosition, getPosition, totalItems } = useNumberOrdering({
  items: yourItems
});

// No JSX
{orderedItems.map((item) => (
  <div key={item.id}>
    {/* Conteúdo do item */}
    <PositionInput
      value={getPosition(item.id)}
      onChange={(pos) => updatePosition(item.id, pos)}
      max={totalItems}
    />
  </div>
))}
```

## Estilos CSS

Os estilos estão definidos em `App.css`:

```css
.position-input-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Remove setas dos inputs numéricos */
.position-input-container input[type="number"]::-webkit-outer-spin-button,
.position-input-container input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
```

## Exemplo de Uso

Veja os arquivos:
- `MissionConsole.tsx` - Implementação principal
- `MobileDragTest.tsx` - Exemplo de teste
- `use-number-ordering.tsx` - Hook personalizado
- `position-input.tsx` - Componente de input

## Migração

Para migrar de drag & drop:

1. Remover imports de drag & drop
2. Adicionar imports do novo sistema
3. Substituir estado de drag por `useNumberOrdering`
4. Atualizar JSX para usar `PositionInput`
5. Remover eventos de drag & drop
6. Atualizar estilos CSS se necessário

## Troubleshooting

### Problema: Posições não atualizam
**Solução**: Verifique se o `idField` está correto no hook.

### Problema: Input não funciona no mobile
**Solução**: Certifique-se de que os estilos CSS estão aplicados.

### Problema: Valores inválidos
**Solução**: O hook já valida automaticamente, mas verifique se `min` e `max` estão corretos. 