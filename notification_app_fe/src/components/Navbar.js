'use client';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => { logout(); router.push('/'); };

  const navItems = [
    { label: 'All Notifications', path: '/notifications', icon: <NotificationsActiveIcon fontSize="small" /> },
    { label: 'Priority Inbox', path: '/priority', icon: <StarIcon fontSize="small" /> },
  ];

  return (
    <>
      <AppBar position="sticky" sx={{
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108,99,255,0.15)',
        boxShadow: 'none',
      }}>
        <Toolbar sx={{ gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3, cursor: 'pointer' }} onClick={() => router.push('/notifications')}>
            <Box sx={{
              width: 32, height: 32, borderRadius: 1.5,
              background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <NotificationsActiveIcon sx={{ color: '#fff', fontSize: 16 }} />
            </Box>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, color: '#F0F0FF' }}>
              CampusNotify
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {navItems.map(item => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => router.push(item.path)}
                  sx={{
                    color: pathname === item.path ? '#6C63FF' : '#8888AA',
                    borderBottom: pathname === item.path ? '2px solid #6C63FF' : '2px solid transparent',
                    borderRadius: 0,
                    px: 2, py: 1,
                    '&:hover': { color: '#F0F0FF', background: 'transparent' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

          {!isMobile ? (
            <Button startIcon={<LogoutIcon />} onClick={handleLogout} size="small"
              sx={{ color: '#8888AA', '&:hover': { color: '#FF4D6D' } }}>
              Logout
            </Button>
          ) : (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#8888AA' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { background: '#12121A', width: 240, borderLeft: '1px solid rgba(108,99,255,0.15)' } }}>
        <List sx={{ pt: 3 }}>
          {navItems.map(item => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton onClick={() => { router.push(item.path); setDrawerOpen(false); }}
                sx={{ color: pathname === item.path ? '#6C63FF' : '#8888AA' }}>
                <Box sx={{ mr: 1.5 }}>{item.icon}</Box>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ color: '#FF4D6D' }}>
              <Box sx={{ mr: 1.5 }}><LogoutIcon fontSize="small" /></Box>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}