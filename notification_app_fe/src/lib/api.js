const BASE_URL = '/api/proxy';
export async function fetchNotifications(token, params = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', params.limit);
  if (params.page) query.set('page', params.page);
  if (params.notification_type) query.set('notification_type', params.notification_type);

  const url = `${BASE_URL}/notifications${query.toString() ? '?' + query.toString() : ''}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch notifications');
  }

  const data = await res.json();
  return data.notifications || [];
}

const TYPE_WEIGHT = { Placement: 300, Result: 200, Event: 100 };

export function getPriorityNotifications(notifications, n = 10) {
  return [...notifications]
    .map(n => ({
      ...n,
      _score: TYPE_WEIGHT[n.Type] ?? 0,
      _ts: new Date(n.Timestamp).getTime(),
    }))
    .sort((a, b) => b._score - a._score || b._ts - a._ts)
    .slice(0, n)
    .map(({ _score, _ts, ...rest }) => rest);
}

export function getTypeColor(type) {
  switch (type) {
    case 'Placement': return '#6C63FF';
    case 'Result': return '#00D4AA';
    case 'Event': return '#FFB347';
    default: return '#8888AA';
  }
}

export function formatTimestamp(ts) {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}