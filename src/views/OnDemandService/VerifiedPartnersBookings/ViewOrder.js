import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { URLS } from '../../../Url';
import {
  IconArrowLeft,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCalendar,
  IconClock,
  IconUser,
  IconStar,
  IconShield,
  IconCurrencyRupee,
  IconAlertTriangle,
  IconCheck,
  IconEdit,
  IconDownload,
  IconPackage,
  IconTruck,
} from '@tabler/icons-react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  Alert,
  styled,
  CircularProgress,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { useTheme } from '@mui/material/styles';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/ondemandservice/verified-partners/accepted', title: 'Accepted Orders' },
  { title: 'Order Details' }
];

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  ...(status === 'accepted' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === 'pending' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...(status === 'completed' && {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark,
  }),
  ...(status === 'work-in-progress' && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
  }),
  ...(status === 'cancelled' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
}));

const PriorityChip = styled(Chip)(({ theme, priority }) => ({
  fontWeight: 600,
  ...(priority === 'high' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
  ...(priority === 'medium' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...(priority === 'low' && {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark,
  }),
}));

const ViewOrder = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [updating, setUpdating] = useState(false);

  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;

  // Fetch order data from API
  const fetchOrderData = async () => {
    if (!orderId ) {
      setError('Missing order ID ');
      setLoading(false);
      return;
    }
    if (!token) {
      setError('Missing authentication token');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        URLS.GetServiceBookingsById,
        { id: orderId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && response.data.data) {
        const booking = response.data.data;
        
        // Transform API data to component format
        const transformedData = {
          _id: booking._id,
          orderId: booking.orderId,
          customerName: booking.userName,
          customerPhone: booking.useraddresDetails?.phone || 'N/A',
          customerEmail: booking.useraddresDetails?.email || 'N/A',
          customerAddress: formatAddress(booking.useraddresDetails),
          partnerName: booking.providerName || 'Unassigned',
          partnerImage: booking.providerImage || '/images/profile/default-avatar.jpg',
          partnerVerificationLevel: booking.providerVerificationLevel || 'Standard Verified',
          partnerRating: booking.providerRating || 0,
          partnerPhone: booking.providerPhone || 'N/A',
          partnerExperience: booking.providerExperience || 'N/A',
          serviceName: booking.serviceName,
          serviceCategory: booking.data?.categoryName || 'Professional Service',
          serviceDescription: booking.data?.description ? 
            booking.data.description.replace(/<[^>]*>/g, '').substring(0, 300) + '...' : 
            'Professional service with quality guarantee.',
          orderDate: booking.date,
          orderTime: booking.time,
          bookedDate: booking.bookedDate,
          bookedTime: booking.bookedTime,
          orderValue: booking.amount,
          serviceFee: calculateServiceFee(booking.amount),
          platformFee: calculatePlatformFee(booking.amount),
          taxes: calculateTaxes(booking.amount),
          location: `${booking.useraddresDetails?.area || ''}, ${booking.useraddresDetails?.cityName || ''}`,
          status: booking.status,
          priority: booking.priority || 'medium',
          paymentStatus: booking.paymentStatus,
          paymentMethod: booking.paymentMethod || 'N/A',
          acceptedAt: booking.logModifiedDate ? new Date(booking.logModifiedDate).toLocaleString() : 'N/A',
          estimatedServiceDate: booking.bookedDate && booking.bookedTime ? 
            `${booking.bookedDate} ${booking.bookedTime}` : 'TBD',
          estimatedDuration: '2-4 hours',
          specialInstructions: booking.statusTextMessage || '',
          ratecards: booking.ratecards || [],
          orderTimeline: generateOrderTimeline(booking),
          serviceTollFree: response.data.serviceTollFreeNumber || 'N/A'
        };

        setOrderData(transformedData);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error.response?.data?.message || 'Failed to fetch order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatAddress = (addressDetails) => {
    if (!addressDetails) return 'Address not available';
    
    const parts = [
      addressDetails.flat,
      addressDetails.addressLineOne,
      addressDetails.addressLineTwo,
      addressDetails.area,
      addressDetails.cityName,
      addressDetails.stateName,
      addressDetails.postalCode
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const calculateServiceFee = (totalAmount) => {
    return totalAmount * 0.85; // 85% of total
  };

  const calculatePlatformFee = (totalAmount) => {
    return totalAmount * 0.10; // 10% of total
  };

  const calculateTaxes = (totalAmount) => {
    return totalAmount * 0.05; // 5% of total
  };

  const generateOrderTimeline = (booking) => {
    const timeline = [];
    
    // Order placed
    timeline.push({
      status: 'placed',
      timestamp: new Date(booking.logCreatedDate).toLocaleString(),
      description: 'Order placed by customer',
      icon: IconCheck,
      color: 'success',
    });

    // Status-based timeline
    if (booking.status === 'accepted' || booking.status === 'work-in-progress' || booking.status === 'completed') {
      timeline.push({
        status: 'accepted',
        timestamp: new Date(booking.logModifiedDate).toLocaleString(),
        description: 'Order accepted by partner',
        icon: IconCheck,
        color: 'success',
      });
    }

    if (booking.status === 'work-in-progress' || booking.status === 'completed') {
      timeline.push({
        status: 'workInProgress',
        timestamp: new Date(booking.logModifiedDate).toLocaleString(),
        description: 'Service started',
        icon: IconTruck,
        color: 'info',
      });
    }

    if (booking.status === 'completed') {
      timeline.push({
        status: 'completed',
        timestamp: new Date(booking.logModifiedDate).toLocaleString(),
        description: 'Service completed',
        icon: IconCheck,
        color: 'success',
      });
    }

    if (booking.bookedDate && booking.bookedTime) {
      timeline.push({
        status: 'scheduled',
        timestamp: `${booking.bookedDate} ${booking.bookedTime}`,
        description: `Service scheduled`,
        icon: IconCalendar,
        color: 'info',
      });
    }

    return timeline;
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId, token]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCallCustomer = () => {
    if (orderData?.customerPhone && orderData.customerPhone !== 'N/A') {
      window.open(`tel:${orderData.customerPhone}`);
    } else {
      toast.info('Customer phone number not available');
    }
  };

  const handleCallPartner = () => {
    if (orderData?.partnerPhone && orderData.partnerPhone !== 'N/A') {
      window.open(`tel:${orderData.partnerPhone}`);
    } else {
      toast.info('Partner phone number not available');
    }
  };

  const handleUpdateStatus = () => {
    setOpenStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      // Here you would call your update status API
      // const response = await axios.put(URLS.UpdateBookingStatus, {
      //   bookingId: orderData._id,
      //   status: newStatus,
      //   comment: statusComment
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      toast.success('Order status updated successfully');
      setOpenStatusModal(false);
      setNewStatus('');
      setStatusComment('');
      
      // Refresh order data
      fetchOrderData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.info('Invoice download feature will be implemented');
  };

  const getVerificationChip = (level) => {
    const colorMap = {
      'Gold Verified': 'warning',
      'Premium Verified': 'success',
      'Standard Verified': 'info'
    };
    return (
      <Chip 
        icon={<IconShield size={16} />}
        label={level} 
        size="small" 
        color={colorMap[level] || 'info'} 
        variant="outlined" 
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!orderData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Order not found</Typography>
      </Box>
    );
  }

  return (
    <PageContainer
      title={`Order Details - ${orderData.orderId}`}
      description="View detailed information about the order"
    >
      <Breadcrumb title="Order Details" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<IconArrowLeft />}
              onClick={handleBackClick}
              sx={{ borderRadius: 2 }}
            >
              Back
            </Button>
            <Box>
              <Typography variant="h5" fontWeight="600">
                {orderData.orderId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order placed on  {orderData.orderDate} at {orderData.orderTime}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={2} alignItems="center">
            <StatusChip 
              label={orderData.status.toUpperCase()} 
              status={orderData.status}
              size="medium"
            />
            <PriorityChip 
              label={`${orderData.priority.toUpperCase()} PRIORITY`}
              priority={orderData.priority}
              size="medium"
            />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Service Information */}
          <StyledCard>
            <CardHeader
              title="Service Details"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {orderData.serviceName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Category: {orderData.serviceCategory}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {orderData.serviceDescription}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconCalendar size={20} color={theme.palette.primary.main} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Scheduled Date
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {orderData.estimatedServiceDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconClock size={20} color={theme.palette.primary.main} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Duration
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {orderData.estimatedDuration}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Rate Cards */}
              {orderData.ratecards && orderData.ratecards.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>Service Items</Typography>
                  {orderData.ratecards.map((ratecard, index) => (
                    <Box key={index} sx={{ 
                      border: `1px solid ${theme.palette.divider}`, 
                      borderRadius: 1, 
                      p: 2, 
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {ratecard.rateCardTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Quantity: {ratecard.rateCardQuantity || 1}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="600" color="primary">
                        ₹{ratecard.rateCardPrice}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {orderData.specialInstructions && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Special Instructions:</strong> {orderData.specialInstructions}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </StyledCard>

          {/* Customer Information */}
          <StyledCard>
            <CardHeader
              title="Customer Information"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<IconPhone size={16} />}
                  onClick={handleCallCustomer}
                  sx={{ borderRadius: 2 }}
                  disabled={!orderData.customerPhone || orderData.customerPhone === 'N/A'}
                >
                  Call
                </Button>
              }
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <IconUser size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={orderData.customerName}
                    secondary="Customer Name"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <IconPhone size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={orderData.customerPhone}
                    secondary="Phone Number"
                  />
                </ListItem>
                {orderData.customerEmail !== 'N/A' && (
                  <ListItem>
                    <ListItemIcon>
                      <IconMail size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={orderData.customerEmail}
                      secondary="Email Address"
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <IconMapPin size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={orderData.customerAddress}
                    secondary="Service Address"
                  />
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>

          {/* Partner Information */}
          <StyledCard>
            <CardHeader
              title="Partner Details"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                orderData.partnerPhone !== 'N/A' && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<IconPhone size={16} />}
                    onClick={handleCallPartner}
                    sx={{ borderRadius: 2 }}
                  >
                    Call Partner
                  </Button>
                )
              }
            />
            <CardContent>
              <Box display="flex" alignItems="start" gap={2} sx={{ mb: 2 }}>
                <Avatar
                  src={orderData.partnerImage}
                  alt={orderData.partnerName}
                  sx={{ width: 64, height: 64 }}
                >
                  {orderData.partnerName.charAt(0).toUpperCase()}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="600">
                    {orderData.partnerName}
                  </Typography>
                  {orderData.partnerRating > 0 && (
                    <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                      <IconStar size={16} color={theme.palette.warning.main} />
                      <Typography variant="body2" color="warning.main" fontWeight="600">
                        {orderData.partnerRating} Rating
                      </Typography>
                      {orderData.partnerExperience !== 'N/A' && (
                        <Typography variant="body2" color="text.secondary">
                          • {orderData.partnerExperience}
                        </Typography>
                      )}
                    </Box>
                  )}
                  <Box sx={{ mt: 1 }}>
                    {getVerificationChip(orderData.partnerVerificationLevel)}
                  </Box>
                </Box>
              </Box>
              
              {orderData.partnerPhone !== 'N/A' && (
                <Typography variant="body2" color="text.secondary">
                  Phone: {orderData.partnerPhone}
                </Typography>
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Order Timeline */}
          <StyledCard>
            <CardHeader
              title="Order Timeline"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <CardContent>
              <Timeline position="right">
                {orderData.orderTimeline.map((item, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color={item.color}>
                        <item.icon size={16} />
                      </TimelineDot>
                      {index < orderData.orderTimeline.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" fontWeight="600">
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.timestamp}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </StyledCard>

          {/* Billing Summary */}
          <StyledCard>
            <CardHeader
              title="Billing Summary"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconDownload size={16} />}
                  onClick={handleDownloadInvoice}
                >
                  Invoice
                </Button>
              }
            />
            <CardContent>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Service Fee" />
                  <Typography variant="body2">₹{orderData.serviceFee.toFixed(2)}</Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Platform Fee" />
                  <Typography variant="body2">₹{orderData.platformFee.toFixed(2)}</Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Taxes & Fees" />
                  <Typography variant="body2">₹{orderData.taxes.toFixed(2)}</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary={
                      <Typography variant="h6" fontWeight="600">Total Amount</Typography>
                    } 
                  />
                  <Typography variant="h6" fontWeight="600" color="primary">
                    ₹{orderData.orderValue.toFixed(2)}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Payment Status" />
                  <Chip 
                    label={orderData.paymentStatus} 
                    size="small" 
                    color={orderData.paymentStatus === 'paid' ? 'success' : 'warning'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>

          {/* Support Information */}
          {orderData.serviceTollFree !== 'N/A' && (
            <StyledCard>
              <CardHeader
                title="Support"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconPhone size={20} color={theme.palette.primary.main} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Service Support
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {orderData.serviceTollFree}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          )}

          {/* Quick Actions */}
          <StyledCard>
            <CardHeader
              title="Quick Actions"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<IconEdit />}
                  onClick={handleUpdateStatus}
                  sx={{ borderRadius: 2 }}
                >
                  Update Order Status
                </Button>
                  <Button
                  variant="contained"
                  fullWidth
                  startIcon={<IconEdit />}
                  onClick={handleUpdateStatus}
                  sx={{ borderRadius: 2 }}
                >
                  Update payment status
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<IconPhone />}
                  onClick={handleCallCustomer}
                  sx={{ borderRadius: 2 }}
                  disabled={!orderData.customerPhone || orderData.customerPhone === 'N/A'}
                >
                  Call Customer
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<IconDownload />}
                  onClick={handleDownloadInvoice}
                  sx={{ borderRadius: 2 }}
                >
                  Download Invoice
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Status Update Modal */}
      <Dialog open={openStatusModal} onClose={() => setOpenStatusModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                New Status *
              </Typography>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="accepted">Accept Order</MenuItem>
                <MenuItem value="work-in-progress">Start Service</MenuItem>
                <MenuItem value="completed">Mark Complete</MenuItem>
                <MenuItem value="cancelled">Cancel Order</MenuItem>
                <MenuItem value="rejected">Reject Order</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Comments
              </Typography>
              <TextField
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Add comments about status change..."
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenStatusModal(false)} disabled={updating}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            disabled={updating}
            startIcon={updating ? <CircularProgress size={16} /> : null}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ViewOrder;
