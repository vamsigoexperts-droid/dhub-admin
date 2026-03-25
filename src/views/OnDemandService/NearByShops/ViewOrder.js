import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  IconInfoCircle,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { URLS } from '../../../Url';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/ondemandservice/near-by-shops/accepted', title: 'Accepted Orders' },
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
  ...(status === 'cancelled' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
}));

const PaymentStatusChip = styled(Chip)(({ theme, paymentStatus }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  ...(paymentStatus === 'paid' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(paymentStatus === 'pending' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...(paymentStatus === 'failed' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
}));

// API Configuration


const ViewOrder = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [serviceTollFreeNumber, setServiceTollFreeNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch order data from API
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }

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

        if (response.data && response.data.success) {
          setOrderData(response.data.data);
          setServiceTollFreeNumber(response.data.serviceTollFreeNumber || '');
        } else {
          throw new Error(response.data.message || 'Failed to fetch order details');
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch order details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCallCustomer = () => {
    const phoneNumber = orderData?.useraddresDetails?.phone;
    if (phoneNumber) {
      toast.info(`Calling ${orderData.userName} at ${phoneNumber}...`);
      // You can integrate with a calling service here
      window.open(`tel:${phoneNumber}`);
    } else {
      toast.error('Phone number not available');
    }
  };

  const handleCallTollFree = () => {
    if (serviceTollFreeNumber) {
      toast.info(`Calling toll-free number ${serviceTollFreeNumber}...`);
      window.open(`tel:${serviceTollFreeNumber}`);
    } else {
      toast.error('Toll-free number not available');
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

    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // This is a hypothetical API call - adjust according to your actual update endpoint
      const updatePayload = {
        bookingId: orderData._id,
        status: newStatus,
        comment: statusComment,
        updatedBy: 'admin' // You might want to get this from user context
      };

      // Uncomment and adjust when you have the actual update endpoint
      /*
      const response = await axios.post(
        URLS.UpdateBookingStatus,
        updatePayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        // Update local state
        setOrderData(prev => ({ ...prev, status: newStatus }));
        toast.success('Order status updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
      */

      // For now, just update local state and show success message
      setOrderData(prev => ({ ...prev, status: newStatus }));
      toast.success('Order status updated successfully');
      
      setOpenStatusModal(false);
      setNewStatus('');
      setStatusComment('');
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.info('Generating invoice...');
    // Implement invoice generation logic here
    // You might want to call an API to generate and download the invoice
  };

  const formatAddress = (addressDetails) => {
    if (!addressDetails) return 'N/A';
    
    const addressParts = [
      addressDetails.flat,
      addressDetails.addressLineOne,
      addressDetails.addressLineTwo,
      addressDetails.area,
      addressDetails.cityName,
      addressDetails.stateName,
      addressDetails.postalCode
    ].filter(Boolean);
    
    return addressParts.join(', ');
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return 'N/A';
    return `${date} at ${time}`;
  };

  const calculateTotalFromRateCards = (ratecards) => {
    if (!ratecards || ratecards.length === 0) return 0;
    return ratecards.reduce((total, card) => {
      const price = parseFloat(card.rateCardPrice) || 0;
      const quantity = parseInt(card.rateCardQuantity) || 1;
      return total + (price * quantity);
    }, 0);
  };

  if (loading) {
    return (
      <PageContainer title="Order Details" description="Loading order details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading order details...
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Order Details" description="Error loading order details">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      </PageContainer>
    );
  }

  if (!orderData) {
    return (
      <PageContainer title="Order Details" description="Order not found">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6">No order data available.</Typography>
        </Box>
      </PageContainer>
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
                Order placed on {formatDateTime(orderData.bookedDate, orderData.bookedTime)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <StatusChip 
              label={orderData.status.toUpperCase()} 
              status={orderData.status}
              size="medium"
            />
            <PaymentStatusChip 
              label={`Payment: ${orderData.paymentStatus.toUpperCase()}`}
              paymentStatus={orderData.paymentStatus}
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
              
              {orderData.data && (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Category: {orderData.data.categoryName || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Subcategory: {orderData.data.subcategoryName || 'N/A'}
                  </Typography>
                  
                  {orderData.data.description && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Service Description:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        dangerouslySetInnerHTML={{ __html: orderData.data.description }}
                        sx={{ 
                          '& p': { mb: 1 },
                          '& ul': { pl: 2 },
                          '& li': { mb: 0.5 }
                        }}
                      />
                    </Box>
                  )}

                  {orderData.data.benefitsOfTheService && orderData.data.benefitsOfTheService.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Service Benefits:
                      </Typography>
                      <List dense>
                        {orderData.data.benefitsOfTheService.map((benefit, index) => (
                          <ListItem key={index} disableGutters>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <IconCheck size={16} color={theme.palette.success.main} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={benefit.benefitsOfTheService}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </>
              )}

              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconCalendar size={20} color={theme.palette.primary.main} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Scheduled Date & Time
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {formatDateTime(orderData.date, orderData.time)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconUser size={20} color={theme.palette.primary.main} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Service Type
                        </Typography>
                        <Typography variant="body2" fontWeight="600" sx={{ textTransform: 'capitalize' }}>
                          {orderData.typeProvider || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </StyledCard>

          {/* Rate Cards */}
          {orderData.ratecards && orderData.ratecards.length > 0 && (
            <StyledCard>
              <CardHeader
                title="Service Rate Cards"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service Item</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderData.ratecards.map((ratecard) => {
                        const price = parseFloat(ratecard.rateCardPrice) || 0;
                        const quantity = parseInt(ratecard.rateCardQuantity) || 1;
                        const subtotal = price * quantity;
                        
                        return (
                          <TableRow key={ratecard._id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {ratecard.rateCardTitle}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">₹{price.toFixed(2)}</TableCell>
                            <TableCell align="right">{quantity}</TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="600">
                                ₹{subtotal.toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography variant="subtitle1" fontWeight="600">
                            Calculated Total
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" fontWeight="600" color="primary">
                            ₹{calculateTotalFromRateCards(orderData.ratecards).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </StyledCard>
          )}

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
                >
                  Call Customer
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
                    primary={orderData.userName}
                    secondary="Customer Name"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <IconPhone size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={orderData.useraddresDetails?.phone || 'N/A'}
                    secondary="Phone Number"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <IconMapPin size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={formatAddress(orderData.useraddresDetails)}
                    secondary="Service Address"
                  />
                </ListItem>
                {orderData.useraddresDetails?.type && (
                  <ListItem>
                    <ListItemIcon>
                      <IconInfoCircle size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={orderData.useraddresDetails.type}
                      secondary="Address Type"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
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
                  sx={{ borderRadius: 2 }}
                >
                  Invoice
                </Button>
              }
            />
            <CardContent>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Total Amount" />
                  <Typography variant="h6" fontWeight="600" color="primary">
                    ₹{orderData.amount.toFixed(2)}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Payment Status" />
                  <PaymentStatusChip 
                    label={orderData.paymentStatus}
                    paymentStatus={orderData.paymentStatus}
                    size="small"
                  />
                </ListItem>
                {orderData.paymentMethod && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="Payment Method" />
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {orderData.paymentMethod}
                    </Typography>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </StyledCard>

          {/* Order Status & Actions */}
          <StyledCard>
            <CardHeader
              title="Order Management"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Current Status: <strong>{orderData.status.toUpperCase()}</strong>
                  {orderData.statusTextMessage && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {orderData.statusTextMessage}
                    </Typography>
                  )}
                </Alert>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<IconEdit />}
                  onClick={handleUpdateStatus}
                  sx={{ borderRadius: 2 }}
                >
                  Update Status
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<IconPhone />}
                  onClick={handleCallCustomer}
                  sx={{ borderRadius: 2 }}
                >
                  Call Customer
                </Button>
                
                {serviceTollFreeNumber && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<IconPhone />}
                    onClick={handleCallTollFree}
                    sx={{ borderRadius: 2 }}
                    color="info"
                  >
                    Call Toll-Free: {serviceTollFreeNumber}
                  </Button>
                )}
                
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

          {/* Additional Information */}
          {(orderData.rejectedReason || orderData.data?.videoUrl) && (
            <StyledCard>
              <CardHeader
                title="Additional Information"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              />
              <CardContent>
                {orderData.rejectedReason && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Rejection Reason:</strong> {orderData.rejectedReason}
                    </Typography>
                  </Alert>
                )}
                
                {orderData.data?.videoUrl && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Service Video
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => window.open(orderData.data.videoUrl, '_blank')}
                      sx={{ borderRadius: 2 }}
                    >
                      Watch Video
                    </Button>
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          )}
        </Grid>
      </Grid>

      {/* Status Update Modal */}
      <Dialog open={openStatusModal} onClose={() => setOpenStatusModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Current Status: <strong>{orderData.status.toUpperCase()}</strong>
              </Typography>
            </Grid>
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
          <Button 
            onClick={() => setOpenStatusModal(false)}
            disabled={updatingStatus}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            disabled={!newStatus || updatingStatus}
            startIcon={updatingStatus ? <CircularProgress size={16} /> : null}
          >
            {updatingStatus ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ViewOrder;
