function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = toDate(value);
  return date ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

export function formatDateTime(value) {
  const date = toDate(value);
  return date
    ? date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
    : '—';
}

export function formatDayLabel(dateKey) {
  const date = dateKey ? toDate(`${dateKey}T00:00:00Z`) : null;
  return date ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';
}

export function formatJoinDate(value) {
  const date = toDate(value);
  return date ? `Joined ${date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : 'Member';
}

export function formatPercent(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return '0%';
  return `${numericValue % 1 === 0 ? numericValue.toFixed(0) : numericValue.toFixed(1)}%`;
}

export function formatTimeRemaining(expiresAt) {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Expired';

  const totalMinutes = Math.floor(diffMs / (60 * 1000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h ${totalMinutes % 60}m left`;
}

// Like formatTimeRemaining, but in the last hour it counts seconds too ("42m 18s left").
export function formatCountdown(expiresAt) {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (!Number.isFinite(diffMs) || diffMs <= 0) return 'Expired';

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m ${String(totalSeconds % 60).padStart(2, '0')}s left`;
}

export function formatClock(totalSeconds) {
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

export function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
