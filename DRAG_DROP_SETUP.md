# Configuração do Sistema de Drag & Drop

## Dependências Necessárias

Para que o sistema de drag & drop funcione corretamente no `MissionConsole.tsx`, você precisa instalar as seguintes dependências:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Ou se estiver usando yarn:

```bash
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Bibliotecas Instaladas

- **@dnd-kit/core**: Biblioteca principal para drag & drop
- **@dnd-kit/sortable**: Funcionalidades de ordenação
- **@dnd-kit/utilities**: Utilitários para transformações CSS

## Funcionalidades Implementadas

O sistema de drag & drop no `MissionConsole.tsx` inclui:

1. **Área de Destino (Superior)**:
   - Área em branco onde o usuário arrasta as prioridades
   - Numeração automática dos itens (1, 2, 3...)
   - Reordenação por drag & drop
   - Botão de remoção para cada item

2. **Área de Origem (Inferior)**:
   - Lista de prioridades disponíveis
   - Itens saem da lista ao serem arrastados para o destino
   - Itens retornam quando removidos do destino

3. **Recursos Técnicos**:
   - Feedback visual durante o arrasto
   - Estados gerenciados localmente
   - Componentes reutilizáveis
   - Integração com Supabase para salvar prioridades

## Como Usar

Após instalar as dependências, o componente estará pronto para uso. O sistema:

- Detecta automaticamente quando todos os itens foram priorizados
- Permite reordenação dentro da área de destino
- Salva as prioridades no banco de dados ao concluir
- Fornece feedback visual e toast notifications

## Estrutura dos Componentes

- `SortableDraggableItem`: Item arrastável com funcionalidade de ordenação
- `DraggableItem`: Item para overlay durante o arrasto
- `DestinationArea`: Área de destino com numeração
- `SourceArea`: Área de origem com itens disponíveis
- `MissionConsole`: Componente principal que orquestra tudo 