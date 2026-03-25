import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Avatar,
  Grid,
  Paper,
  Badge,
  Slide
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const OrderNotificationPopup = () => {
  const { newBookings, pendingBookings, clearBooking } = useSocket(); // ✅ Get from context
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderQueue, setOrderQueue] = useState([]);

  // ✅ Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // ✅ Add pending bookings to queue (when admin comes back online)
  useEffect(() => {
    if (pendingBookings.length > 0) {
      console.log('Adding pending bookings to queue:', pendingBookings.length);
      setOrderQueue(prev => [...prev, ...pendingBookings]);
    }
  }, [pendingBookings]);

  // ✅ MAIN EFFECT: Watch for new bookings from SocketContext
  useEffect(() => {
    if (newBookings.length > 0) {
      const latestBooking = newBookings[newBookings.length - 1];
      console.log('📦 Processing new booking:', latestBooking);

      // Transform data
      const orderData = {
        orderId: latestBooking._id || latestBooking.id,
        orderNumber: latestBooking.orderId || latestBooking.bookingNumber || 'N/A',
        customerName: latestBooking.userName || latestBooking.userAddress?.userName || 'Unknown',
        customerPhone: latestBooking.userPhone || latestBooking.userAddress?.phone || 'N/A',
        serviceName: latestBooking.serviceName || latestBooking.ondemandservicesDetails?.name || 'Service',
        amount: latestBooking.amount || 0,
        status: latestBooking.status || 'pending',
        scheduledDate: latestBooking.bookedDate || latestBooking.scheduledDate,
        scheduledTime: latestBooking.bookedTime || latestBooking.scheduledTime,
        orderDate: latestBooking.timestamp || latestBooking.createdAt || new Date(),
        address: latestBooking.address || latestBooking.userAddress || {},
        rawData: latestBooking
      };

      // Add to queue
      setOrderQueue(prev => [...prev, orderData]);

      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('New Booking! 🎉', {
          body: `${orderData.orderNumber} - ${orderData.customerName}\n₹${orderData.amount}`,
          icon: '/logo192.png',
          requireInteraction: true
        });

        notification.onclick = () => {
          window.focus();
          navigate(`/orders/${orderData.orderId}`);
          notification.close();
        };
      }
    }
  }, [newBookings]); // ✅ Runs whenever newBookings changes

  // ✅ Show popup when there's something in queue
  useEffect(() => {
    if (orderQueue.length > 0 && !open) {
      setCurrentOrder(orderQueue[0]);
      setOpen(true);
    }
  }, [orderQueue, open]);

  // ✅ Close and show next
  const handleClose = useCallback(() => {
    if (currentOrder?.rawData?._id) {
      clearBooking(currentOrder.rawData._id); // Clear from SocketContext
    }

    setOpen(false);
    
    setTimeout(() => {
      setOrderQueue(prev => {
        const newQueue = prev.slice(1);
        if (newQueue.length > 0) {
          setCurrentOrder(newQueue[0]);
          setOpen(true);
        } else {
          setCurrentOrder(null);
        }
        return newQueue;
      });
    }, 300);
  }, [currentOrder, clearBooking]);

  const handleViewOrder = useCallback((orderId) => {
    navigate(`/orders/${orderId}`);
    handleClose();
  }, [navigate, handleClose]);

  const handleCallCustomer = useCallback(() => {
    if (currentOrder?.customerPhone && currentOrder.customerPhone !== 'N/A') {
      window.open(`tel:${currentOrder.customerPhone}`);
    } else {
      toast.warning('Customer phone number not available');
    }
  }, [currentOrder]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAddress = (address) => {
    if (!address || typeof address === 'string') return address || 'N/A';
    const parts = [
      address.addressLineOne,
      address.area,
      address.cityName,
      address.postalCode
    ].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  if (!currentOrder) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          overflow: 'visible'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2.5
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={orderQueue.length} color="error">
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 50, height: 50 }}>
              <NotificationsIcon />
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              🎉 New Booking Received!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95, mt: 0.5 }}>
              {currentOrder.orderNumber} • {formatDate(currentOrder.orderDate)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Grid container spacing={3}>
          {/* Customer Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2.5, height: '100%', borderRadius: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Customer Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Name</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {currentOrder.customerName}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" fontWeight="600">
                      {currentOrder.customerPhone}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="start" gap={1}>
                  <LocationIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography variant="body2">
                      {formatAddress(currentOrder.address)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Order Info */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2.5, height: '100%', borderRadius: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CartIcon color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Booking Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Service</Typography>
                  <Typography variant="body1" fontWeight="600">
                    {currentOrder.serviceName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Amount</Typography>
                  <Chip 
                    label={`₹${currentOrder.amount}`} 
                    color="success" 
                    sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Chip 
                    label={currentOrder.status.toUpperCase()} 
                    color="warning" 
                    size="small"
                  />
                </Box>
                {currentOrder.scheduledDate && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatDate(currentOrder.scheduledDate)}
                    </Typography>
                  </Box>
                )}
                {currentOrder.scheduledTime && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {currentOrder.scheduledTime}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Queue Indicator */}
        {orderQueue.length > 1 && (
          <Paper 
            elevation={0}
            sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: 'info.light', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'info.main'
            }}
          >
            <Typography variant="body2" color="info.dark" fontWeight="600">
              📋 {orderQueue.length - 1} more booking(s) waiting
            </Typography>
          </Paper>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, gap: 1.5, bgcolor: 'grey.50' }}>
        <Button variant="outlined" onClick={handleClose} sx={{ flex: 1 }}>
          Dismiss
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PhoneIcon />}
          onClick={handleCallCustomer}
          sx={{ flex: 1 }}
        >
          Call Customer
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleViewOrder(currentOrder.orderId)}
          sx={{ flex: 1 }}
        >
          View Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderNotificationPopup;
