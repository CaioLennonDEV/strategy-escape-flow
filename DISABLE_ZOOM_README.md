# Funcionalidade de Desabilitar Zoom

## Visão Geral

Esta funcionalidade impede que o usuário aplique zoom na página através de qualquer método disponível, garantindo uma experiência de usuário consistente e controlada.

## Implementação

### 1. Função Utilitária (`src/lib/disable-zoom.ts`)

A função `disablePageZoom()` implementa múltiplas camadas de proteção:

- **Teclado**: Bloqueia `CTRL + "+"`, `CTRL + "-"`, `CTRL + "="`
- **Mouse**: Bloqueia `CTRL + Scroll` (mousewheel)
- **Touch**: Bloqueia pinch zoom em dispositivos móveis
- **Meta Tag**: Atualiza a viewport meta tag para `user-scalable=no`

### 2. Hook React (`src/hooks/use-disable-zoom.tsx`)

O hook `useDisableZoom()` encapsula a lógica seguindo as regras do projeto:

- Desabilita zoom automaticamente quando montado
- Fornece funções para controlar o estado
- Implementa cleanup automático

### 3. Integração

- **main.tsx**: Chama a função imediatamente para garantir proteção desde o carregamento
- **App.tsx**: Usa o hook para manter a funcionalidade durante toda a aplicação
- **index.html**: Meta tag viewport configurada para desabilitar zoom

## Funcionalidades

### ✅ Bloqueios Implementados

- [x] `CTRL + Scroll` (mousewheel zoom)
- [x] `CTRL + "+"` (zoom in)
- [x] `CTRL + "-"` (zoom out)
- [x] `CTRL + "="` (zoom in alternativo)
- [x] Pinch zoom em dispositivos móveis
- [x] Meta tag viewport com `user-scalable=no`

### 🔧 Controles Disponíveis

```typescript
const { disableZoom, enableZoom, isZoomDisabled } = useDisableZoom();
```

- `disableZoom()`: Força a desabilitação do zoom
- `enableZoom()`: Reabilita o zoom (cleanup)
- `isZoomDisabled`: Estado atual (sempre `true` quando ativo)

## Compatibilidade

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile, Samsung Internet)
- ✅ Tablets (iPad, Android tablets)

## Considerações de Acessibilidade

⚠️ **Importante**: Esta funcionalidade pode impactar usuários que dependem do zoom para acessibilidade. Considere:

1. Implementar um toggle para habilitar/desabilitar o zoom
2. Fornecer alternativas de acessibilidade (font-size controls, etc.)
3. Testar com leitores de tela e outras tecnologias assistivas

## Uso

A funcionalidade é ativada automaticamente quando a aplicação carrega. Para usar manualmente:

```typescript
import { useDisableZoom } from './hooks/use-disable-zoom';

function MyComponent() {
  const { disableZoom, enableZoom } = useDisableZoom();
  
  // Zoom já está desabilitado automaticamente
  // Use enableZoom() apenas se precisar reabilitar temporariamente
}
```

## Manutenção

- A função de cleanup está disponível globalmente como `window.disableZoomCleanup`
- Todos os event listeners são removidos automaticamente quando o componente é desmontado
- A meta tag viewport é atualizada dinamicamente para garantir compatibilidade 