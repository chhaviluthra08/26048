'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useViewed } from '@/context/ViewedContext';
import { fetchNotifications } from '@/lib/api';
import Navbar from '@/components/Navbar';
import NotificationCard from '@/components/NotificationCard';
import {
  Box, Typography, ToggleButton, ToggleButtonGroup, CircularProgress,
  Alert, Button, Pagination, Skeleton, Badge,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const PAGE_SIZE = 10;
const TYPES = ['All', 'Placement', 'Result', 'Event'];

export default function NotificationsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { markAllViewed, viewedIds } = useViewed();

  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!token) { router.push('/'); return; }
    loadNotifications();
  }, [token]);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotifications(token);
      setNotifications(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const f = typeFilter === 'All' ? notifications : notifications.filter(n => n.Type === typeFilter);
    setFiltered(f);
    setPage(1);
  }, [typeFilter, notifications]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const unreadCount = notifications.filter(n => !viewedIds.has(n.ID)).length;

  return (
    <Box sx={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <Navbar />
      <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ color: '#F0F0FF', fontWeight: 700 }}>
                All Notifications
              </Typography>
              {unreadCount > 0 && (
                <Box sx={{
                  px: 1, py: 0.25, borderRadius: 2,
                  background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)',
                }}>
                  <Typography variant="caption" sx={{ color: '#6C63FF', fontWeight: 700 }}>
                    {unreadCount} new
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="body2" sx={{ color: '#8888AA', mt: 0.5 }}>
              {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
              {typeFilter !== 'All' ? ` · ${typeFilter}` : ''}
            </Typography>
          </Box>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadNotifications}
            size="small"
            sx={{ color: '#8888AA', border: '1px solid rgba(255,255,255,0.08)', '&:hover': { color: '#F0F0FF' } }}
          >
            Refresh
          </Button>
        </Box>

        {/* Filters */}
        <ToggleButtonGroup
          value={typeFilter}
          exclusive
          onChange={(_, val) => val && setTypeFilter(val)}
          sx={{ mb: 3, flexWrap: 'wrap', gap: 0.5 }}
        >
          {TYPES.map(t => (
            <ToggleButton key={t} value={t} sx={{
              px: 2, py: 0.75, borderRadius: '8px !important',
              border: '1px solid rgba(255,255,255,0.08) !important',
              color: '#8888AA', fontSize: '0.8rem', fontWeight: 600,
              '&.Mui-selected': {
                background: 'rgba(108,99,255,0.2)',
                color: '#6C63FF',
                borderColor: 'rgba(108,99,255,0.4) !important',
              },
            }}>
              {t}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Content */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={72} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
            ))}
          </Box>
        ) : paginated.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <NotificationsNoneIcon sx={{ fontSize: 48, color: '#333355', mb: 2 }} />
            <Typography sx={{ color: '#555577' }}>No notifications found</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {paginated.map(n => (
                <NotificationCard key={n.ID} notification={n} />
              ))}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, v) => { setPage(v); window.scrollTo(0, 0); }}
                  sx={{
                    '& .MuiPaginationItem-root': { color: '#8888AA' },
                    '& .Mui-selected': { background: 'rgba(108,99,255,0.2) !important', color: '#6C63FF' },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}