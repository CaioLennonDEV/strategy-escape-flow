# Sistema de Troca de Posições via Modal

## Visão Geral

Este sistema substitui o drag & drop por um modal intuitivo para trocar posições de itens. O usuário seleciona um item e escolhe a nova posição, com preview claro do que vai acontecer antes de confirmar.

## Características

### ✅ Funcionalidades
- [x] Modal intuitivo e responsivo
- [x] Preview da troca antes de confirmar
- [x] Aviso claro sobre como funciona a troca
- [x] Design integrado com o tema da aplicação
- [x] Botões grandes e touch-friendly
- [x] Validação automática (não permite selecionar posição atual)
- [x] Feedback visual em todas as etapas

### 🎨 Design Integrado
- **Cores**: Usa as cores da aplicação (unimed-primary, etc.)
- **Tipografia**: Fonte Poppins e hierarquia visual consistente
- **Espaçamento**: Padding e margins padronizados
- **Bordas**: Arredondamento consistente (rounded-xl, rounded-2xl)
- **Sombras**: Efeitos de profundidade sutis
- **Backdrop**: Blur e transparências para profundidade

### 📱 Responsividade
- **Desktop**: Modal centralizado com largura limitada
- **Mobile**: Ocupa quase toda a largura da tela
- **Grid adaptativo**: 4 colunas no desktop, 3 no tablet, 2 no mobile
- **Botões touch-friendly**: Altura mínima de 56px (h-14)

## Como Funciona

### 1. Hook `useSwapModalOrdering`

```typescript
const {
  orderedItems,
  isModalOpen,
  selectedItem,
  targetPosition,
  openSwapModal,
  closeModal,
  selectTargetPosition,
  confirmSwap,
  getItemPosition,
  totalItems
} = useSwapModalOrdering({
  items: actions,
  onReorder: (newItems) => {
    // Callback quando a ordem muda
  }
});
```

### 2. Componente `SwapPositionModal`

```tsx
<SwapPositionModal
  isOpen={isModalOpen}
  onClose={closeModal}
  selectedItem={selectedItem}
  targetPosition={targetPosition}
  onSelectPosition={selectTargetPosition}
  onConfirmSwap={confirmSwap}
  totalItems={totalItems}
  currentPositions={currentPositions}
/>
```

### 3. Botão de Troca

```tsx
<SwapButton
  onClick={() => openSwapModal(action)}
  disabled={isCompleted}
  size="md"
  variant="outline"
/>
```

## Fluxo de Uso

### 1. **Seleção do Item**
- Usuário clica no botão de troca (ícone de setas)
- Modal abre mostrando o item selecionado
- Aviso explica como funciona a troca

### 2. **Seleção da Posição**
- Grid de botões numerados (1º, 2º, 3º, etc.)
- Posição atual desabilitada e visualmente diferenciada
- Hover e feedback visual ao selecionar

### 3. **Preview da Troca**
- Mostra claramente o que vai acontecer
- "Item X (atual) ↔ Item Y (novo)"
- Confirmação visual antes de prosseguir

### 4. **Confirmação**
- Botão "Cancelar" discreto
- Botão "Confirmar" em destaque
- Troca é executada e modal fecha

## Vantagens sobre Drag & Drop

### ✅ Prós
- **Simplicidade**: Interface mais clara e intuitiva
- **Mobile-friendly**: Funciona perfeitamente em dispositivos touch
- **Preview**: Usuário vê exatamente o que vai acontecer
- **Validação**: Prevenção automática de erros
- **Acessibilidade**: Suporte completo a teclado
- **Performance**: Menos complexidade de eventos

### ❌ Contras
- **Mais cliques**: Requer mais interações
- **Menos visual**: Não há feedback visual de movimento
- **Menos intuitivo**: Alguns usuários podem preferir drag & drop

## Implementação

### 1. Hook Personalizado

O hook `useSwapModalOrdering` gerencia:
- Estado do modal (aberto/fechado)
- Item selecionado para troca
- Posição de destino
- Lógica de troca de posições
- Callbacks para mudanças

### 2. Componente Modal

O `SwapPositionModal` oferece:
- Header com ícone e título
- Aviso importante sobre a funcionalidade
- Visualização do item selecionado
- Grid de botões para seleção de posição
- Preview da troca
- Botões de ação

### 3. Botão de Troca

O `SwapButton` é:
- Touch-friendly
- Visualmente integrado
- Com feedback de hover e active
- Responsivo

## Estilos CSS

### Classes Principais

```css
/* Modal principal */
.escape-run-card {
  /* Usa o mesmo estilo dos cards da aplicação */
}

/* Conteúdo do modal */
.swap-modal-content {
  max-height: 90vh;
  overflow-y: auto;
}

/* Grid de posições */
.swap-modal-grid {
  display: grid;
  gap: 0.75rem;
}

/* Responsividade */
@media (max-width: 640px) {
  .swap-modal-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .swap-modal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Integração

Para usar em qualquer lista:

```tsx
import { useSwapModalOrdering } from '@/hooks/use-swap-modal-ordering';
import { SwapPositionModal } from '@/components/ui/swap-position-modal';
import { SwapButton } from '@/components/ui/swap-button';

// No componente
const { orderedItems, isModalOpen, selectedItem, targetPosition, openSwapModal, closeModal, selectTargetPosition, confirmSwap, getItemPosition, totalItems } = useSwapModalOrdering({
  items: yourItems
});

// No JSX
{orderedItems.map((item) => (
  <div key={item.id}>
    {/* Conteúdo do item */}
    <SwapButton onClick={() => openSwapModal(item)} />
  </div>
))}

// Modal no final do componente
<SwapPositionModal
  isOpen={isModalOpen}
  onClose={closeModal}
  selectedItem={selectedItem}
  targetPosition={targetPosition}
  onSelectPosition={selectTargetPosition}
  onConfirmSwap={confirmSwap}
  totalItems={totalItems}
  currentPositions={currentPositions}
/>
```

## Exemplo de Uso

Veja os arquivos:
- `MissionConsole.tsx` - Implementação principal
- `use-swap-modal-ordering.tsx` - Hook personalizado
- `swap-position-modal.tsx` - Componente modal
- `swap-button.tsx` - Componente botão

## Migração

Para migrar de outros sistemas:

1. Remover imports de drag & drop ou botões antigos
2. Adicionar imports do novo sistema
3. Substituir estado por `useSwapModalOrdering`
4. Atualizar JSX para usar `SwapButton`
5. Adicionar `SwapPositionModal` no final do componente
6. Remover eventos antigos
7. Atualizar estilos CSS se necessário

## Troubleshooting

### Problema: Modal não abre
**Solução**: Verifique se `openSwapModal` está sendo chamado corretamente.

### Problema: Troca não funciona
**Solução**: Verifique se `onReorder` callback está definido.

### Problema: Grid não responsivo
**Solução**: Certifique-se de que as classes CSS estão aplicadas.

### Problema: Botões muito pequenos no mobile
**Solução**: Verifique se `size="md"` está definido no `SwapButton`. 