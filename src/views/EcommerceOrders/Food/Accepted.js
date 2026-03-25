import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconChefHat, IconClock, IconFlame, IconThermometer } from '@tabler/icons-react';
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
  { title: 'Accepted Orders - Food' }
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

// Mock Data for Accepted Food Orders
const acceptedOrdersData = [
  {
    _id: '1',
    orderId: 'FOOD-ORD-2024-003',
    customerName: 'Kavya Reddy',
    customerPhone: '+91 98765 43211',
    customerEmail: 'kavya.reddy@email.com',
    restaurantName: 'Taste of India',
    restaurantImage: '/images/restaurants/tasteofindia.jpg',
    chefName: 'Chef Arjun Kapoor',
    headChefName: 'Master Chef Deepak',
    cuisineType: 'South Indian',
    orderType: 'Traditional Thali',
    totalItems: 12,
    orderDate: '2024-08-18',
    orderTime: '1:00 PM',
    orderValue: 950.00,
    location: 'JP Nagar, Bangalore',
    status: 'accepted',
    priority: 'high',
    acceptedAt: '2024-08-18 13:15',
    confirmedPrepTime: '40 minutes',
    confirmedDeliveryTime: '2024-08-18 2:15 PM',
    kitchenAssigned: 'Kitchen Station 2',
    ingredientsAvailable: true,
    dietaryRequirements: 'Vegetarian',
    spiceLevel: 'Medium',
    specialInstructions: 'Extra sambar, less oil',
    estimatedReadyTime: '2024-08-18 1:55 PM',
  },
  {
    _id: '2',
    orderId: 'FOOD-ORD-2024-010',
    customerName: 'Rohit Agarwal',
    customerPhone: '+91 87654 32110',
    customerEmail: 'rohit.agarwal@email.com',
    restaurantName: 'Pizza Corner',
    restaurantImage: '/images/restaurants/pizzacorner.jpg',
    chefName: 'Chef Maria D\'Angelo',
    headChefName: 'Chef Antonio Rossi',
    cuisineType: 'Italian',
    orderType: 'Family Pizza Combo',
    totalItems: 6,
    orderDate: '2024-08-18',
    orderTime: '7:30 PM',
    orderValue: 1450.00,
    location: 'Electronic City, Bangalore',
    status: 'accepted',
    priority: 'medium',
    acceptedAt: '2024-08-18 19:45',
    confirmedPrepTime: '25 minutes',
    confirmedDeliveryTime: '2024-08-18 8:30 PM',
    kitchenAssigned: 'Pizza Oven Station',
    ingredientsAvailable: true,
    dietaryRequirements: 'Non-Vegetarian',
    spiceLevel: 'Mild',
    specialInstructions: 'Extra cheese, thin crust',
    estimatedReadyTime: '2024-08-18 8:10 PM',
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

// Main Accepted Orders Component for Food
const AcceptedOrders = () => {
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
      setFilteredData(acceptedOrdersData);
    } else {
      const filtered = acceptedOrdersData.filter((item) =>
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

  const getKitchenStationChip = (station) => {
    const colorMap = {
      'Kitchen Station 1': 'primary',
      'Kitchen Station 2': 'secondary',
      'Pizza Oven Station': 'warning',
      'Grill Station': 'error',
      'Dessert Station': 'info'
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

  const getIngredientsStatusChip = (available) => {
    return (
      <Chip 
        label={available ? 'INGREDIENTS OK' : 'INGREDIENTS MISSING'} 
        size="small" 
        color={available ? 'success' : 'error'} 
        variant="outlined" 
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
  minWidth: 200,
  renderCell: (params) => (
    <Box sx={{ py: 1.5, width: '100%' }}>
      <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
        {params.row.orderId}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
        {params.row.orderDate} at {params.row.orderTime}
      </Typography>
      <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 0.3 }}>
        Accepted: {params.row.acceptedAt}
      </Typography>
      <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
        Delivery: {params.row.confirmedDeliveryTime?.substring(11, 16) || 'TBD'}
      </Typography>
    </Box>
  ),
},

   {
  field: 'customerInfo',
  headerName: 'Customer Info',
  flex: 1.2,
  minWidth: 180,
  renderCell: (params) => (
    <Box sx={{ py: 1.5, width: '100%' }}>
      <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5, wordBreak: 'break-word' }}>
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
  flex: 1.4,
  minWidth: 220,
  renderCell: (params) => (
    <Box sx={{ py: 1.5, width: '100%' }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
        <Avatar
          src={params.row.restaurantImage}
          alt={params.row.restaurantName}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="body2" 
            fontWeight="500" 
            sx={{ 
              lineHeight: 1.3, 
              mb: 0.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params.row.restaurantName}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block'
            }}
          >
            {params.row.headChefName}
          </Typography>
        </Box>
      </Box>
      {getKitchenStationChip(params.row.kitchenAssigned)}
    </Box>
  ),
},

    
   {
  field: 'kitchenDetails',
  headerName: 'Kitchen Status',
  flex: 1.6,
  minWidth: 240,
  renderCell: (params) => (
    <Box sx={{ py: 1.5, width: '100%' }}>
      <Typography 
        variant="body2" 
        fontWeight="600" 
        sx={{ 
          mb: 0.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {params.row.orderType}
      </Typography>
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.4 }}>
        {params.row.totalItems} items • {params.row.chefName?.substring(5)}
      </Typography>
      
      <Typography variant="caption" color="info.main" sx={{ display: 'block', mb: 0.4 }}>
        Ready: {params.row.estimatedReadyTime?.substring(11, 16) || 'TBD'}
      </Typography>
      
      <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 0.5 }}>
        Prep: {params.row.confirmedPrepTime}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
        {getIngredientsStatusChip(params.row.ingredientsAvailable)}
        {getDietaryChip(params.row.dietaryRequirements)}
      </Box>
      
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
              title="Update Kitchen Status"
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
      title="Accepted Orders - Food"
      description="Manage food orders accepted by restaurants ready for kitchen preparation"
    >
      <Breadcrumb title="Accepted Orders - Food" items={BCrumb} />
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
            <Typography variant="h6">Accepted Orders - Food</Typography>
            <Typography variant="body2" color="text.secondary">
              Food orders accepted by restaurants ready for kitchen preparation and cooking ({filteredData.length} orders)
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
          <Box sx={{ height: 700, width: '100%' }}>
            {/* <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowHeight={120}
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


            /> */}

            <DataGrid
  rows={rows}
  columns={columns}
  pageSize={10}
  rowHeight={180} // ✅ Increased from 120 to 180 for better spacing
  pageSizeOptions={[5, 10, 20, 50]}
  disableRowSelectionOnClick
  loading={loading}
  density="comfortable"
  getRowHeight={() => 'auto'} // ✅ Auto-adjust row height based on content
  sx={{
    '& .MuiDataGrid-cell': {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      alignItems: 'flex-start', // ✅ Changed from 'center' to 'flex-start'
      padding: '12px 8px', // ✅ Added padding
      lineHeight: 1.5, // ✅ Better line spacing
    },
    '& .MuiDataGrid-row': {
      maxHeight: 'none !important', // ✅ Remove max-height restriction
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: theme.palette.grey[50],
      fontWeight: 600,
    },
    '& .MuiDataGrid-virtualScroller': {
      overflow: 'auto', // ✅ Ensure proper scrolling
    },
  }}
/>

          </Box>
        </CardContent>
      </Paper>

      {/* Status Update Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Update Kitchen Status</DialogTitle>
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
                  <MenuItem value="work-in-progress">Start Food Preparation</MenuItem>
                  <MenuItem value="completed">Mark as Ready for Delivery</MenuItem>
                  <MenuItem value="cancelled">Cancel Order</MenuItem>
                  <MenuItem value="ingredient-shortage">Report Ingredient Shortage</MenuItem>
                  <MenuItem value="prep-time-update">Update Preparation Time</MenuItem>
                  <MenuItem value="special-instructions">Handle Special Instructions</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Kitchen Notes</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add kitchen preparation notes, ingredient status, cooking progress, special dietary accommodations, or timing updates..."
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

export default AcceptedOrders;
