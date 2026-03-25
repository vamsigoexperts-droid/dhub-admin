import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconChefHat, IconStar, IconThermometer, IconReceipt, IconMotorbike } from '@tabler/icons-react';
import PageContainer from '../../../components/container/PageContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import {
  TextField,
  Avatar,
  Paper,
  Box,
  Typography,
  Divider,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  styled,
  Select,
  MenuItem,
  DialogActions,
  Card,
  CardActionArea,
  Rating,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, NavLink } from 'react-router-dom';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Completed Orders - Food' }
];

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  '&.active': {
    '& .status-card': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light + '10',
    },
    '& .status-label': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    }
  }
}));

const StatusCard = styled(Card)(({ theme }) => ({
  height: '50px',
  border: `2px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

// Mock Data for Completed Food Orders
const completedOrdersData = [
  {
    _id: '1',
    orderId: 'FOOD-ORD-2024-005',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43213',
    customerEmail: 'rajesh.kumar@email.com',
    restaurantName: 'Bangalore Biriyani House',
    restaurantImage: '/images/restaurants/biriyanihouse.jpg',
    deliveryPartnerName: 'Suresh (Bike: KA-01-AB-1234)',
    chefName: 'Chef Mohammed Ali',
    cuisineType: 'Hyderabadi',
    orderType: 'Mutton Biryani Family Pack',
    totalItems: 6,
    orderDate: '2024-08-15',
    orderTime: '8:00 PM',
    orderValue: 1950.00,
    location: 'Indiranagar, Bangalore',
    status: 'completed',
    priority: 'high',
    completedAt: '2024-08-15 21:15',
    deliveryDuration: '3 hours 15 minutes',
    customerRating: 4.8,
    foodQualityRating: 5.0,
    deliveryRating: 4.5,
    customerFeedback: 'Exceptional biryani quality! Food was hot and perfectly spiced. Delivery was slightly delayed but worth the wait.',
    paymentStatus: 'processed',
    deliveryMethod: 'Hot Delivery',
    foodTemperatureOnDelivery: '65°C',
    packagingQuality: 'Excellent',
    repeatCustomer: true,
    favoriteOrder: true,
    loyaltyPointsEarned: 195,
    nextOrderDiscount: 10,
  },
  {
    _id: '2',
    orderId: 'FOOD-ORD-2024-012',
    customerName: 'Priya Nair',
    customerPhone: '+91 87654 32112',
    customerEmail: 'priya.nair@email.com',
    restaurantName: 'Green Bowl Cafe',
    restaurantImage: '/images/restaurants/greenbowl.jpg',
    deliveryPartnerName: 'Kavya (Bike: KA-05-CD-5678)',
    chefName: 'Chef Ananya Iyer',
    cuisineType: 'Healthy Continental',
    orderType: 'Vegan Buddha Bowl',
    totalItems: 3,
    orderDate: '2024-08-19',
    orderTime: '1:00 PM',
    orderValue: 650.00,
    location: 'BTM Layout, Bangalore',
    status: 'completed',
    priority: 'medium',
    completedAt: '2024-08-19 14:30',
    deliveryDuration: '1 hour 30 minutes',
    customerRating: 4.9,
    foodQualityRating: 4.8,
    deliveryRating: 5.0,
    customerFeedback: 'Fresh ingredients, perfect portion size. Love the eco-friendly packaging!',
    paymentStatus: 'processed',
    deliveryMethod: 'Eco Delivery',
    foodTemperatureOnDelivery: '45°C',
    packagingQuality: 'Eco-Friendly',
    repeatCustomer: false,
    favoriteOrder: false,
    loyaltyPointsEarned: 65,
    nextOrderDiscount: 5,
  },
];

// Updated Order status configurations with routes for Food
const orderStatusConfig = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Orders awaiting restaurant response',
    color: 'warning',
    route: '/food/pending',
  },
  {
    key: 'accepted',
    label: 'Accepted',
    description: 'Orders accepted by restaurant',
    color: 'primary',
    route: '/food/accepted',
  },
  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    description: 'Food being prepared',
    color: 'info',
    route: '/food/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Food delivered successfully',
    color: 'success',
    route: '/food/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Orders cancelled by customer',
    color: 'error',
    route: '/food/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    description: 'Orders rejected by restaurant',
    color: 'error',
    route: '/food/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    description: 'Orders not responded in time',
    color: 'secondary',
    route: '/food/missed',
  },
];

// Main Completed Orders Component for Food
const CompletedOrders = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formEdit, setFormEdit] = useState({
    _id: '',
    status: '',
    comment: '',
  });

  const navigate = useNavigate();

  // Filter data based on search
  useEffect(() => {
    if (search === '') {
      setFilteredData(completedOrdersData);
    } else {
      const filtered = completedOrdersData.filter((item) =>
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderId.toLowerCase().includes(search.toLowerCase()) ||
        item.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
        item.cuisineType.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [search]);

  const handleViewOrder = (orderData) => {
    toast.info(`Viewing order ${orderData.orderId}`);
    localStorage.setItem('orderId', orderData._id);
  };

  const handleUpdateStatus = (orderData) => {
    setFormEdit({
      _id: orderData._id,
      status: orderData.status,
      comment: '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormEdit({ _id: '', status: '', comment: '' });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditInputChange = (e) => {
    setFormEdit((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    toast.success('Order status updated successfully');
    handleCloseModal();
  };

  const getPriorityChip = (priority) => {
    const colorMap = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return (
      <Chip 
        label={priority?.toUpperCase() || 'MEDIUM'} 
        size="small" 
        color={colorMap[priority] || 'info'} 
        variant="filled" 
      />
    );
  };

  const getPaymentStatusChip = (status) => {
    const colorMap = {
      processed: 'success',
      pending: 'warning',
      failed: 'error'
    };
    return (
      <Chip 
        label={status?.toUpperCase() || 'PENDING'} 
        size="small" 
        color={colorMap[status] || 'warning'} 
        variant="outlined" 
      />
    );
  };

  const getDeliveryMethodChip = (method) => {
    const colorMap = {
      'Hot Delivery': 'error',
      'Eco Delivery': 'success',
      'Express Delivery': 'info',
      'Standard Delivery': 'primary'
    };
    return (
      <Chip 
        label={method || 'STANDARD'} 
        size="small" 
        color={colorMap[method] || 'primary'} 
        variant="outlined" 
        icon={<IconMotorbike size={12} />}
      />
    );
  };

  const getPackagingChip = (quality) => {
    const colorMap = {
      'Excellent': 'success',
      'Eco-Friendly': 'info',
      'Good': 'primary',
      'Poor': 'error'
    };
    return (
      <Chip 
        label={quality || 'STANDARD'} 
        size="small" 
        color={colorMap[quality] || 'primary'} 
        variant="outlined" 
      />
    );
  };

  const getCustomerTypeChip = (isRepeat, isFavorite) => {
    if (isFavorite) {
      return (
        <Chip 
          label="⭐ FAVORITE" 
          size="small" 
          color="warning" 
          variant="filled" 
        />
      );
    }
    if (isRepeat) {
      return (
        <Chip 
          label="🔄 REPEAT" 
          size="small" 
          color="info" 
          variant="outlined" 
        />
      );
    }
    return (
      <Chip 
        label="🆕 NEW" 
        size="small" 
        color="secondary" 
        variant="outlined" 
      />
    );
  };

  const getRatingDisplay = (overall, food, delivery) => {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
          <Rating value={overall} readOnly size="small" />
          <Typography variant="caption" color="success.main" fontWeight="600">
            ({overall})
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Food: {food} • Delivery: {delivery}
        </Typography>
      </Box>
    );
  };

  const getTemperatureDisplay = (temp) => {
    const tempValue = parseFloat(temp?.replace('°C', ''));
    const color = tempValue >= 60 ? 'success.main' : tempValue >= 45 ? 'warning.main' : 'error.main';
    const icon = tempValue >= 60 ? '🔥' : tempValue >= 45 ? '🌡️' : '❄️';
    return (
      <Typography variant="caption" color={color} fontWeight="600" sx={{ display: 'block' }}>
        {icon} {temp}
      </Typography>
    );
  };

  const getLoyaltyDisplay = (points, discount) => {
    return (
      <Box>
        <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
          🎯 {points} points earned
        </Typography>
        <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
          💰 {discount}% next order
        </Typography>
      </Box>
    );
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S. No',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
      },
      {
        field: 'orderInfo',
        headerName: 'Order Info',
        flex: 1.3,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderId}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {params.row.orderDate} at {params.row.orderTime}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
              Delivered: {params.row.completedAt?.substring(11, 19)}
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
              Duration: {params.row.deliveryDuration}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'customerInfo',
        headerName: 'Customer Info',
        flex: 1.2,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.customerPhone}
            </Typography>
            {getCustomerTypeChip(params.row.repeatCustomer, params.row.favoriteOrder)}
          </Box>
        ),
      },
      {
        field: 'restaurantInfo',
        headerName: 'Restaurant & Delivery',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.restaurantImage}
                alt={params.row.restaurantName}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography variant="body2" fontWeight="500" sx={{ lineHeight: 1.2 }}>
                  {params.row.restaurantName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {params.row.deliveryPartnerName?.substring(0, 15)}...
                </Typography>
              </Box>
            </Box>
            {getDeliveryMethodChip(params.row.deliveryMethod)}
          </Box>
        ),
      },
      {
        field: 'orderQuality',
        headerName: 'Food Quality',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • {params.row.cuisineType}
            </Typography>
            {getTemperatureDisplay(params.row.foodTemperatureOnDelivery)}
            {getPackagingChip(params.row.packagingQuality)}
            {getRatingDisplay(
              params.row.customerRating,
              params.row.foodQualityRating,
              params.row.deliveryRating
            )}
          </Box>
        ),
      },
      {
        field: 'orderValue',
        headerName: 'Amount',
        width: 110,
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="600" color="primary">
            ₹{params.row.orderValue?.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: 'loyaltyInfo',
        headerName: 'Loyalty',
        width: 120,
        renderCell: (params) => getLoyaltyDisplay(
          params.row.loyaltyPointsEarned,
          params.row.nextOrderDiscount
        ),
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment',
        width: 110,
        renderCell: (params) => getPaymentStatusChip(params.row.paymentStatus),
      },
      {
        field: 'customerFeedback',
        headerName: 'Customer Feedback',
        flex: 1.2,
        renderCell: (params) => (
          <Typography variant="caption" sx={{ py: 1 }}>
            {params.row.customerFeedback?.substring(0, 50)}...
          </Typography>
        ),
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ py: 1 }}>
            {params.row.location}
          </Typography>
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        width: 130,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" gap={0.5} sx={{ py: 1 }}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleUpdateStatus(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              title="Manage Order"
            >
              <IconAnalyze stroke={1.5} size={16} />
            </Button>

            <Button
              size="small"
              color="info"
              variant="contained"
              onClick={() => handleViewOrder(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              title="View Order"
            >
              <IconEye size={16} />
            </Button>
          </Box>
        ),
      },
    ],
    [loading],
  );

  const rows = useMemo(
    () => filteredData?.map((item, index) => ({ id: index, ...item })) || [],
    [filteredData],
  );

  return (
    <PageContainer
      title="Completed Orders - Food"
      description="Manage successfully delivered food orders with quality tracking and customer satisfaction"
    >
      <Breadcrumb title="Completed Orders - Food" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Status Navigation Cards */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Order Status Navigation</Typography>
        <Grid container spacing={2}>
          {orderStatusConfig.map((status) => (
            <Grid item xs={12} sm={6} md={4} lg={12/7} key={status.key}>
              <StyledNavLink 
                to={status.route}
                end
              >
                <StatusCard className="status-card">
                  <CardActionArea sx={{ 
                    height: '100%', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <CardContent sx={{ 
                      textAlign: 'center', 
                      py: 2, 
                      px: 1.5,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <Typography 
                        variant="body2" 
                        fontWeight="600" 
                        className="status-label"
                        sx={{ 
                          mb: 1, 
                          fontSize: '0.875rem',
                          lineHeight: 1.2,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        {status.label}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {status.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </StatusCard>
              </StyledNavLink>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h6">Completed Orders - Food</Typography>
            <Typography variant="body2" color="text.secondary">
              Successfully delivered food orders with quality assurance and customer satisfaction tracking ({filteredData.length} orders)
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search orders..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'white' }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Data Grid */}
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowHeight={110}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              loading={loading}
              density="comfortable"
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 600,
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Status Update Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Food Order</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Action*</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Action
                  </MenuItem>
                  <MenuItem value="payment-processed">Mark Payment as Processed</MenuItem>
                  <MenuItem value="generate-receipt">Generate Digital Receipt</MenuItem>
                  <MenuItem value="loyalty-points">Process Loyalty Points</MenuItem>
                  <MenuItem value="request-review">Request Customer Review</MenuItem>
                  <MenuItem value="favorite-meal">Add to Customer Favorites</MenuItem>
                  <MenuItem value="repeat-order">Schedule Repeat Order</MenuItem>
                  <MenuItem value="chef-appreciation">Send Chef Appreciation</MenuItem>
                  <MenuItem value="quality-feedback">Report Quality Issue</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add payment processing notes, loyalty program updates, customer satisfaction feedback, or repeat order scheduling..."
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseModal} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Status
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default CompletedOrders;
