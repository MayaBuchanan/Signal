export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Returns "$12,500" or "—" */
export const formatCurrency = (value?: number): string => {
  if (value == null || value === 0) return '—';
  return '$' + value.toLocaleString('en-US');
};

/**
 * Follow-up relative label — used for nextFollowUpDate fields.
 * Returns { text, overdue } or null if no date.
 */
export const followUpLabel = (dateString?: string): { text: string; overdue: boolean } | null => {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diffDays === 0) return { text: 'Due today', overdue: false };
  if (diffDays > 0)   return { text: `Due in ${diffDays}d`, overdue: false };
  return { text: `Overdue ${Math.abs(diffDays)}d`, overdue: true };
};

/**
 * General relative label for any date (close date, created, etc.)
 * Returns { text, past } or null if no date.
 * Falls back to a formatted absolute date beyond 60 days.
 */
export const relativeDateLabel = (dateString?: string): { text: string; past: boolean } | null => {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diffDays === 0)                       return { text: 'Today',                   past: false };
  if (diffDays === 1)                       return { text: 'Tomorrow',                past: false };
  if (diffDays === -1)                      return { text: 'Yesterday',               past: true  };
  if (diffDays > 1   && diffDays <= 60)     return { text: `In ${diffDays} days`,     past: false };
  if (diffDays < -1  && diffDays >= -60)    return { text: `${Math.abs(diffDays)} days ago`, past: true  };
  return {
    text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    past: diffDays < 0,
  };
};

/**
 * Returns "Today" | "Yesterday" | "Xd ago" | "Never" for last-touched dates.
 */
export const lastTouchedLabel = (dateString?: string): string => {
  if (!dateString) return 'Never';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateString);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
};

/** Stage → win probability heuristic (display only) */
export const stageProbability: Record<string, number> = {
  'Prospect':       10,
  'Qualified':      25,
  'Demo Scheduled': 40,
  'Proposal Sent':  65,
  'Closed Won':    100,
  'Closed Lost':     0,
  // legacy
  'Exploring':      10,
  'Active':         30,
  'At Risk':        15,
  'Completed':     100,
};
