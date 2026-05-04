'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Box, Button, TextField, Typography, Paper, InputAdornment,
  IconButton, Alert, CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function LoginPage() {
  const [token, setToken] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!token.trim()) { setError('Please enter your Bearer token'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/proxy/notifications', {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      if (!res.ok) throw new Error('Invalid or expired token');
      login(token.trim());
      router.push('/notifications');
    } catch (e) {
      setError(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,212,170,0.1) 0%, transparent 50%), #0A0A0F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}>
      {/* Decorative blobs */}
      <Box sx={{
        position: 'fixed', top: '10%', left: '5%', width: 300, height: 300,
        borderRadius: '50%', background: 'rgba(108,99,255,0.06)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'fixed', bottom: '15%', right: '8%', width: 250, height: 250,
        borderRadius: '50%', background: 'rgba(0,212,170,0.06)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <Paper sx={{
        p: { xs: 3, sm: 5 },
        width: '100%',
        maxWidth: 460,
        background: 'rgba(18,18,26,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(108,99,255,0.2)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2,
            background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <NotificationsActiveIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1, color: '#F0F0FF' }}>CampusNotify</Typography>
            <Typography variant="caption" sx={{ color: '#8888AA' }}>Placement · Events · Results</Typography>
          </Box>
        </Box>

        <Typography variant="h5" sx={{ mb: 0.5, color: '#F0F0FF' }}>Welcome back</Typography>
        <Typography variant="body2" sx={{ color: '#8888AA', mb: 3 }}>
          Paste your Bearer token to access your notifications
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Bearer Token"
          value={token}
          onChange={e => setToken(e.target.value)}
          type={show ? 'text' : 'password'}
          placeholder="eyJhbGciOiJIUzI1NiIs..."
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                <IconButton onClick={() => setShow(!show)} edge="end" size="small">
                  {show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            py: 1.5,
            background: 'linear-gradient(135deg, #6C63FF, #5A52E0)',
            '&:hover': { background: 'linear-gradient(135deg, #7B73FF, #6C63FF)' },
            boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
          }}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockOutlinedIcon />}
        >
          {loading ? 'Verifying...' : 'Access Dashboard'}
        </Button>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#555577' }}>
          Token is stored in session only — cleared on tab close
        </Typography>
      </Paper>
    </Box>
  );
}