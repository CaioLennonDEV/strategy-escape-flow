// Array de cores vibrantes e distintas
const uniqueColors = [
  '#FF6B6B', // Vermelho coral
  '#4ECDC4', // Turquesa
  '#45B7D1', // Azul claro
  '#96CEB4', // Verde menta
  '#FFEAA7', // Amarelo claro
  '#DDA0DD', // Lavanda
  '#98D8C8', // Verde água
  '#F7DC6F', // Amarelo dourado
  '#BB8FCE', // Roxo claro
  '#85C1E9', // Azul céu
  '#F8C471', // Laranja claro
  '#82E0AA', // Verde lima
  '#F1948A', // Rosa salmão
  '#85C1E9', // Azul claro
  '#D7BDE2', // Lilás
  '#A9DFBF', // Verde claro
  '#FAD7A0', // Pêssego
  '#AED6F1', // Azul bebê
  '#F9E79F', // Amarelo creme
  '#D5A6BD', // Rosa pálido
];

// Mapeamento de cores específicas para os pilares
const pillarColors = {
  'Financeiro': '#009954', // Verde principal Unimed
  'Mercado e Clientes': '#b1d34b', // Verde claro Unimed
  'Processos Internos': '#004e4c', // Verde escuro Unimed
  'Aprendizado e Crescimento': '#f47920', // Laranja Unimed
};

// Função para obter cor padronizada do pilar baseada no nome
export const getPillarColor = (pillarName: string): string => {
  // Verificar se o nome exato existe
  let color = pillarColors[pillarName as keyof typeof pillarColors];
  
  // Se não encontrar, tentar encontrar por similaridade
  if (!color) {
    const normalizedName = pillarName.toLowerCase().trim();
    for (const [key, value] of Object.entries(pillarColors)) {
      if (key.toLowerCase().trim() === normalizedName) {
        color = value;
        break;
      }
    }
  }
  

  return color || '#009954';
};

// Função para gerar uma cor única baseada no ID
export const getItemColor = (itemId: string): string => {
  // Usar o hash do ID para gerar um índice consistente
  let hash = 0;
  for (let i = 0; i < itemId.length; i++) {
    const char = itemId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Usar o valor absoluto do hash para garantir índice positivo
  const index = Math.abs(hash) % uniqueColors.length;
  return uniqueColors[index];
};

// Função para gerar gradiente baseado na cor
export const getItemGradient = (color: string): string => {
  return `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`;
};

// Função para gerar cor de borda baseada na cor principal
export const getItemBorderColor = (color: string): string => {
  return `${color}40`;
}; 