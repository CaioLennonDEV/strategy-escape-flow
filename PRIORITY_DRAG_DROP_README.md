# Sistema de Priorização com Drag & Drop

## Visão Geral

O sistema de priorização implementado no `MissionConsole.tsx` permite aos usuários organizar ações em ordem de prioridade usando drag & drop intuitivo. O sistema utiliza a biblioteca `@dnd-kit` para uma experiência de usuário fluida e responsiva.

## Funcionalidades Principais

### 1. Áreas de Trabalho

#### Área Superior (Prioridades Definidas)
- **Função**: Exibe as ações já priorizadas
- **Funcionalidades**:
  - Numeração automática (1, 2, 3...)
  - Reordenação por drag & drop
  - Remoção de itens (retorna para área inferior)
  - Modo read-only quando congelado

#### Área Inferior (Prioridades Disponíveis)
- **Função**: Lista ações ainda não priorizadas
- **Funcionalidades**:
  - Adição de itens via drag & drop
  - Reordenação interna
  - Feedback visual quando vazia

### 2. Sistema de Estado

#### Hook Personalizado: `usePriorityManagement`
- **Localização**: `src/hooks/use-priority-management.tsx`
- **Funcionalidades**:
  - Persistência no localStorage
  - Gerenciamento de estado centralizado
  - Funções para mover e reordenar itens
  - Controle de congelamento

#### Estados Principais
```typescript
interface PriorityState {
  destinationItems: DraggableAction[]; // Itens priorizados
  sourceItems: DraggableAction[];      // Itens disponíveis
  isFrozen: boolean;                   // Estado de congelamento
}
```

### 3. Drag & Drop

#### Tecnologias Utilizadas
- **@dnd-kit/core**: Funcionalidades básicas de drag & drop
- **@dnd-kit/sortable**: Reordenação de listas
- **@dnd-kit/utilities**: Utilitários CSS

#### Funcionalidades
- **Ativação**: Distância mínima de 8px para iniciar drag
- **Feedback Visual**: 
  - Opacidade reduzida durante drag
  - Escala aumentada no overlay
  - Sombras dinâmicas
- **Colisão**: Detecção por cantos mais próximos
- **Reordenação**: Suporte a arrayMove para animações suaves

### 4. Sistema de Ordenação Numérica

#### Funcionalidades de Ordenação
- **Numeração Automática**: Posições 1, 2, 3... baseadas na ordem atual
- **Edição Manual**: Clique no número para definir posição específica
- **Controles de Ordenação**:
  - **Numeração (1, 2, 3...)**: Reorganiza sequencialmente
  - **Inverter Ordem**: Inverte a ordem atual
  - **Ordem Alfabética**: Ordena por título
  - **Resetar Ordem**: Volta ao estado inicial

#### Componentes de Ordenação
- **NumberInput**: Entrada numérica com validação
- **OrderControls**: Menu dropdown com opções de ordenação
- **Validação**: Números entre 1 e total de itens
- **Feedback**: Confirmação visual de mudanças

### 5. Congelamento de Prioridades

#### Processo
1. Usuário organiza todas as ações
2. Clica em "Concluir Priorização"
3. Sistema salva no Supabase
4. Interface congela (modo read-only)
5. Estado persiste no localStorage

#### Benefícios
- Previne modificações acidentais
- Mantém histórico de decisões
- Melhora experiência do usuário

## Estrutura de Arquivos

```
src/
├── components/
│   ├── MissionConsole.tsx          # Componente principal
│   ├── examples/
│   │   └── PrioritySystemExample.tsx # Exemplo de uso
│   └── ui/
│       ├── number-input.tsx        # Entrada numérica
│       └── order-controls.tsx      # Controles de ordenação
├── hooks/
│   └── use-priority-management.tsx # Hook de gerenciamento
└── lib/
    └── types.ts                    # Tipos TypeScript
```

## Componentes Principais

### SortableItem
- Item arrastável individual
- Suporte a numeração editável
- Feedback visual durante drag
- Botão de remoção (quando aplicável)
- Entrada numérica para posição específica

### NumberInput
- Entrada numérica com validação
- Suporte a teclado (Enter/Escape)
- Validação de limites (1 a maxValue)
- Feedback visual de estado

### OrderControls
- Menu dropdown com opções de ordenação
- Controles para diferentes tipos de ordenação
- Indicador de estado (ativo/congelado)
- Interface intuitiva

### DestinationArea
- Área de destino para prioridades
- Contexto de drag & drop interno
- Indicadores visuais de estado

### SourceArea
- Área de origem para ações disponíveis
- Contexto de drag & drop interno
- Mensagem quando vazia

## Persistência de Dados

### localStorage
- Chave: `priority_state_${pillarId}`
- Estrutura: JSON com estado completo
- Recuperação automática ao recarregar

### Supabase
- Tabela: `user_priorities`
- Campos: `session_id`, `action_id`, `rank`
- Limpeza automática de rankings anteriores

## Responsividade

### Mobile-First
- Touch-friendly com PointerSensor
- Distância mínima para evitar ativação acidental
- Feedback visual otimizado para touch

### Desktop
- Suporte completo a mouse
- Hover states e transições suaves
- Cursor adaptativo (grab/grabbing)

## Acessibilidade

### ARIA
- Atributos de drag & drop automáticos
- Labels descritivos para áreas
- Feedback de estado para leitores de tela

### Navegação
- Suporte a teclado (via @dnd-kit)
- Foco visual claro
- Contraste adequado

## Performance

### Otimizações
- useCallback para funções de drag
- useMemo para item ativo
- Re-renderização mínima
- Debounce em operações de localStorage

### Memória
- Limpeza automática de listeners
- Estado localizado por pilar
- Garbage collection otimizado

## Extensibilidade

### Novos Recursos
- Fácil adição de novas áreas de drop
- Suporte a diferentes tipos de itens
- Configuração flexível de sensores

### Customização
- Estilos via Tailwind CSS
- Temas dinâmicos
- Animações personalizáveis

## Troubleshooting

### Problemas Comuns
1. **Drag não funciona**: Verificar se isFrozen é false
2. **Estado não persiste**: Verificar localStorage disponível
3. **Performance lenta**: Verificar número de itens

### Debug
- Console logs em operações críticas
- Estado visível no React DevTools
- localStorage inspecionável

## Próximos Passos

### Melhorias Sugeridas
- [ ] Animações de entrada/saída
- [ ] Undo/Redo functionality
- [ ] Exportação de prioridades
- [ ] Comparação entre sessões
- [ ] Analytics de uso

### Integrações
- [ ] Notificações push
- [ ] Sincronização em tempo real
- [ ] Backup automático
- [ ] Compartilhamento de prioridades 