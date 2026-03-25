import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconChefHat, IconClock, IconFlame, IconThermometer, IconCheck } from '@tabler/icons-react';
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
  { title: 'Work In Progress - Food' }
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

// Mock Data for Work In Progress Food Orders
const workInProgressOrdersData = [
  {
    _id: '1',
    orderId: 'FOOD-ORD-2024-004',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43212',
    customerEmail: 'neha.gupta@email.com',
    restaurantName: 'Royal Kitchen',
    restaurantImage: '/images/restaurants/royalkitchen.jpg',
    chefName: 'Chef Vikram Singh',
    headChefName: 'Master Chef Rajesh',
    cuisineType: 'Mughlai',
    orderType: 'Biryani Special Combo',
    totalItems: 8,
    orderDate: '2024-08-17',
    orderTime: '8:00 PM',
    orderValue: 1650.00,
    location: 'Hebbal, Bangalore',
    status: 'workInProgress',
    priority: 'high',
    startedAt: '2024-08-20 20:15',
    estimatedCompletion: '2024-08-20 21:00',
    progressPercentage: 65,
    currentStage: 'Biryani Layering & Dum Cooking',
    cookingTemperature: '180°C',
    qualityCheckStatus: 'in_progress',
    foodSafetyCompliant: true,
    kitchenStation: 'Tandoor & Dum Station',
    itemsCompleted: 5,
    itemsInProgress: 3,
  },
  {
    _id: '2',
    orderId: 'FOOD-ORD-2024-011',
    customerName: 'Arjun Mehta',
    customerPhone: '+91 87654 32111',
    customerEmail: 'arjun.mehta@email.com',
    restaurantName: 'Coastal Delights',
    restaurantImage: '/images/restaurants/coastaldelights.jpg',
    chefName: 'Chef Priya Nair',
    headChefName: 'Chef Sunil Kumar',
    cuisineType: 'South Indian',
    orderType: 'Seafood Platter',
    totalItems: 6,
    orderDate: '2024-08-17',
    orderTime: '7:30 PM',
    orderValue: 2200.00,
    location: 'Marathahalli, Bangalore',
    status: 'workInProgress',
    priority: 'medium',
    startedAt: '2024-08-20 19:45',
    estimatedCompletion: '2024-08-20 20:30',
    progressPercentage: 40,
    currentStage: 'Fish Frying & Curry Preparation',
    cookingTemperature: '165°C',
    qualityCheckStatus: 'pending',
    foodSafetyCompliant: true,
    kitchenStation: 'Seafood Grill Station',
    itemsCompleted: 2,
    itemsInProgress: 4,
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

// Main Work In Progress Component for Food
const WorkInProgress = () => {
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
      setFilteredData(workInProgressOrdersData);
    } else {
      const filtered = workInProgressOrdersData.filter((item) =>
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

  const getQualityCheckChip = (status) => {
    const colorMap = {
      'completed': 'success',
      'in_progress': 'info',
      'pending': 'warning',
      'failed': 'error'
    };
    const labels = {
      'completed': 'QC PASSED',
      'in_progress': 'QC CHECKING',
      'pending': 'QC PENDING',
      'failed': 'QC FAILED'
    };
    return (
      <Chip 
        label={labels[status] || 'QC PENDING'} 
        size="small" 
        color={colorMap[status] || 'warning'} 
        variant="outlined" 
        icon={<IconCheck size={12} />}
      />
    );
  };

  const getFoodSafetyChip = (compliant) => {
    return (
      <Chip 
        label={compliant ? 'FOOD SAFE' : 'SAFETY ISSUE'} 
        size="small" 
        color={compliant ? 'success' : 'error'} 
        variant="outlined" 
        icon={<IconThermometer size={12} />}
      />
    );
  };

  const getKitchenStationChip = (station) => {
    const colorMap = {
      'Tandoor & Dum Station': 'error',
      'Seafood Grill Station': 'info',
      'Pizza Oven Station': 'warning',
      'Dessert Station': 'secondary'
    };
    return (
      <Chip 
        label={station || 'MAIN KITCHEN'} 
        size="small" 
        color={colorMap[station] || 'primary'} 
        variant="outlined" 
        icon={<IconChefHat size={12} />}
      />
    );
  };

  const getProgressBar = (percentage) => {
    const color = percentage >= 75 ? 'success.main' : percentage >= 50 ? 'info.main' : percentage >= 25 ? 'warning.main' : 'error.main';
    return (
      <Box sx={{ width: '100%', mt: 0.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Cooking Progress
          </Typography>
          <Typography variant="caption" color={color} fontWeight="600">
            {percentage}%
          </Typography>
        </Box>
        <Box sx={{ 
          height: 4, 
          bgcolor: 'grey.200', 
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            width: `${percentage}%`, 
            height: '100%', 
            bgcolor: color,
            transition: 'width 0.3s ease'
          }} />
        </Box>
      </Box>
    );
  };

  const getItemProgress = (completed, inProgress, total) => {
    return (
      <Box>
        <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
          {completed} items ready
        </Typography>
        <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
          {inProgress} items cooking
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {total} items total
        </Typography>
      </Box>
    );
  };

  const getTemperatureDisplay = (temp) => {
    const tempValue = parseFloat(temp?.replace('°C', ''));
    const color = tempValue >= 160 ? 'success.main' : tempValue >= 140 ? 'warning.main' : 'error.main';
    return (
      <Typography variant="caption" color={color} fontWeight="600" sx={{ display: 'block' }}>
        🌡️ {temp}
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
            <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
              Started: {params.row.startedAt?.substring(11, 19)}
            </Typography>
            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
              ETA: {params.row.estimatedCompletion?.substring(11, 19)}
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
        field: 'kitchenInfo',
        headerName: 'Kitchen & Chef',
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
                  Chef: {params.row.chefName?.substring(5)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
              {getKitchenStationChip(params.row.kitchenStation)}
              {getFoodSafetyChip(params.row.foodSafetyCompliant)}
            </Box>
            {getQualityCheckChip(params.row.qualityCheckStatus)}
          </Box>
        ),
      },
      {
        field: 'cookingProgress',
        headerName: 'Cooking Progress',
        flex: 1.5,
        renderCell: (params) => (
          <Box sx={{ py: 1, width: '100%' }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            {getItemProgress(
              params.row.itemsCompleted, 
              params.row.itemsInProgress, 
              params.row.totalItems
            )}
            <Typography variant="caption" color="info.main" sx={{ display: 'block', mb: 0.5 }}>
              Stage: {params.row.currentStage}
            </Typography>
            {getTemperatureDisplay(params.row.cookingTemperature)}
            {getProgressBar(params.row.progressPercentage)}
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
        field: 'priority',
        headerName: 'Priority',
        width: 110,
        renderCell: (params) => getPriorityChip(params.row.priority),
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
              title="Update Cooking Progress"
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
      title="Work In Progress - Food"
      description="Monitor and manage ongoing food preparation with quality control and temperature tracking"
    >
      <Breadcrumb title="Work In Progress - Food" items={BCrumb} />
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
            <Typography variant="h6">Work In Progress - Food</Typography>
            <Typography variant="body2" color="text.secondary">
              Food orders currently being prepared with real-time cooking progress and temperature monitoring ({filteredData.length} orders)
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
              rowHeight={130}
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
        <DialogTitle>Update Cooking Progress</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Kitchen Action*</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Kitchen Action
                  </MenuItem>
                  <MenuItem value="completed">Mark as Ready for Pickup</MenuItem>
                  <MenuItem value="quality-check">Perform Final Quality Check</MenuItem>
                  <MenuItem value="temperature-check">Monitor Food Temperature</MenuItem>
                  <MenuItem value="update-progress">Update Cooking Stage</MenuItem>
                  <MenuItem value="packaging">Start Food Packaging</MenuItem>
                  <MenuItem value="cancelled">Cancel Due to Kitchen Issues</MenuItem>
                  <MenuItem value="chef-consultation">Require Head Chef Review</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Cooking Notes</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add cooking progress details, temperature readings, quality control notes, food safety compliance, or any kitchen issues encountered..."
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
              Update Kitchen Status
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default WorkInProgress;
