
export type UUID = string;

export type Meeting = {
  id: UUID;
  title: string;
  start_date: string;
  end_date: string;
  created_at?: string;
};

export type MeetingCode = {
  id: UUID;
  meeting_id: UUID;
  code: string;
  is_active: boolean;
  created_at?: string;
};

export type Session = {
  id: UUID;
  meeting_id: UUID;
  code: string;
  nickname: string;
  created_at?: string;
};

export type Pillar = {
  id: UUID;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
};

export type Action = {
  id: UUID;
  pillar_id: UUID;
  title: string;
  description: string | null;
  created_at?: string;
};

export type UserPriority = {
  id: UUID;
  session_id: UUID;
  action_id: UUID;
  rank: number;
  created_at?: string;
};

export type UserPoints = {
  id: UUID;
  session_id: UUID;
  action_id: UUID;
  answer: string; // JSON string: {"points": number}
  created_at?: string;
};

export type Confessional = {
  id: UUID;
  session_id: UUID;
  pillar_id: UUID;
  answer: string; // JSON string com perguntas e respostas
  created_at?: string;
};

export type SessionPillar = {
  id: UUID;
  session_id: UUID;
  pillar_id: UUID;
  is_completed: boolean;
  completed_at: string | null;
};

// Tipos auxiliares para frontend
export type PillarWithActions = Pillar & {
  actions?: Action[];
};

export type SessionSummary = {
  session: Session;
  pillars: (Pillar & {
    isCompleted: boolean;
    topAction?: Action;
    confessional?: string;
    totalPoints?: number;
  })[];
};

export type DashboardData = {
  meeting: Meeting;
  totalSessions: number;
  topActions: {
    action: Action;
    pillar: Pillar;
    totalRank1: number;
    avgRank: number;
    totalPoints: number;
  }[];
  confessionals: {
    pillar: Pillar;
    insights: string[];
  }[];
};

// Tipos para formulários
export type LoginForm = {
  code: string;
  nickname: string;
};

export type PointsAllocation = {
  [actionId: string]: number;
};

export type ConfessionalAnswers = {
  q1: string;
  q2: string;
};
