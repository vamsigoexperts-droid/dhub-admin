 import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconChefHat, IconAlertTriangle, IconRefresh, IconFlame, IconThermometer } from '@tabler/icons-react';
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
  { title: 'Missed Orders - Food' }
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

// Mock Data for Rejected Food Orders
const rejectedOrdersData = [
  {
    _id: '1',
    orderId: 'FOOD-ORD-2024-007',
    customerName: 'Deepak Mehta',
    customerPhone: '+91 98765 43215',
    customerEmail: 'deepak.mehta@email.com',
    restaurantName: 'Kashmiri Zaika Restaurant',
    restaurantImage: '/images/restaurants/kashmirizaika.jpg',
    chefName: 'Chef Tariq Ahmed',
    headChefName: 'Master Chef Ravi Dhar',
    cuisineType: 'Kashmiri',
    orderType: 'Wazwan Traditional Feast',
    totalItems: 15,
    orderDate: '2024-08-20',
    orderTime: '8:00 PM',
    orderValue: 4500.00,
    location: 'Bellandur, Bangalore',
    status: 'rejected',
    priority: 'high',
    rejectedAt: '2024-08-20 20:15',
    rejectionReason: 'Specialized Kashmiri ingredients unavailable, tandoor oven under maintenance during peak dinner service',
    alternativeRestaurantsAvailable: 2,
    reassignmentStatus: 'in-progress',
    kitchenCapacityIssue: true,
    equipmentFailure: 'Tandoor Oven',
    specializedIngredientsMissing: 8,
    peakHourRejection: true,
    customerRetentionOffer: 'Priority booking + 35% off when available + complimentary appetizers',
    cuisineComplexity: 'High',
    chefExpertiseRequired: 'Kashmiri Specialist',
    foodSafetyFlag: false,
  },
  {
    _id: '2',
    orderId: 'FOOD-ORD-2024-014',
    customerName: 'Sunita Agarwal',
    customerPhone: '+91 87654 32114',
    customerEmail: 'sunita.agarwal@email.com',
    restaurantName: 'Coastal Spice Kitchen',
    restaurantImage: '/images/restaurants/coastalspice.jpg',
    chefName: 'Chef Mohan Rai',
    headChefName: 'Chef Sunil Shetty',
    cuisineType: 'Coastal Karnataka',
    orderType: 'Fresh Seafood Thali',
    totalItems: 12,
    orderDate: '2024-08-19',
    orderTime: '1:00 PM',
    orderValue: 2200.00,
    location: 'Sarjapur, Bangalore',
    status: 'rejected',
    priority: 'medium',
    rejectedAt: '2024-08-19 13:30',
    rejectionReason: 'Fresh fish delivery delayed due to weather conditions, cannot guarantee seafood quality standards',
    alternativeRestaurantsAvailable: 4,
    reassignmentStatus: 'completed',
    kitchenCapacityIssue: false,
    equipmentFailure: 'None',
    specializedIngredientsMissing: 6,
    peakHourRejection: false,
    customerRetentionOffer: 'Same-day alternative + 25% off + fresh guarantee',
    cuisineComplexity: 'Medium',
    chefExpertiseRequired: 'Seafood Specialist',
    foodSafetyFlag: true,
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

// Main Missed Orders Component for Food
const RejectedOrders = () => {
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
      setFilteredData(rejectedOrdersData);
    } else {
      const filtered = rejectedOrdersData.filter((item) =>
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

  const getReassignmentStatusChip = (status) => {
    const colorMap = {
      'completed': 'success',
      'in-progress': 'info',
      'pending': 'warning',
      'failed': 'error'
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

  const getKitchenIssueChip = (hasIssue, equipment) => {
    if (!hasIssue) return null;
    return (
      <Chip 
        label={`${equipment} ISSUE`} 
        size="small" 
        color="error" 
        variant="filled" 
        icon={<IconFlame size={12} />}
      />
    );
  };

  const getFoodSafetyChip = (hasFlag) => {
    if (!hasFlag) return null;
    return (
      <Chip 
        label="FOOD SAFETY" 
        size="small" 
        color="error" 
        variant="filled" 
        icon={<IconThermometer size={12} />}
      />
    );
  };

  const getCuisineComplexityChip = (complexity) => {
    const colorMap = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'info'
    };
    return (
      <Chip 
        label={`${complexity} COMPLEXITY`} 
        size="small" 
        color={colorMap[complexity] || 'info'} 
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
      />
    );
  };

  const getAlternativeRestaurantsDisplay = (count) => {
    const color = count > 3 ? 'success.main' : count > 0 ? 'warning.main' : 'error.main';
    return (
      <Typography variant="caption" color={color} fontWeight="600">
        {count} restaurants available
      </Typography>
    );
  };

  const getIngredientIssueDisplay = (missing, complexity, expertise) => {
    return (
      <Box>
        <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
          {missing} ingredients missing
        </Typography>
        <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
          Requires: {expertise}
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
            <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
              Rejected: {params.row.rejectedAt?.substring(11, 19)}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {getPeakHourChip(params.row.peakHourRejection)}
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
            <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
              🎁 {params.row.customerRetentionOffer?.substring(0, 25)}...
            </Typography>
          </Box>
        ),
      },
      {
        field: 'restaurantInfo',
        headerName: 'Rejected By',
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
                <Typography variant="body2" fontWeight="500" color="error.main" sx={{ lineHeight: 1.2 }}>
                  {params.row.restaurantName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {params.row.headChefName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getKitchenIssueChip(params.row.kitchenCapacityIssue, params.row.equipmentFailure)}
              {getFoodSafetyChip(params.row.foodSafetyFlag)}
              {getCuisineComplexityChip(params.row.cuisineComplexity)}
            </Box>
          </Box>
        ),
      },
      {
        field: 'kitchenIssues',
        headerName: 'Kitchen Issues',
        flex: 1.5,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • {params.row.cuisineType}
            </Typography>
            {getIngredientIssueDisplay(
              params.row.specializedIngredientsMissing,
              params.row.cuisineComplexity,
              params.row.chefExpertiseRequired
            )}
            <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5 }}>
              Reason: {params.row.rejectionReason?.substring(0, 40)}...
            </Typography>
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
        field: 'alternativeRestaurants',
        headerName: 'Alternatives',
        width: 130,
        renderCell: (params) => getAlternativeRestaurantsDisplay(params.row.alternativeRestaurantsAvailable),
      },
      {
        field: 'reassignmentStatus',
        headerName: 'Reassignment',
        width: 130,
        renderCell: (params) => getReassignmentStatusChip(params.row.reassignmentStatus),
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
              title="Reassign Food Order"
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
      title="Missed Orders - Food"
      description="Manage food orders rejected by restaurants with kitchen solutions and customer retention"
    >
      <Breadcrumb title="Missed Orders - Food" items={BCrumb} />
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
            <Typography variant="h6">Missed Orders - Food</Typography>
            <Typography variant="body2" color="text.secondary">
              Food orders rejected by restaurants requiring immediate kitchen solutions and customer retention ({filteredData.length} orders)
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
        <DialogTitle>Reassign Food Order</DialogTitle>
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
                  <MenuItem value="reassign-specialized-restaurant">Reassign to Specialized Restaurant</MenuItem>
                  <MenuItem value="ingredient-sourcing-support">Emergency Ingredient Sourcing</MenuItem>
                  <MenuItem value="equipment-maintenance-schedule">Schedule Equipment Repair</MenuItem>
                  <MenuItem value="alternative-cuisine-suggestion">Suggest Alternative Cuisine</MenuItem>
                  <MenuItem value="customer-retention-activation">Activate Premium Retention Offer</MenuItem>
                  <MenuItem value="food-safety-escalation">Escalate Food Safety Concerns</MenuItem>
                  <MenuItem value="peak-hour-capacity-management">Peak Hour Capacity Solutions</MenuItem>
                  <MenuItem value="chef-expertise-matching">Match with Expert Chef</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Kitchen Solutions</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add restaurant reassignment details, equipment repair schedules, ingredient sourcing solutions, food safety measures, or specialized chef requirements..."
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
              Execute Kitchen Solution
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default RejectedOrders;
