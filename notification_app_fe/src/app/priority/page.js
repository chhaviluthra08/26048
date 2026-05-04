'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchNotifications, getPriorityNotifications } from '@/lib/api';
import Navbar from '@/components/Navbar';
import NotificationCard from '@/components/NotificationCard';
import {
  Box, Typography, ToggleButton, ToggleButtonGroup,
  CircularProgress, Alert, Button, Skeleton, Select, MenuItem,
  FormControl, InputLabel,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const TYPES = ['All', 'Placement', 'Result', 'Event'];
const TOP_N_OPTIONS = [5, 10, 15, 20];

export default function PriorityPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [allNotifications, setAllNotifications] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    if (!token) { router.push('/'); return; }
    loadNotifications();
  }, [token]);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotifications(token);
      setAllNotifications(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const source = typeFilter === 'All' ? allNotifications : allNotifications.filter(n => n.Type === typeFilter);
    const priority = getPriorityNotifications(source, topN);
    setDisplayed(priority);
  }, [allNotifications, typeFilter, topN]);

  return (
    <Box sx={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <Navbar />
      <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StarIcon sx={{ color: '#FFB347', fontSize: 24 }} />
              <Typography variant="h5" sx={{ color: '#F0F0FF', fontWeight: 700 }}>
                Priority Inbox
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#8888AA', mt: 0.5 }}>
              Top {displayed.length} notifications · ranked by importance &amp; recency
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

        {/* Priority legend */}
        <Box sx={{
          display: 'flex', gap: 2, mb: 3, p: 2, borderRadius: 2,
          background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.15)',
          flexWrap: 'wrap',
        }}>
          {[['Placement', '#6C63FF', 'Highest'], ['Result', '#00D4AA', 'Medium'], ['Event', '#FFB347', 'Standard']].map(([type, color, label]) => (
            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <Typography variant="caption" sx={{ color: '#8888AA' }}>
                <span style={{ color }}>{type}</span> · {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={(_, val) => val && setTypeFilter(val)}
            sx={{ flexWrap: 'wrap', gap: 0.5 }}
          >
            {TYPES.map(t => (
              <ToggleButton key={t} value={t} sx={{
                px: 2, py: 0.75, borderRadius: '8px !important',
                border: '1px solid rgba(255,255,255,0.08) !important',
                color: '#8888AA', fontSize: '0.8rem', fontWeight: 600,
                '&.Mui-selected': {
                  background: 'rgba(255,179,71,0.15)',
                  color: '#FFB347',
                  borderColor: 'rgba(255,179,71,0.3) !important',
                },
              }}>
                {t}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel sx={{ color: '#8888AA', fontSize: '0.85rem' }}>Show top</InputLabel>
            <Select
              value={topN}
              label="Show top"
              onChange={e => setTopN(e.target.value)}
              sx={{
                color: '#F0F0FF', fontSize: '0.85rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(108,99,255,0.4)' },
              }}
            >
              {TOP_N_OPTIONS.map(n => (
                <MenuItem key={n} value={n}>Top {n}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Content */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={72} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
            ))}
          </Box>
        ) : displayed.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <StarBorderIcon sx={{ fontSize: 48, color: '#333355', mb: 2 }} />
            <Typography sx={{ color: '#555577' }}>No notifications found</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {displayed.map((n, i) => (
              <NotificationCard key={n.ID} notification={n} rank={i + 1} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}