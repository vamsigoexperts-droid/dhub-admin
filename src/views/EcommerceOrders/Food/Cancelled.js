import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconChefHat, IconAlertTriangle, IconRefresh, IconClock, IconThermometer } from '@tabler/icons-react';
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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, NavLink } from 'react-router-dom';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Cancelled Orders - Food' }
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

// Mock Data for Cancelled Food Orders
const cancelledOrdersData = [
  {
    _id: '1',
    orderId: 'FOOD-ORD-2024-006',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98765 43214',
    customerEmail: 'ananya.sharma@email.com',
    restaurantName: 'Authentic Tamil Kitchen',
    restaurantImage: '/images/restaurants/tamilkitchen.jpg',
    chefName: 'Chef Karthik Raman',
    headChefName: 'Master Chef Murugan',
    cuisineType: 'South Indian',
    orderType: 'Traditional Chettinad Feast',
    totalItems: 10,
    orderDate: '2024-08-19',
    orderTime: '7:30 PM',
    orderValue: 2100.00,
    location: 'HSR Layout, Bangalore',
    status: 'cancelled',
    priority: 'high',
    cancelledAt: '2024-08-19 19:15',
    cancelledBy: 'customer',
    cancellationReason: 'Emergency family situation, had to leave town immediately',
    refundStatus: 'processed',
    refundAmount: 2100.00,
    kitchenImpact: 'High',
    ingredientWaste: 'Moderate',
    preparationStarted: false,
    peakHourCancellation: true,
    customerRetentionOffer: '25% off next order + free dessert',
    kitchenStationAffected: 'Chettinad Grill Station',
    foodWasteAmount: 0.00,
    chefTimeImpact: '30 minutes',
  },
  {
    _id: '2',
    orderId: 'FOOD-ORD-2024-013',
    customerName: 'Vikram Patel',
    customerPhone: '+91 87654 32113',
    customerEmail: 'vikram.patel@email.com',
    restaurantName: 'Mumbai Street Foods',
    restaurantImage: '/images/restaurants/mumbaistreet.jpg',
    chefName: 'Chef Ravi Kulkarni',
    headChefName: 'Chef Ashok Vada Pav',
    cuisineType: 'Mumbai Street Food',
    orderType: 'Street Food Combo',
    totalItems: 8,
    orderDate: '2024-08-18',
    orderTime: '6:00 PM',
    orderValue: 850.00,
    location: 'Jayanagar, Bangalore',
    status: 'cancelled',
    priority: 'medium',
    cancelledAt: '2024-08-18 18:45',
    cancelledBy: 'restaurant',
    cancellationReason: 'Gas cylinder empty during peak dinner rush, unable to continue cooking operations',
    refundStatus: 'processed',
    refundAmount: 850.00,
    kitchenImpact: 'Critical',
    ingredientWaste: 'High',
    preparationStarted: true,
    peakHourCancellation: true,
    customerRetentionOffer: 'Full refund + priority delivery + 30% off',
    kitchenStationAffected: 'Tawa & Deep Fry Station',
    foodWasteAmount: 340.00,
    chefTimeImpact: '45 minutes',
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

// Main Cancelled Orders Component for Food
const CancelledOrders = () => {
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
      setFilteredData(cancelledOrdersData);
    } else {
      const filtered = cancelledOrdersData.filter((item) =>
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

  const getRefundStatusChip = (status) => {
    const colorMap = {
      processed: 'success',
      pending: 'warning',
      failed: 'error',
      'not-applicable': 'default'
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

  const getCancelledByChip = (cancelledBy) => {
    const colorMap = {
      customer: 'info',
      restaurant: 'secondary',
      admin: 'primary'
    };
    return (
      <Chip 
        label={cancelledBy?.toUpperCase() || 'CUSTOMER'} 
        size="small" 
        color={colorMap[cancelledBy] || 'info'} 
        variant="filled" 
      />
    );
  };

  const getKitchenImpactChip = (impact) => {
    const colorMap = {
      'High': 'error',
      'Critical': 'error',
      'Moderate': 'warning',
      'Low': 'info',
      'None': 'success'
    };
    return (
      <Chip 
        label={`${impact} IMPACT`} 
        size="small" 
        color={colorMap[impact] || 'warning'} 
        variant="outlined" 
        icon={<IconChefHat size={12} />}
      />
    );
  };

  const getPeakHourChip = (isPeak) => {
    if (!isPeak) return null;
    return (
      <Chip 
        label="PEAK HOUR" 
        size="small" 
        color="error" 
        variant="filled" 
        icon={<IconClock size={12} />}
      />
    );
  };

  const getPreparationStatusChip = (started) => {
    return (
      <Chip 
        label={started ? 'PREP STARTED' : 'PREP NOT STARTED'} 
        size="small" 
        color={started ? 'error' : 'warning'} 
        variant="outlined" 
      />
    );
  };

  const getWasteImpactDisplay = (waste, wasteAmount, chefTime) => {
    const wasteColor = waste === 'High' ? 'error.main' : waste === 'Moderate' ? 'warning.main' : 'info.main';
    return (
      <Box>
        <Typography variant="caption" color={wasteColor} sx={{ display: 'block' }}>
          Ingredient waste: {waste}
        </Typography>
        {wasteAmount > 0 && (
          <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
            Food loss: ₹{wasteAmount}
          </Typography>
        )}
        <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
          Chef time: {chefTime}
        </Typography>
      </Box>
    );
  };

  const getRetentionOfferDisplay = (offer) => {
    return (
      <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
        🎁 {offer?.substring(0, 30)}...
      </Typography>
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
            <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
              Cancelled: {params.row.cancelledAt?.substring(11, 19)}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {getPeakHourChip(params.row.peakHourCancellation)}
            </Box>
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
            {getRetentionOfferDisplay(params.row.customerRetentionOffer)}
          </Box>
        ),
      },
      {
        field: 'restaurantInfo',
        headerName: 'Restaurant Info',
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
                  {params.row.headChefName}
                </Typography>
              </Box>
            </Box>
            {getKitchenImpactChip(params.row.kitchenImpact)}
          </Box>
        ),
      },
      {
        field: 'kitchenImpact',
        headerName: 'Kitchen Impact',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • {params.row.kitchenStationAffected?.substring(0, 20)}...
            </Typography>
            {getPreparationStatusChip(params.row.preparationStarted)}
            {getWasteImpactDisplay(
              params.row.ingredientWaste,
              params.row.foodWasteAmount,
              params.row.chefTimeImpact
            )}
            <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5 }}>
              Reason: {params.row.cancellationReason?.substring(0, 35)}...
            </Typography>
          </Box>
        ),
      },
      {
        field: 'financialInfo',
        headerName: 'Financial Details',
        flex: 1.3,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" color="primary" sx={{ mb: 0.5 }}>
              ₹{params.row.orderValue?.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
              Refund: ₹{params.row.refundAmount?.toFixed(2)}
            </Typography>
            {params.row.foodWasteAmount > 0 && (
              <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
                Waste: ₹{params.row.foodWasteAmount?.toFixed(2)}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: 'cancelledBy',
        headerName: 'Cancelled By',
        width: 120,
        renderCell: (params) => getCancelledByChip(params.row.cancelledBy),
      },
      {
        field: 'refundStatus',
        headerName: 'Refund Status',
        width: 130,
        renderCell: (params) => getRefundStatusChip(params.row.refundStatus),
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
              title="Manage Cancellation"
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
      title="Cancelled Orders - Food"
      description="Manage cancelled food orders with kitchen impact assessment and customer retention strategies"
    >
      <Breadcrumb title="Cancelled Orders - Food" items={BCrumb} />
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
            <Typography variant="h6">Cancelled Orders - Food</Typography>
            <Typography variant="body2" color="text.secondary">
              Food order cancellations requiring kitchen resource management and customer retention strategies ({filteredData.length} orders)
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
              rowHeight={90}
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
        <DialogTitle>Manage Food Cancellation</DialogTitle>
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
                  <MenuItem value="refund-processed">Process Food Refund</MenuItem>
                  <MenuItem value="kitchen-resource-recovery">Optimize Kitchen Resources</MenuItem>
                  <MenuItem value="ingredient-reallocation">Reallocate Ingredients to Other Orders</MenuItem>
                  <MenuItem value="customer-retention-offer">Activate Retention Offer</MenuItem>
                  <MenuItem value="chef-schedule-adjustment">Adjust Chef Schedule</MenuItem>
                  <MenuItem value="food-waste-management">Handle Food Waste Disposal</MenuItem>
                  <MenuItem value="peak-hour-management">Peak Hour Impact Assessment</MenuItem>
                  <MenuItem value="kitchen-station-reset">Reset Kitchen Station</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add refund details, kitchen impact notes, ingredient reallocation plans, customer retention offers, or food waste management procedures..."
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

export default CancelledOrders;
