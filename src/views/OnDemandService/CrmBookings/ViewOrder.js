

// export default ViewOrder;
import React, { useState, useEffect } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../../../Url';
import axios from 'axios';
import {
  IconArrowLeft,
  IconPhone,
  IconCalendar,
  IconUser,
  IconStar,
  IconCheck,
  IconEdit,
  IconDownload,
  IconTruck,
  IconInfoCircle,
  IconReceipt,
  IconClock,
  IconMapPin,
} from '@tabler/icons-react';
import {
  Box,
  Typography,
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
  Paper,
  Badge,
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
  { title: 'Order Details' },
];

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 700,
  borderRadius: '6px',
  textTransform: 'capitalize',
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
  ...(status === 'workIsCompleted' && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  }),
  ...(status === 'cancelled' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
}));

const PriorityChip = styled(Chip)(({ theme, priority }) => ({
  fontWeight: 600,
  borderRadius: '6px',
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

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const ImageGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const StyledImage = styled('img')({
  width: '100%',
  height: 80,
  objectFit: 'cover',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'transform 0.2s',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'scale(1.05)',
    border: '2px solid #1976d2',
  },
});

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
  const [selectedImage, setSelectedImage] = useState(null);
  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;

const [openPaymentStatusModal, setOpenPaymentStatusModal] = useState(false);
const [newPaymentStatus, setNewPaymentStatus] = useState('');
const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(false);


  // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Helper function to construct proper image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-placeholder.jpg';
    
    // If already a full URL, return as-is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove leading slash if present, then construct URL
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // URLS.FileBase should be "https://api.doorstephub.com/"
    // cleanPath should be "uploads/ondemandservice/..."
    return `${URLS.FileBase}${cleanPath}`;
  };

  const fetchOrderData = async () => {
    if (!orderId) {
      setError('Missing order ID');
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
        URLS.GetServiceCrmBookingsById,
        { id: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success && response.data.data) {
        const booking = response.data.data;
        transformOrderData(booking);
      } else {
        setError('Failed to fetch order details');
        toast.error('Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error.response?.data?.message || 'Failed to fetch order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = () => {
  setOpenPaymentStatusModal(true);
  setNewPaymentStatus(orderData?.paymentStatus || '');
};

const handlePaymentStatusUpdate = async () => {
  if (!newPaymentStatus) {
    toast.error('Please select a payment status');
    return;
  }

  setUpdatingPaymentStatus(true);
  try {
    const response = await axios.put(
      URLS.updatePaymentStatus,
      {
        bookingId: orderData._id,
        paymentStatus: newPaymentStatus
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      toast.success('Payment status updated successfully');
      setOpenPaymentStatusModal(false);
      setNewPaymentStatus('');
      // Refresh order data
      fetchOrderData();
    } else {
      toast.error(response.data.message || 'Failed to update payment status');
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    toast.error(error.response?.data?.message || 'Failed to update payment status');
  } finally {
    setUpdatingPaymentStatus(false);
  }
};


  const transformOrderData = (booking) => {
    const transformedData = {
      // Basic Order Info
      _id: booking._id,
      orderId: booking.orderId || 'N/A',
      status: booking.status || 'pending',
      priority: booking.priority || 'medium',
      paymentStatus: booking.paymentStatus || 'pending',
      paymentMethod: booking.paymentMethod || 'Not specified',

      // Customer Information
      customerName: booking.userDetails?.name || 'N/A',
      customerPhone: booking.userAddress?.phone || 'N/A',
      customerEmail: booking.userDetails?.email  || 'N/A',
      customerAddress: formatAddress(booking.userAddress),
      userAddress: booking.userAddress || {},

      // Service Information
      serviceName: booking.ondemandservicesDetails?.name || 'N/A',
      serviceCategory: booking.ondemandservicesDetails?.categoryName || 'N/A',
      serviceSubcategory: booking.ondemandservicesDetails?.subcategoryName || 'N/A',
      serviceDescription: booking.ondemandservicesDetails?.description
        ? booking.ondemandservicesDetails.description.replace(/<[^>]*>/g, '').substring(0, 200) +
          '...'
        : 'No description available',
      
      // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ FIXED: Use helper function for service image
      serviceImage: getImageUrl(booking.ondemandservicesDetails?.mainImage),

      // Rate Cards/Items
      ratecards: booking.ratecardDetails || [],
      totalAmount: booking.amount || 0,

      // Timeline and Dates
      orderDate: formatDate(booking.logCreatedDate),
      orderTime: formatTime(booking.logCreatedDate),
      lastUpdated: formatDateTime(booking.logModifiedDate),
      bookedDate: booking.bookedDate || 'Not scheduled',
      bookedTime: booking.bookedTime || 'Not scheduled',

      // Additional Info
      specialInstructions: booking.statusTextMessage || booking.addMoreInfo || 'No special instructions',
      sourceOfLead: booking.sourceOfLead || 'N/A',
      zone: booking.zoneId || 'N/A',
      rejectedReason: booking.rejectedReason || '',

      // Service Provider Info
      providerName: booking.providerDetails 
        ? `${booking.providerDetails.firstName || ''} ${booking.providerDetails.lastName || ''}`.trim()
        : 'Not assigned',
      
      // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ FIXED: Use helper function for provider image
      providerImage: getImageUrl(booking.providerDetails?.image),
      
      providerRating: booking.providerRating || 0,
      providerPhone: booking.providerDetails?.phone || 'N/A',
      providerEmail: booking.providerDetails?.email || 'N/A',

      // Estimation Details
      estimation: booking.estimationDetails || null,
      estimationImages: booking.estimationDetails?.images || [],

      // Booking Images
      bookingImages: booking.bookingImages || [],

      // Timeline
      orderTimeline: generateOrderTimeline(booking),
    };

    console.log('Service Image URL:', transformedData.serviceImage);
    console.log('Provider Image URL:', transformedData.providerImage);

    setOrderData(transformedData);
  };

  const formatAddress = (address) => {
    if (!address) return 'Address not available';

    const parts = [
      address.flat,
      address.addressLineOne,
      address.addressLineTwo,
      address.area,
      address.cityName,
      address.stateName,
      address.postalCode,
    ].filter(Boolean);

    return parts.join(', ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN');
  };

  const generateOrderTimeline = (booking) => {
    const timeline = [];

    // Order placed
    timeline.push({
      status: 'placed',
      timestamp: formatDateTime(booking.logCreatedDate),
      description: 'Order placed by customer',
      icon: IconCheck,
      color: 'success',
    });

    // Current status
    if (booking.status !== 'pending') {
      let statusDescription = `Order ${booking.status}`;
      let icon = IconInfoCircle;
      
      switch(booking.status) {
        case 'accepted':
          statusDescription = 'Order accepted by provider';
          icon = IconCheck;
          break;
        case 'work-in-progress':
          statusDescription = 'Work in progress';
          icon = IconTruck;
          break;
        case 'workIsCompleted':
          statusDescription = 'Work completed by provider';
          icon = IconCheck;
          break;
        case 'completed':
          statusDescription = 'Order completed';
          icon = IconCheck;
          break;
        case 'cancelled':
          statusDescription = booking.rejectedReason 
            ? `Order cancelled: ${booking.rejectedReason}`
            : 'Order cancelled';
          icon = IconInfoCircle;
          break;
        default:
          statusDescription = `Order ${booking.status}`;
      }

      timeline.push({
        status: booking.status,
        timestamp: formatDateTime(booking.logModifiedDate),
        description: statusDescription,
        icon: icon,
        color: booking.status === 'workIsCompleted' || booking.status === 'completed' 
          ? 'success' 
          : booking.status === 'work-in-progress'
          ? 'info'
          : booking.status === 'cancelled'
          ? 'error'
          : 'warning',
      });
    }

    // Scheduled date if available
    if (booking.bookedDate) {
      timeline.push({
        status: 'scheduled',
        timestamp: `${formatDate(booking.bookedDate)} ${booking.bookedTime || ''}`,
        description: 'Service scheduled',
        icon: IconCalendar,
        color: 'info',
      });
    }

    // Estimation if available
    if (booking.estimationDetails) {
      timeline.push({
        status: 'estimation',
        timestamp: formatDateTime(booking.estimationDetails.logCreatedDate),
        description: 'Estimation provided',
        icon: IconReceipt,
        color: 'primary',
      });
    }

    return timeline;
  };

  const calculateBreakdown = (totalAmount) => {
    const serviceFee = totalAmount * 0.85;
    const platformFee = totalAmount * 0.1;
    const taxes = totalAmount * 0.05;

    return { serviceFee, platformFee, taxes, total: totalAmount };
  };

  useEffect(() => {
    fetchOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

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

  const handleCallProvider = () => {
    if (orderData?.providerPhone && orderData.providerPhone !== 'N/A') {
      window.open(`tel:${orderData.providerPhone}`);
    } else {
      toast.info('Provider phone number not available');
    }
  };

  const handleUpdateStatus = () => {
    setOpenStatusModal(true);
    setNewStatus(orderData?.status || '');
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Order status updated successfully');
      setOpenStatusModal(false);
      setNewStatus('');
      setStatusComment('');
      // Refresh data
      fetchOrderData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.info('Invoice download feature will be implemented soon');
  };

  // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ FIXED: Use helper function for image click
  const handleImageClick = (imageUrl) => {
    setSelectedImage(getImageUrl(imageUrl));
  };

  const getStatusOptions = () => {
    const baseStatuses = ['pending', 'accepted', 'work-in-progress', 'workIsCompleted', 'completed', 'cancelled'];
    return baseStatuses.filter((status) => status !== orderData?.status);
  };

  // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ FIXED: Use helper function in renderImages
  const renderImages = (images, title) => {
    if (!images || images.length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconInfoCircle size={20} /> {title}
        </Typography>
        <ImageGrid>
          {images.map((image, index) => {
            // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Use helper function to construct proper URL
            const imageUrl = getImageUrl(image);
            
            return (
              <Badge key={index} badgeContent={index + 1} color="primary">
                <StyledImage
                  src={imageUrl}
                  alt={`${title} ${index + 1}`}
                  onClick={() => handleImageClick(image)}
                  onError={(e) => {
                    e.target.src = '/images/default-placeholder.jpg';
                  }}
                />
              </Badge>
            );
          })}
        </ImageGrid>
      </Box>
    );
  };

  if (loading) {
    return (
      <PageContainer title="Loading Order..." description="Fetching order details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading order details...
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Error" description="Error loading order">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Alert severity="error" sx={{ maxWidth: 500 }}>
            <Typography variant="h6">Error Loading Order</Typography>
            <Typography>{error}</Typography>
            <Button onClick={fetchOrderData} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Alert>
        </Box>
      </PageContainer>
    );
  }

  if (!orderData) {
    return (
      <PageContainer title="Order Not Found" description="Order not found">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Alert severity="warning">
            <Typography variant="h6">Order not found</Typography>
            <Typography>The requested order could not be found.</Typography>
          </Alert>
        </Box>
      </PageContainer>
    );
  }

  const breakdown = calculateBreakdown(orderData.totalAmount);

  return (
    <PageContainer
      title={`Order Details - ${orderData.orderId}`}
      description={`View detailed information about order ${orderData.orderId}`}
    >
      <Breadcrumb title="Order Details" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <StyledCard>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
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
                <Typography variant="h4" fontWeight="700" color="primary">
                  {orderData.orderId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Order placed on  {orderData.orderDate} at {orderData.orderTime}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <StatusChip
                label={orderData.status.replace(/-/g, ' ')}
                status={orderData.status}
                size="medium"
              />
              <PriorityChip
                label={`${orderData.priority.toUpperCase()} PRIORITY`}
                priority={orderData.priority}
                size="medium"
              />
              <Chip
                label={`Source: ${orderData.sourceOfLead.toUpperCase()}`}
                variant="outlined"
                size="medium"
              />
            </Box>
          </Box>
        </CardContent>
      </StyledCard>

      <Grid container spacing={3}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Service Details */}
          <StyledCard>
            <CardHeader
              title="Service Details"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              avatar={<IconReceipt color={theme.palette.primary.main} />}
            />
            <CardContent>
    <Grid container spacing={3}>
  <Grid item xs={12} md={4}>
    <Paper
      sx={{
        height: 120,
        backgroundImage: `url("${orderData.serviceImage}")`, 
        backgroundSize: 'cover', // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Makes image cover the entire container
        backgroundPosition: 'center', // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Centers the image
        backgroundRepeat: 'no-repeat', // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Prevents image repetition
        borderRadius: 2,
        display: 'flex',
        alignItems: 'flex-end',
        p: 1,
      }}
    >
      <Chip
        label={orderData.serviceCategory}
        size="small"
        sx={{ background: 'rgba(255,255,255,0.9)' }}
      />
    </Paper>
  </Grid>
  <Grid item xs={12} md={8}>
    <Typography variant="h6" gutterBottom>
      {orderData.serviceName}
    </Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {orderData.serviceSubcategory}
    </Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>
      {orderData.serviceDescription}
    </Typography>
  </Grid>
</Grid>


              {/* Rate Cards */}
              {orderData.ratecards.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <IconInfoCircle size={20} /> Service Items
                  </Typography>
                  {orderData.ratecards.map((item, index) => (
                    <InfoRow key={index}>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {item.rateCardTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SKU: {item._id}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="600" color="primary">
                        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{item.rateCardPrice}
                      </Typography>
                    </InfoRow>
                  ))}
                </Box>
              )}

              {/* Estimation Details */}
   {orderData.estimation && (
  <Box sx={{ mt: 3 }}>
    <Typography
      variant="h6"
      gutterBottom
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      <IconReceipt size={20} /> Estimation Details
    </Typography>
    <Alert severity="info" sx={{ mb: 2 }}>
      <Typography variant="body2">
        Estimation provided on {formatDate(orderData.estimation.date)} at {orderData.estimation.time}
      </Typography>
    </Alert>
    
    {orderData.estimation.ratedCards && orderData.estimation.ratedCards.length > 0 && (
      <Box>
        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
          Estimated Items:
        </Typography>
        {orderData.estimation.ratedCards.map((item, index) => (
          <InfoRow key={index}>
            <Typography variant="body2">{item.title}</Typography>
            <Typography variant="body2" fontWeight="600">
              ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{item.price}
            </Typography>
          </InfoRow>
        ))}
        <Divider sx={{ my: 1 }} />
        <InfoRow>
          <Typography variant="body2" fontWeight="600">
            Total Estimated Amount
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="700">
            ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{orderData.estimation.totalAmount}
          </Typography>
        </InfoRow>
      </Box>
    )}

    {/* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ ADD THIS: Display Estimation Images */}
    {orderData.estimation.images && orderData.estimation.images.length > 0 && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
          Estimation Images:
        </Typography>
        <ImageGrid>
          {orderData.estimation.images.map((image, index) => {
            const imageUrl = getImageUrl(image);
            return (
              <Badge key={index} badgeContent={index + 1} color="primary">
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      border: '2px solid #1976d2',
                    },
                  }}
                  onClick={() => handleImageClick(image)}
                >
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={`Estimation ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src = '/images/default-placeholder.jpg';
                    }}
                  />
                </Box>
              </Badge>
            );
          })}
        </ImageGrid>
      </Box>
    )}
  </Box>
)}

              {/* Special Instructions */}
              {orderData.specialInstructions !== 'No special instructions' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Special Instructions:</strong> {orderData.specialInstructions}
                  </Typography>
                </Alert>
              )}

              {/* Cancellation Reason */}
              {orderData.status === 'cancelled' && orderData.rejectedReason && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Cancellation Reason:</strong> {orderData.rejectedReason}
                  </Typography>
                </Alert>
              )}

              {/* Render Images */}
              {renderImages(orderData.estimationImages, 'Estimation Images')}
              {renderImages(orderData.bookingImages, 'Booking Images')}
            </CardContent>
          </StyledCard>

          {/* Customer Information */}
          <StyledCard>
            <CardHeader
              title="Customer Information"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              avatar={<IconUser color={theme.palette.primary.main} />}
              action={
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<IconPhone size={16} />}
                  onClick={handleCallCustomer}
                  disabled={!orderData.customerPhone || orderData.customerPhone === 'N/A'}
                >
                  Call Customer
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {orderData.customerName}
                    </Typography>
                  </InfoRow>
                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {orderData.customerPhone}
                    </Typography>
                  </InfoRow>
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {orderData.customerEmail}
                    </Typography>
                  </InfoRow>
                  <InfoRow>
                    <Typography variant="body2" color="text.secondary">
                      Address Type
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {orderData.userAddress?.type || 'Home'}
                    </Typography>
                  </InfoRow>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconMapPin size={16} /> Service Address:
                </Typography>
                <Typography variant="body2">{orderData.customerAddress}</Typography>
              </Box>
            </CardContent>
          </StyledCard>

          {/* Service Provider Information */}
          {/* <StyledCard>
            <CardHeader
              title="Service Provider"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              avatar={<IconUser color={theme.palette.primary.main} />}
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconPhone size={16} />}
                  onClick={handleCallProvider}
                  disabled={!orderData.providerPhone || orderData.providerPhone === 'N/A'}
                >
                  Call Provider
                </Button>
              }
            />
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={orderData.providerImage}
                  alt={orderData.providerName}
                  sx={{ width: 60, height: 60 }}
                >
                  {orderData.providerName.charAt(0).toUpperCase()}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="600">
                    {orderData.providerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderData.providerPhone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderData.providerEmail}
                  </Typography>
                  {orderData.providerRating > 0 && (
                    <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                      <IconStar size={16} color={theme.palette.warning.main} />
                      <Typography variant="body2" fontWeight="600">
                        {orderData.providerRating} Rating
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Chip
                  label={orderData.providerName === 'Not assigned' ? 'Unassigned' : 'Assigned'}
                  color={orderData.providerName === 'Not assigned' ? 'default' : 'success'}
                />
              </Box>
            </CardContent>
          </StyledCard> */}
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Order Timeline */}
          <StyledCard>
            <CardHeader
              title="Order Timeline"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              avatar={<IconClock color={theme.palette.primary.main} />}
            />
            <CardContent>
              <Timeline>
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

          {/* Billing Information */}
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
                  <Typography variant="body2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{breakdown.serviceFee.toFixed(2)}</Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Platform Fee" />
                  <Typography variant="body2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{breakdown.platformFee.toFixed(2)}</Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Taxes & Fees" />
                  <Typography variant="body2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{breakdown.taxes.toFixed(2)}</Typography>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Total Amount" />
                  <Typography variant="h6" fontWeight="600" color="primary">
                    ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{breakdown.total.toFixed(2)}
                  </Typography>
                </ListItem>
                {/* <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Payment Status" />
                  <Chip
                    label={orderData.paymentStatus}
                    size="small"
                    color={orderData.paymentStatus === 'paid' ? 'success' : 'warning'}
                  />
                </ListItem> */}
                <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Payment Status" />
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={orderData.paymentStatus}
                    size="small"
                    color={
                      orderData.paymentStatus === 'completed' 
                        ? 'success' 
                        : orderData.paymentStatus === 'cancelled'
                        ? 'error'
                        : 'warning'
                    }
                  />
                  <IconEdit 
                    size={16} 
                    style={{ cursor: 'pointer', color: theme.palette.primary.main }}
                    onClick={handleUpdatePaymentStatus}
                  />
                </Box>
              </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Payment Method" />
                  <Typography variant="body2">{orderData.paymentMethod}</Typography>
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>

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
                >
                  Update Status
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<IconPhone />}
                  onClick={handleCallCustomer}
                  disabled={!orderData.customerPhone || orderData.customerPhone === 'N/A'}
                >
                  Call Customer
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<IconPhone />}
                  onClick={handleCallProvider}
                  disabled={!orderData.providerPhone || orderData.providerPhone === 'N/A'}
                >
                  Call Provider
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<IconDownload />}
                  onClick={handleDownloadInvoice}
                >
                  Download Invoice
                </Button>
              </Box>
            </CardContent>
          </StyledCard>

          {/* Order Metadata */}
          <StyledCard>
            <CardHeader
              title="Order Information"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <CardContent>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {orderData.orderId}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  Zone
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {orderData.zone}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {orderData.lastUpdated}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  Scheduled Date
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {orderData.bookedDate} {orderData.bookedTime}
                </Typography>
              </InfoRow>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Status Update Modal */}
      <Dialog
        open={openStatusModal}
        onClose={() => !updating && setOpenStatusModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom fontWeight="600">
                Current Status:
                <StatusChip
                  label={orderData?.status.replace(/-/g, ' ')}
                  status={orderData?.status}
                  size="small"
                  sx={{ ml: 1 }}
                />
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
                <MenuItem value="">Select New Status</MenuItem>
                {getStatusOptions().map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace(/-/g, ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Comments (Optional)
              </Typography>
              <TextField
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Add comments about this status change..."
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
            disabled={updating || !newStatus}
            startIcon={updating ? <CircularProgress size={16} /> : null}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'relative' }}>
            <img
              src={selectedImage}
              alt="Preview"
              style={{ 
                width: '100%', 
                height: 'auto', 
                borderRadius: 8,
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = '/images/default-placeholder.jpg';
                toast.error('Failed to load image');
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained"
            startIcon={<IconDownload />}
            onClick={() => {
              const link = document.createElement('a');
              link.href = selectedImage;
              link.download = `image-${Date.now()}.jpg`;
              link.click();
              toast.success('Image download started');
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
      {/* Payment Status Update Modal */}
<Dialog
  open={openPaymentStatusModal}
  onClose={() => !updatingPaymentStatus && setOpenPaymentStatusModal(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Update Payment Status</DialogTitle>
  <DialogContent>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <Typography variant="body2" gutterBottom fontWeight="600">
          Current Payment Status:
          <Chip
            label={orderData?.paymentStatus}
            size="small"
            color={
              orderData?.paymentStatus === 'completed' 
                ? 'success' 
                : orderData?.paymentStatus === 'cancelled'
                ? 'error'
                : 'warning'
            }
            sx={{ ml: 1 }}
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" gutterBottom>
          New Payment Status *
        </Typography>
        <Select
          value={newPaymentStatus}
          onChange={(e) => setNewPaymentStatus(e.target.value)}
          fullWidth
          displayEmpty
        >
          <MenuItem value="">Select Payment Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="info">
          <Typography variant="body2">
            Order ID: <strong>{orderData?.orderId}</strong>
          </Typography>
          <Typography variant="body2">
            Total Amount: <strong>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{orderData?.totalAmount}</strong>
          </Typography>
          <Typography variant="body2">
            Payment Method: <strong>{orderData?.paymentMethod}</strong>
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions sx={{ p: 3 }}>
    <Button 
      onClick={() => setOpenPaymentStatusModal(false)} 
      disabled={updatingPaymentStatus}
    >
      Cancel
    </Button>
    <Button
      onClick={handlePaymentStatusUpdate}
      variant="contained"
      disabled={updatingPaymentStatus || !newPaymentStatus}
      startIcon={updatingPaymentStatus ? <CircularProgress size={16} /> : null}
    >
      {updatingPaymentStatus ? 'Updating...' : 'Update Payment Status'}
    </Button>
  </DialogActions>
</Dialog>

    </PageContainer>
  );
};

export default ViewOrder;



// import React, { useState, useEffect } from 'react';
// import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
// import PageContainer from 'src/components/container/PageContainer';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { URLS } from '../../../Url';
// import axios from 'axios';
// import {
//   IconArrowLeft,
//   IconPhone,
//   IconCalendar,
//   IconUser,
//   IconStar,
//   IconCheck,
//   IconEdit,
//   IconDownload,
//   IconTruck,
//   IconInfoCircle,
//   IconReceipt,
// } from '@tabler/icons-react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Avatar,
//   Chip,
//   Button,
//   Divider,
//   Card,
//   CardContent,
//   CardHeader,
//   List,
//   ListItem,
//   ListItemText,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Select,
//   MenuItem,
//   TextField,
//   Alert,
//   styled,
//   CircularProgress,
//   Paper,
// } from '@mui/material';
// import {
//   Timeline,
//   TimelineItem,
//   TimelineSeparator,
//   TimelineConnector,
//   TimelineContent,
//   TimelineDot,
// } from '@mui/lab';
// import { useTheme } from '@mui/material/styles';

// const BCrumb = [
//   { to: '/', title: 'Home' },
//   { to: '/ondemandservice/verified-partners/accepted', title: 'Accepted Orders' },
//   { title: 'Order Details' },
// ];

// // Styled Components
// const StyledCard = styled(Card)(({ theme }) => ({
//   marginBottom: theme.spacing(3),
//   borderRadius: '12px',
//   boxShadow: theme.shadows[2],
//   border: `1px solid ${theme.palette.divider}`,
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     boxShadow: theme.shadows[4],
//   },
// }));

// const StatusChip = styled(Chip)(({ theme, status }) => ({
//   fontWeight: 700,
//   borderRadius: '6px',
//   textTransform: 'capitalize',
//   ...(status === 'accepted' && {
//     backgroundColor: theme.palette.success.light,
//     color: theme.palette.success.dark,
//   }),
//   ...(status === 'pending' && {
//     backgroundColor: theme.palette.warning.light,
//     color: theme.palette.warning.dark,
//   }),
//   ...(status === 'completed' && {
//     backgroundColor: theme.palette.info.light,
//     color: theme.palette.info.dark,
//   }),
//   ...(status === 'work-in-progress' && {
//     backgroundColor: theme.palette.primary.light,
//     color: theme.palette.primary.dark,
//   }),
//   ...(status === 'cancelled' && {
//     backgroundColor: theme.palette.error.light,
//     color: theme.palette.error.dark,
//   }),
// }));

// const PriorityChip = styled(Chip)(({ theme, priority }) => ({
//   fontWeight: 600,
//   borderRadius: '6px',
//   ...(priority === 'high' && {
//     backgroundColor: theme.palette.error.light,
//     color: theme.palette.error.dark,
//   }),
//   ...(priority === 'medium' && {
//     backgroundColor: theme.palette.warning.light,
//     color: theme.palette.warning.dark,
//   }),
//   ...(priority === 'low' && {
//     backgroundColor: theme.palette.info.light,
//     color: theme.palette.info.dark,
//   }),
// }));

// const InfoRow = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: theme.spacing(1, 0),
//   borderBottom: `1px solid ${theme.palette.divider}`,
//   '&:last-child': {
//     borderBottom: 'none',
//   },
// }));

// const ViewOrder = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const { orderId } = useParams();
//   const [orderData, setOrderData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openStatusModal, setOpenStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [statusComment, setStatusComment] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const authData = JSON.parse(localStorage.getItem('user'));
//   const token = authData?.token;

//   const fetchOrderData = async () => {
//     if (!orderId) {
//       setError('Missing order ID');
//       setLoading(false);
//       return;
//     }
//     if (!token) {
//       setError('Missing authentication token');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(
//         URLS.GetServiceCrmBookingsById,
//         { id: orderId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (response.data.success && response.data.data) {
//         const booking = response.data.data;
//         transformOrderData(booking);
//       } else {
//         setError('Failed to fetch order details');
//         toast.error('Failed to load order details');
//       }
//     } catch (error) {
//       console.error('Error fetching order:', error);
//       setError(error.response?.data?.message || 'Failed to fetch order details');
//       toast.error('Failed to load order details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformOrderData = (booking) => {
//     const transformedData = {
//       // Basic Order Info
//       _id: booking._id,
//       orderId: booking.orderId || 'N/A',
//       status: booking.status || 'pending',
//       priority: booking.priority || 'medium',
//       paymentStatus: booking.paymentStatus || 'pending',
//       paymentMethod: booking.paymentMethod || 'Not specified',

//       // Customer Information
//       customerName: booking.userAddress?.userName || 'N/A',
//       customerPhone: booking.userAddress?.phone || 'N/A',
//       customerEmail: booking.userAddress?.email || 'N/A',
//       customerAddress: formatAddress(booking.userAddress),

//       // Service Information
//       serviceName: booking.ondemandservicesDetails?.name || 'N/A',
//       serviceCategory: booking.ondemandservicesDetails?.categoryName || 'N/A',
//       serviceSubcategory: booking.ondemandservicesDetails?.subcategoryName || 'N/A',
//       serviceDescription: booking.ondemandservicesDetails?.description
//         ? booking.ondemandservicesDetails.description.replace(/<[^>]*>/g, '').substring(0, 200) +
//           '...'
//         : 'No description available',
//       serviceImage:
//         booking.ondemandservicesDetails?.mainImage || '/images/services/default-service.jpg',

//       // Rate Cards/Items
//       ratecards: booking.ratecardDetails || [],
//       totalAmount: booking.amount || 0,

//       // Timeline and Dates
//       orderDate: formatDate(booking.logCreatedDate),
//       orderTime: formatTime(booking.logCreatedDate),
//       lastUpdated: formatDateTime(booking.logModifiedDate),
//       bookedDate: booking.bookedDate || 'Not scheduled',
//       bookedTime: booking.bookedTime || 'Not scheduled',

//       // Additional Info
//       specialInstructions:
//         booking.statusTextMessage || booking.addMoreInfo || 'No special instructions',
//       sourceOfLead: booking.sourceOfLead || 'N/A',
//       zone: booking.zoneId || 'N/A',

//       // Service Provider Info (if available)
//       providerName: booking.providerName || 'Not assigned',
//       providerImage: booking.providerImage || '/images/profile/default-avatar.jpg',
//       providerRating: booking.providerRating || 0,
//       providerPhone: booking.providerPhone || 'N/A',

//       // Timeline
//       orderTimeline: generateOrderTimeline(booking),
//     };

//     setOrderData(transformedData);
//   };

//   const formatAddress = (address) => {
//     if (!address) return 'Address not available';

//     const parts = [
//       address.flat,
//       address.addressLineOne,
//       address.addressLineTwo,
//       address.area,
//       address.cityName,
//       address.stateName,
//       address.postalCode,
//     ].filter(Boolean);

//     return parts.join(', ');
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN');
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString('en-IN');
//   };

//   const generateOrderTimeline = (booking) => {
//     const timeline = [];

//     // Order placed
//     timeline.push({
//       status: 'placed',
//       timestamp: formatDateTime(booking.logCreatedDate),
//       description: 'Order placed by customer',
//       icon: IconCheck,
//       color: 'success',
//     });

//     // Current status
//     if (booking.status !== 'pending') {
//       timeline.push({
//         status: booking.status,
//         timestamp: formatDateTime(booking.logModifiedDate),
//         description: `Order ${booking.status}`,
//         icon:
//           booking.status === 'accepted'
//             ? IconCheck
//             : booking.status === 'work-in-progress'
//             ? IconTruck
//             : booking.status === 'completed'
//             ? IconCheck
//             : IconInfoCircle,
//         color:
//           booking.status === 'accepted'
//             ? 'success'
//             : booking.status === 'work-in-progress'
//             ? 'info'
//             : booking.status === 'completed'
//             ? 'success'
//             : 'warning',
//       });
//     }

//     // Scheduled date if available
//     if (booking.bookedDate) {
//       timeline.push({
//         status: 'scheduled',
//         timestamp: `${booking.bookedDate} ${booking.bookedTime || ''}`,
//         description: 'Service scheduled',
//         icon: IconCalendar,
//         color: 'info',
//       });
//     }

//     return timeline;
//   };

//   const calculateBreakdown = (totalAmount) => {
//     const serviceFee = totalAmount * 0.85;
//     const platformFee = totalAmount * 0.1;
//     const taxes = totalAmount * 0.05;

//     return { serviceFee, platformFee, taxes };
//   };

//   useEffect(() => {
//     fetchOrderData();
//   }, [orderId, token]);

//   const handleBackClick = () => {
//     navigate(-1);
//   };

//   const handleCallCustomer = () => {
//     if (orderData?.customerPhone && orderData.customerPhone !== 'N/A') {
//       window.open(`tel:${orderData.customerPhone}`);
//     } else {
//       toast.info('Customer phone number not available');
//     }
//   };

//   const handleUpdateStatus = () => {
//     setOpenStatusModal(true);
//     setNewStatus(orderData?.status || '');
//   };

//   const handleStatusUpdate = async () => {
//     if (!newStatus) {
//       toast.error('Please select a status');
//       return;
//     }

//     setUpdating(true);
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       toast.success('Order status updated successfully');
//       setOpenStatusModal(false);
//       setNewStatus('');
//       setStatusComment('');
//       // Refresh data
//       fetchOrderData();
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update order status');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleDownloadInvoice = () => {
//     toast.info('Invoice download feature will be implemented soon');
//   };

//   const getStatusOptions = () => {
//     const baseStatuses = ['pending', 'accepted', 'work-in-progress', 'completed', 'cancelled'];
//     return baseStatuses.filter((status) => status !== orderData?.status);
//   };

//   if (loading) {
//     return (
//       <PageContainer title="Loading Order..." description="Fetching order details">
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//           <CircularProgress />
//           <Typography variant="h6" sx={{ ml: 2 }}>
//             Loading order details...
//           </Typography>
//         </Box>
//       </PageContainer>
//     );
//   }

//   if (error) {
//     return (
//       <PageContainer title="Error" description="Error loading order">
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//           <Alert severity="error" sx={{ maxWidth: 500 }}>
//             <Typography variant="h6">Error Loading Order</Typography>
//             <Typography>{error}</Typography>
//             <Button onClick={fetchOrderData} sx={{ mt: 2 }}>
//               Retry
//             </Button>
//           </Alert>
//         </Box>
//       </PageContainer>
//     );
//   }

//   if (!orderData) {
//     return (
//       <PageContainer title="Order Not Found" description="Order not found">
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//           <Alert severity="warning">
//             <Typography variant="h6">Order not found</Typography>
//             <Typography>The requested order could not be found.</Typography>
//           </Alert>
//         </Box>
//       </PageContainer>
//     );
//   }

//   const breakdown = calculateBreakdown(orderData.totalAmount);

//   return (
//     <PageContainer
//       title={`Order Details - ${orderData.orderId}`}
//       description={`View detailed information about order ${orderData.orderId}`}
//     >
//       <Breadcrumb title="Order Details" items={BCrumb} />
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Header Section */}
//       <StyledCard>
//         <CardContent>
//           <Box
//             display="flex"
//             alignItems="center"
//             justifyContent="space-between"
//             flexWrap="wrap"
//             gap={2}
//           >
//             <Box display="flex" alignItems="center" gap={2}>
//               <Button
//                 variant="outlined"
//                 startIcon={<IconArrowLeft />}
//                 onClick={handleBackClick}
//                 sx={{ borderRadius: 2 }}
//               >
//                 Back
//               </Button>
//               <Box>
//                 <Typography variant="h4" fontWeight="700" color="primary">
//                   {orderData.orderId}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Order placed on {orderData.orderDate} at {orderData.orderTime}
//                 </Typography>
//               </Box>
//             </Box>
//             <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
//               <StatusChip
//                 label={orderData.status.replace(/-/g, ' ')}
//                 status={orderData.status}
//                 size="medium"
//               />
//               <PriorityChip
//                 label={`${orderData.priority.toUpperCase()} PRIORITY`}
//                 priority={orderData.priority}
//                 size="medium"
//               />
//               <Chip
//                 label={`Source: ${orderData.sourceOfLead.toUpperCase()}`}
//                 variant="outlined"
//                 size="medium"
//               />
//             </Box>
//           </Box>
//         </CardContent>
//       </StyledCard>

//       <Grid container spacing={3}>
//         {/* Left Column - Main Content */}
//         <Grid item xs={12} lg={8}>
//           {/* Service Details */}
//           <StyledCard>
//             <CardHeader
//               title="Service Details"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
//               avatar={<IconReceipt color={theme.palette.primary.main} />}
//             />
//             <CardContent>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={4}>
//                   <Paper
//                     sx={{
//                       height: 120,
//                       background: `url(${orderData.serviceImage}) center/cover`,
//                       borderRadius: 2,
//                       display: 'flex',
//                       alignItems: 'flex-end',
//                       p: 1,
//                     }}
//                   >
//                     <Chip
//                       label={orderData.serviceCategory}
//                       size="small"
//                       sx={{ background: 'rgba(255,255,255,0.9)' }}
//                     />
//                   </Paper>
//                 </Grid>
//                 <Grid item xs={12} md={8}>
//                   <Typography variant="h6" gutterBottom>
//                     {orderData.serviceName}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" gutterBottom>
//                     {orderData.serviceSubcategory}
//                   </Typography>
//                   <Typography variant="body2" sx={{ mt: 1 }}>
//                     {orderData.serviceDescription}
//                   </Typography>
//                 </Grid>
//               </Grid>

//               {/* Rate Cards */}
//               {orderData.ratecards.length > 0 && (
//                 <Box sx={{ mt: 3 }}>
//                   <Typography
//                     variant="h6"
//                     gutterBottom
//                     sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
//                   >
//                     <IconInfoCircle size={20} /> Service Items
//                   </Typography>
//                   {orderData.ratecards.map((item, index) => (
//                     <InfoRow key={index}>
//                       <Box>
//                         <Typography variant="body2" fontWeight="600">
//                           {item.rateCardTitle}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           SKU: {item._id}
//                         </Typography>
//                       </Box>
//                       <Typography variant="body2" fontWeight="600" color="primary">
//                         ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{item.rateCardPrice}
//                       </Typography>
//                     </InfoRow>
//                   ))}
//                 </Box>
//               )}

//               {/* Special Instructions */}
//               {orderData.specialInstructions !== 'No special instructions' && (
//                 <Alert severity="info" sx={{ mt: 2 }}>
//                   <Typography variant="body2">
//                     <strong>Special Instructions:</strong> {orderData.specialInstructions}
//                   </Typography>
//                 </Alert>
//               )}
//             </CardContent>
//           </StyledCard>

//           {/* Customer Information */}
//           <StyledCard>
//             <CardHeader
//               title="Customer Information"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
//               avatar={<IconUser color={theme.palette.primary.main} />}
//               action={
//                 <Button
//                   variant="contained"
//                   size="small"
//                   startIcon={<IconPhone size={16} />}
//                   onClick={handleCallCustomer}
//                   disabled={!orderData.customerPhone || orderData.customerPhone === 'N/A'}
//                 >
//                   Call Customer
//                 </Button>
//               }
//             />
//             <CardContent>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">
//                       Full Name
//                     </Typography>
//                     <Typography variant="body2" fontWeight="600">
//                       {orderData.customerName}
//                     </Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">
//                       Phone
//                     </Typography>
//                     <Typography variant="body2" fontWeight="600">
//                       {orderData.customerPhone}
//                     </Typography>
//                   </InfoRow>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">
//                       Email
//                     </Typography>
//                     <Typography variant="body2" fontWeight="600">
//                       {orderData.customerEmail}
//                     </Typography>
//                   </InfoRow>
//                   <InfoRow>
//                     <Typography variant="body2" color="text.secondary">
//                       Address Type
//                     </Typography>
//                     <Typography variant="body2" fontWeight="600">
//                       Home
//                     </Typography>
//                   </InfoRow>
//                 </Grid>
//               </Grid>
//               <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
//                 <Typography variant="body2" fontWeight="600" gutterBottom>
//                   Service Address:
//                 </Typography>
//                 <Typography variant="body2">{orderData.customerAddress}</Typography>
//               </Box>
//             </CardContent>
//           </StyledCard>

//           {/* Service Provider Information */}
//           <StyledCard>
//             <CardHeader
//               title="Service Provider"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
//               avatar={<IconUser color={theme.palette.primary.main} />}
//             />
//             <CardContent>
//               <Box display="flex" alignItems="center" gap={2}>
//                 <Avatar
//                   src={orderData.providerImage}
//                   alt={orderData.providerName}
//                   sx={{ width: 60, height: 60 }}
//                 >
//                   {orderData.providerName.charAt(0).toUpperCase()}
//                 </Avatar>
//                 <Box flex={1}>
//                   <Typography variant="h6" fontWeight="600">
//                     {orderData.providerName}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {orderData.providerPhone}
//                   </Typography>
//                   {orderData.providerRating > 0 && (
//                     <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
//                       <IconStar size={16} color={theme.palette.warning.main} />
//                       <Typography variant="body2" fontWeight="600">
//                         {orderData.providerRating} Rating
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//                 <Chip
//                   label={orderData.providerName === 'Not assigned' ? 'Unassigned' : 'Assigned'}
//                   color={orderData.providerName === 'Not assigned' ? 'default' : 'success'}
//                 />
//               </Box>
//             </CardContent>
//           </StyledCard>
//         </Grid>

//         {/* Right Column - Sidebar */}
//         <Grid item xs={12} lg={4}>
//           {/* Order Timeline */}
//           <StyledCard>
//             <CardHeader
//               title="Order Timeline"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
//             />
//             <CardContent>
//               <Timeline>
//                 {orderData.orderTimeline.map((item, index) => (
//                   <TimelineItem key={index}>
//                     <TimelineSeparator>
//                       <TimelineDot color={item.color}>
//                         <item.icon size={16} />
//                       </TimelineDot>
//                       {index < orderData.orderTimeline.length - 1 && <TimelineConnector />}
//                     </TimelineSeparator>
//                     <TimelineContent>
//                       <Typography variant="body2" fontWeight="600">
//                         {item.description}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {item.timestamp}
//                       </Typography>
//                     </TimelineContent>
//                   </TimelineItem>
//                 ))}
//               </Timeline>
//             </CardContent>
//           </StyledCard>

//           {/* Billing Information */}
//           <StyledCard>
//             <CardHeader
//               title="Billing Summary"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
//               action={
//                 <Button
//                   variant="outlined"
//                   size="small"
//                   startIcon={<IconDownload size={16} />}
//                   onClick={handleDownloadInvoice}
//                 >
//                   Invoice
//                 </Button>
//               }
//             />
//             <CardContent>
//               <List dense>
//                 <ListItem sx={{ px: 0 }}>
//                   <ListItemText primary="Service Fee" />
//                   <Typography variant="body2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{breakdown.serviceFee.toFixed(2)}</Typography>
//                 </ListItem>
//                 <ListItem sx={{ px: 0 }}>
//                   <ListItemText primary="Platform Fee" />
//                   <Typography variant="body2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{breakdown.platformFee.toFixed(2)}</Typography>
//                 </ListItem>
//                 <ListItem sx={{ px: 0 }}>
//                   <ListItemText primary="Taxes & Fees" />
//                   <Typography variant="body2">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{breakdown.taxes.toFixed(2)}</Typography>
//                 </ListItem>
//                 <Divider sx={{ my: 1 }} />
//                 <ListItem sx={{ px: 0 }}>
//                   <ListItemText primary="Total Amount" />
//                   <Typography variant="h6" fontWeight="600" color="primary">
//                     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹{orderData.totalAmount.toFixed(2)}
//                   </Typography>
//                 </ListItem>
//                 <ListItem sx={{ px: 0 }}>
//                   <ListItemText primary="Payment Status" />
//                   <Chip
//                     label={orderData.paymentStatus}
//                     size="small"
//                     color={orderData.paymentStatus === 'paid' ? 'success' : 'warning'}
//                   />
//                 </ListItem>
//                 <ListItem sx={{ px: 0 }}>
//                   <ListItemText primary="Payment Method" />
//                   <Typography variant="body2">{orderData.paymentMethod}</Typography>
//                 </ListItem>
//               </List>
//             </CardContent>
//           </StyledCard>

//           {/* Quick Actions */}
//           <StyledCard>
//             <CardHeader
//               title="Quick Actions"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
//             />
//             <CardContent>
//               <Box display="flex" flexDirection="column" gap={2}>
//                 <Button
//                   variant="contained"
//                   fullWidth
//                   startIcon={<IconEdit />}
//                   onClick={handleUpdateStatus}
//                 >
//                   Update Status
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   fullWidth
//                   startIcon={<IconPhone />}
//                   onClick={handleCallCustomer}
//                   disabled={!orderData.customerPhone || orderData.customerPhone === 'N/A'}
//                 >
//                   Call Customer
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   fullWidth
//                   startIcon={<IconDownload />}
//                   onClick={handleDownloadInvoice}
//                 >
//                   Download Invoice
//                 </Button>
//               </Box>
//             </CardContent>
//           </StyledCard>

//           {/* Order Metadata */}
//           <StyledCard>
//             <CardHeader
//               title="Order Information"
//               titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
//             />
//             <CardContent>
//               <InfoRow>
//                 <Typography variant="body2" color="text.secondary">
//                   Order ID
//                 </Typography>
//                 <Typography variant="body2" fontWeight="600">
//                   {orderData.orderId}
//                 </Typography>
//               </InfoRow>
//               <InfoRow>
//                 <Typography variant="body2" color="text.secondary">
//                   Zone
//                 </Typography>
//                 <Typography variant="body2" fontWeight="600">
//                   {orderData.zoneName}
//                 </Typography>
//               </InfoRow>
//               <InfoRow>
//                 <Typography variant="body2" color="text.secondary">
//                   Last Updated
//                 </Typography>
//                 <Typography variant="body2" fontWeight="600">
//                   {orderData.lastUpdated}
//                 </Typography>
//               </InfoRow>
//               <InfoRow>
//                 <Typography variant="body2" color="text.secondary">
//                   Scheduled Date
//                 </Typography>
//                 <Typography variant="body2" fontWeight="600">
//                   {orderData.bookedDate}
//                 </Typography>
//               </InfoRow>
//             </CardContent>
//           </StyledCard>
//         </Grid>
//       </Grid>

//       {/* Status Update Modal */}
//       <Dialog
//         open={openStatusModal}
//         onClose={() => !updating && setOpenStatusModal(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Update Order Status</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <Typography variant="body2" gutterBottom fontWeight="600">
//                 Current Status:
//                 <StatusChip
//                   label={orderData?.status.replace(/-/g, ' ')}
//                   status={orderData?.status}
//                   size="small"
//                   sx={{ ml: 1 }}
//                 />
//               </Typography>
//             </Grid>
//             <Grid item xs={12}>
//               <Typography variant="body2" gutterBottom>
//                 New Status *
//               </Typography>
//               <Select
//                 value={newStatus}
//                 onChange={(e) => setNewStatus(e.target.value)}
//                 fullWidth
//                 displayEmpty
//               >
//                 <MenuItem value="">Select New Status</MenuItem>
//                 {getStatusOptions().map((status) => (
//                   <MenuItem key={status} value={status}>
//                     {status.replace(/-/g, ' ').toUpperCase()}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>
//             <Grid item xs={12}>
//               <Typography variant="body2" gutterBottom>
//                 Comments (Optional)
//               </Typography>
//               <TextField
//                 value={statusComment}
//                 onChange={(e) => setStatusComment(e.target.value)}
//                 placeholder="Add comments about this status change..."
//                 multiline
//                 rows={3}
//                 fullWidth
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions sx={{ p: 3 }}>
//           <Button onClick={() => setOpenStatusModal(false)} disabled={updating}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleStatusUpdate}
//             variant="contained"
//             disabled={updating || !newStatus}
//             startIcon={updating ? <CircularProgress size={16} /> : null}
//           >
//             {updating ? 'Updating...' : 'Update Status'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </PageContainer>
//   );
// };

