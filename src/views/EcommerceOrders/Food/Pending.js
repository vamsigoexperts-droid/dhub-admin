import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconChefHat, IconClock, IconFlame } from '@tabler/icons-react';
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
  { title: 'Pending Orders - Food' }
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

// Mock Data for Pending Food Orders
const pendingOrdersData = [
  {
    _id: '1',
    orderId: 'FOOD-ORD-2024-001',
    customerName: 'Amit Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'amit.sharma@email.com',
    restaurantName: 'Spice Garden Restaurant',
    restaurantImage: '/images/restaurants/spicegarden.jpg',
    chefName: 'Chef Ravi Kumar',
    cuisineType: 'North Indian',
    orderType: 'Family Dinner Pack',
    totalItems: 8,
    orderDate: '2024-08-20',
    orderTime: '7:00 PM',
    orderValue: 1850.00,
    location: 'Koramangala, Bangalore',
    status: 'pending',
    priority: 'high',
    receivedAt: '2024-08-20 18:45',
    responseDeadline: '2024-08-20 19:15',
    requestedDeliveryTime: '2024-08-20 8:30 PM',
    estimatedPrepTime: '35 minutes',
    dietaryRequirements: 'Vegetarian',
    spiceLevel: 'Medium',
    urgencyLevel: 'urgent',
  },
  {
    _id: '2',
    orderId: 'FOOD-ORD-2024-002',
    customerName: 'Priya Nair',
    customerPhone: '+91 87654 32109',
    customerEmail: 'priya.nair@email.com',
    restaurantName: 'Fresh Bites Cafe',
    restaurantImage: '/images/restaurants/freshbites.jpg',
    chefName: 'Chef Meera Singh',
    cuisineType: 'Continental',
    orderType: 'Healthy Lunch Box',
    totalItems: 4,
    orderDate: '2024-08-20',
    orderTime: '12:30 PM',
    orderValue: 750.00,
    location: 'Indiranagar, Bangalore',
    status: 'pending',
    priority: 'medium',
    receivedAt: '2024-08-20 12:15',
    responseDeadline: '2024-08-20 12:45',
    requestedDeliveryTime: '2024-08-20 1:30 PM',
    estimatedPrepTime: '25 minutes',
    dietaryRequirements: 'Vegan',
    spiceLevel: 'Mild',
    urgencyLevel: 'standard',
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

// Main Pending Orders Component for Food
const PendingOrders = () => {
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
      setFilteredData(pendingOrdersData);
    } else {
      const filtered = pendingOrdersData.filter((item) =>
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

  const getUrgencyChip = (urgency) => {
    const colorMap = {
      urgent: 'error',
      standard: 'info',
      routine: 'default'
    };
    return (
      <Chip 
        label={urgency?.toUpperCase() || 'STANDARD'} 
        size="small" 
        color={colorMap[urgency] || 'info'} 
        variant="outlined" 
        icon={<IconClock size={12} />}
      />
    );
  };

  const getDietaryChip = (diet) => {
    const colorMap = {
      'Vegetarian': 'success',
      'Vegan': 'info',
      'Non-Vegetarian': 'secondary',
      'Jain': 'warning'
    };
    return (
      <Chip 
        label={diet || 'REGULAR'} 
        size="small" 
        color={colorMap[diet] || 'default'} 
        variant="outlined" 
      />
    );
  };

  const getSpiceLevelDisplay = (level) => {
    const icons = {
      'Mild': '🟢',
      'Medium': '🟡',
      'Hot': '🔴',
      'Extra Hot': '🌶️'
    };
    return (
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {icons[level] || '🟡'} {level || 'Medium'} spice
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
            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
              Received: {params.row.receivedAt}
            </Typography>
            <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
              Deadline: {params.row.responseDeadline}
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
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {params.row.customerPhone}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'restaurantInfo',
        headerName: 'Restaurant Info',
        flex: 1.3,
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
                  {params.row.chefName}
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
              {params.row.cuisineType}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'orderDetails',
        headerName: 'Order Details',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • Prep: {params.row.estimatedPrepTime}
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ display: 'block', mb: 0.5 }}>
              Delivery: {params.row.requestedDeliveryTime?.substring(11, 19)}
            </Typography>
            {getDietaryChip(params.row.dietaryRequirements)}
            {getSpiceLevelDisplay(params.row.spiceLevel)}
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
        field: 'urgency',
        headerName: 'Urgency',
        width: 110,
        renderCell: (params) => getUrgencyChip(params.row.urgencyLevel),
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
              title="Take Action"
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
      title="Pending Orders - Food"
      description="Manage pending food orders awaiting restaurant confirmation and preparation scheduling"
    >
      <Breadcrumb title="Pending Orders - Food" items={BCrumb} />
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
            <Typography variant="h6">Pending Orders - Food</Typography>
            <Typography variant="body2" color="text.secondary">
              Food orders awaiting restaurant confirmation and kitchen preparation scheduling ({filteredData.length} orders)
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
        <DialogTitle>Take Action on Food Order</DialogTitle>
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
                  <MenuItem value="accepted">Accept Order (Kitchen Available)</MenuItem>
                  <MenuItem value="rejected">Reject Order (Kitchen Busy/Items Unavailable)</MenuItem>
                  <MenuItem value="cancelled">Cancel Order</MenuItem>
                  <MenuItem value="prep-time-update">Update Preparation Time</MenuItem>
                  <MenuItem value="missed">Mark as Missed</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add comments about kitchen availability, preparation time, ingredient availability, or dietary accommodations..."
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

export default PendingOrders;
