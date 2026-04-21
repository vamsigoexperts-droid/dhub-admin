// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { IconBellRinging } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { URLS } from 'src/Url';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import { useSocket } from 'src/context/SocketContext';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    return 'N/A';
  }
};

const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'N/A';
  }
};

const resolveBookingRoute = (notification) => {
  const bookingId = notification?.bookingId || notification?.orderId || notification?._id || notification?.id;
  const bookingType = String(
    notification?.bookingType ||
      notification?.providerType ||
      notification?.typeProvider ||
      notification?.orderType ||
      ''
  ).toLowerCase();

  if (!bookingId) {
    return '/notifications/history';
  }

  if (bookingType === 'professional') {
    return `/bookings/professional/view/${bookingId}`;
  }

  if (bookingType === 'verified-partner' || bookingType === 'verified_partner' || bookingType === 'partner') {
    return `/bookings/verified-partner/view/${bookingId}`;
  }

  if (
    bookingType === 'service-center' ||
    bookingType === 'service_center' ||
    bookingType === 'provider' ||
    bookingType === 'regular' ||
    bookingType === 'dhub'
  ) {
    return `/bookings/service-center/view/${bookingId}`;
  }

  return '/notifications/history';
};

const Notification = () => {
  const navigate = useNavigate();
  const { newBookings, pendingBookings } = useSocket();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const previousBookingCountRef = useRef(0);
  const previousPendingCountRef = useRef(0);
  const [lastSeenAt, setLastSeenAt] = useState(() => {
    try {
      return localStorage.getItem('admin_notifications_last_seen') || '';
    } catch (error) {
      return '';
    }
  });

  const token = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || '';
    } catch (error) {
      return '';
    }
  }, []);

  const getNotificationTimestamp = useCallback((notification) => {
    const rawDate =
      notification?.logCreatedDate ||
      notification?.createdAt ||
      notification?.sentAt ||
      notification?.date;
    const rawTime = notification?.time;

    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.getTime();
      }
    }

    if (notification?.date && rawTime) {
      const parsed = new Date(`${notification.date} ${rawTime}`);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.getTime();
      }
    }

    return 0;
  }, []);

  const markNotificationsAsSeen = useCallback(() => {
    const seenAt = Date.now();
    setLastSeenAt(String(seenAt));
    setUnreadCount(0);

    try {
      localStorage.setItem('admin_notifications_last_seen', String(seenAt));
    } catch (error) {
      // ignore storage issues
    }
  }, []);

  const computeUnreadCount = useCallback((notificationsList, seenAtValue, totalCountValue = 0) => {
    const seenAtNumber = Number(seenAtValue) || 0;
    if (!seenAtNumber) {
      return Number(totalCountValue) || notificationsList.length;
    }

    return notificationsList.filter((notification) => getNotificationTimestamp(notification) > seenAtNumber).length;
  }, [getNotificationTimestamp]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(URLS.NotificationHistory, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 1,
          limit: 8,
        },
      });

      const responseData = response.data;
      const dataObj = responseData?.data || responseData;
      const notificationsList = Array.isArray(dataObj?.notifications)
        ? dataObj.notifications
        : Array.isArray(dataObj?.data)
          ? dataObj.data
          : Array.isArray(dataObj)
            ? dataObj
            : [];

      setNotifications(notificationsList);
      const resolvedTotalCount = dataObj?.totalCount || dataObj?.total || dataObj?.count || notificationsList.length;
      setTotalCount(resolvedTotalCount);
      setUnreadCount(computeUnreadCount(notificationsList, lastSeenAt, resolvedTotalCount));
    } catch (error) {
      console.error('Error loading admin notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [token, lastSeenAt, computeUnreadCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (newBookings.length > previousBookingCountRef.current) {
      fetchNotifications();
      playNotificationSound();
    }

    previousBookingCountRef.current = newBookings.length;
  }, [newBookings.length, fetchNotifications]);

  useEffect(() => {
    if (pendingBookings.length > previousPendingCountRef.current) {
      fetchNotifications();
    }

    previousPendingCountRef.current = pendingBookings.length;
  }, [pendingBookings.length, fetchNotifications]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    markNotificationsAsSeen();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const recentCount = Math.min(Number(unreadCount) || 0, 99);

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not available');
    }
  }, []);

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show notifications"
        color="inherit"
        aria-controls="admin-notifications-menu"
        aria-haspopup="true"
        sx={{
          color: anchorEl ? 'primary.main' : '#e7fffb',
        }}
        onClick={handleOpen}
      >
        <Badge badgeContent={recentCount} color="error" max={99} showZero={false}>
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
      </IconButton>

      <Menu
        id="admin-notifications-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '380px',
          },
        }}
      >
        <Stack direction="row" py={2} px={3} justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">Admin Notifications</Typography>
            <Typography variant="caption" color="textSecondary">
              Latest {notifications.length} of {totalCount || notifications.length}
            </Typography>
          </Box>
          <Chip label={loading ? 'Loading' : `${recentCount}`} color="primary" size="small" />
        </Stack>

        <Divider />

        <Scrollbar sx={{ maxHeight: '420px' }}>
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const title = notification.title || 'Notification';
              const description = notification.description || notification.message || 'No details';
              const dateLabel = notification.date || formatDate(notification.createdAt || notification.sentAt);
              const timeLabel = notification.time || formatTime(notification.createdAt || notification.sentAt);

                return (
                  <Box key={notification._id || notification.id}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    markNotificationsAsSeen();
                    navigate(resolveBookingRoute(notification));
                  }}
                    sx={{ py: 1.5, px: 3, alignItems: 'flex-start', whiteSpace: 'normal' }}
                  >
                    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                          flexShrink: 0,
                        }}
                      >
                        <IconBellRinging size={18} />
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dateLabel} {timeLabel ? `• ${timeLabel}` : ''}
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                </Box>
              );
            })
          ) : (
            <Box px={3} py={4} textAlign="center">
              <Typography variant="subtitle2" fontWeight={600}>
                No notifications yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Website and app notifications will appear here.
              </Typography>
            </Box>
          )}
        </Scrollbar>

        <Box p={3} pt={2}>
          <Button
            onClick={() => {
              handleClose();
              markNotificationsAsSeen();
              navigate('/notifications/history');
            }}
            variant="outlined"
            color="primary"
            fullWidth
          >
            See all Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Notification;
