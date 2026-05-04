'use client';
import { Box, Typography, Chip } from '@mui/material';
import { getTypeColor, formatTimestamp } from '@/lib/api';
import { useViewed } from '@/context/ViewedContext';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';

function TypeIcon({ type, size = 20 }) {
  const color = getTypeColor(type);
  const props = { sx: { color, fontSize: size } };
  if (type === 'Placement') return <WorkIcon {...props} />;
  if (type === 'Result') return <AssignmentIcon {...props} />;
  return <EventIcon {...props} />;
}

export default function NotificationCard({ notification, rank }) {
  const { markViewed, isViewed } = useViewed();
  const viewed = isViewed(notification.ID);
  const typeColor = getTypeColor(notification.Type);

  return (
    <Box
      onClick={() => markViewed(notification.ID)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        background: viewed ? 'rgba(18,18,26,0.6)' : 'rgba(108,99,255,0.05)',
        border: viewed ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${typeColor}30`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          background: viewed ? 'rgba(30,30,45,0.8)' : 'rgba(108,99,255,0.1)',
          transform: 'translateY(-1px)',
          boxShadow: `0 4px 20px ${typeColor}15`,
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Unread indicator */}
      {!viewed && (
        <Box sx={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: '60%', borderRadius: '0 2px 2px 0',
          background: typeColor,
        }} />
      )}

      {/* Icon */}
      <Box sx={{
        width: 40, height: 40, borderRadius: 2, flexShrink: 0,
        background: `${typeColor}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <TypeIcon type={notification.Type} />
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
          {rank && (
            <Typography variant="caption" sx={{
              color: typeColor, fontWeight: 700, fontSize: '0.7rem',
              background: `${typeColor}18`, px: 0.8, py: 0.2, borderRadius: 1,
            }}>
              #{rank}
            </Typography>
          )}
          <Chip
            label={notification.Type}
            size="small"
            sx={{
              height: 20, fontSize: '0.65rem', fontWeight: 700,
              background: `${typeColor}18`, color: typeColor,
              border: `1px solid ${typeColor}30`,
            }}
          />
          {!viewed && (
            <Chip label="NEW" size="small" sx={{
              height: 20, fontSize: '0.6rem', fontWeight: 700,
              background: 'rgba(108,99,255,0.2)', color: '#6C63FF',
            }} />
          )}
        </Box>
        <Typography variant="body2" sx={{
          color: viewed ? '#8888AA' : '#F0F0FF',
          fontWeight: viewed ? 400 : 500,
          lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {notification.Message}
        </Typography>
      </Box>

      {/* Timestamp */}
      <Typography variant="caption" sx={{
        color: '#555577', flexShrink: 0, fontSize: '0.7rem',
        alignSelf: 'center',
      }}>
        {formatTimestamp(notification.Timestamp)}
      </Typography>
    </Box>
  );
}