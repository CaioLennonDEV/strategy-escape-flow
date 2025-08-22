
import type { PointsAllocation, ConfessionalAnswers } from './types';

// Formatadores para serialização de dados JSON

export const formatPointsAnswer = (points: number): string => {
  return JSON.stringify({ points });
};

export const parsePointsAnswer = (answer: string): number => {
  try {
    const parsed = JSON.parse(answer);
    return parsed.points || 0;
  } catch {
    return 0;
  }
};

export const formatConfessionalAnswer = (answers: ConfessionalAnswers): string => {
  return JSON.stringify({
    q1: answers.q1,
    q2: answers.q2,
    timestamp: new Date().toISOString()
  });
};

export const parseConfessionalAnswer = (answer: string): ConfessionalAnswers | null => {
  try {
    const parsed = JSON.parse(answer);
    return {
      q1: parsed.q1 || '',
      q2: parsed.q2 || ''
    };
  } catch {
    return null;
  }
};

export const formatSessionCode = (code: string): string => {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

export const formatNickname = (nickname: string): string => {
  return nickname.trim().substring(0, 30);
};

// Helpers para pontuação
export const calculateTotalPoints = (allocation: PointsAllocation): number => {
  return Object.values(allocation).reduce((sum, points) => sum + points, 0);
};

export const validatePointsAllocation = (
  allocation: PointsAllocation, 
  maxPoints: number = 10
): boolean => {
  return calculateTotalPoints(allocation) <= maxPoints;
};

// Formatadores para display
export const formatRank = (rank: number): string => {
  const suffix = rank === 1 ? 'º' : rank === 2 ? 'º' : rank === 3 ? 'º' : 'º';
  return `${rank}${suffix}`;
};

export const formatProgress = (completed: number, total: number): string => {
  return `${completed}/${total}`;
};

export const formatMissionStatus = (isCompleted: boolean): {
  label: string;
  variant: 'completed' | 'pending';
} => {
  return isCompleted 
    ? { label: 'Missão Concluída', variant: 'completed' }
    : { label: 'Em Andamento', variant: 'pending' };
};
