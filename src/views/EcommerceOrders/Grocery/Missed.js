import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingCart, IconAlertTriangle, IconClock, IconSnowflake, IconEmergencyBed } from '@tabler/icons-react';
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
  { title: 'Missed Orders - Grocery' }
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

// Mock Data for Missed Grocery Orders
const missedOrdersData = [
  {
    _id: '1',
    orderId: 'GRO-ORD-2024-008',
    customerName: 'Family Emergency - Rajesh Patel',
    customerPhone: '+91 98765 43216',
    customerEmail: 'rajesh.patel@email.com',
    storeName: 'No Store Response',
    storeImage: '/images/stores/default.jpg',
    storeManagerName: 'System Timeout',
    storeType: 'Multiple Store Failure',
    orderType: 'Perishable Family Pack',
    totalItems: 28,
    orderDate: '2024-08-20',
    orderTime: '9:00 AM',
    orderValue: 3800.00,
    location: 'Whitefield, Bangalore',
    status: 'missed',
    priority: 'high',
    missedAt: '2024-08-20 11:00',
    timeoutDuration: '2 hours',
    missedReason: 'All contacted stores failed to respond within perishable item safety window',
    storesNotified: 6,
    emergencyReassignmentAttempts: 4,
    recoveryStatus: 'escalated',
    perishableItemsLost: 15,
    coldChainFailure: true,
    customerCompensation: 3800.00,
    deliverySlotMissed: '2024-08-20 12:00 PM - 2:00 PM',
    urgencyLevel: 'emergency',
    organicItemsAffected: 10,
    refrigeratedItemsAffected: 8,
  },
  {
    _id: '2',
    orderId: 'GRO-ORD-2024-015',
    customerName: 'Weekly Shopper - Priya Menon',
    customerPhone: '+91 87654 32115',
    customerEmail: 'priya.menon@email.com',
    storeName: 'Network Timeout',
    storeImage: '/images/stores/default.jpg',
    storeManagerName: 'Multiple Failures',
    storeType: 'Express Chain Stores',
    orderType: 'Daily Fresh Essentials',
    totalItems: 20,
    orderDate: '2024-08-19',
    orderTime: '4:00 PM',
    orderValue: 2400.00,
    location: 'Koramangala, Bangalore',
    status: 'missed',
    priority: 'medium',
    missedAt: '2024-08-20 08:00',
    timeoutDuration: '16 hours',
    missedReason: 'Extended timeout across multiple store networks due to inventory system failures',
    storesNotified: 10,
    emergencyReassignmentAttempts: 6,
    recoveryStatus: 'recovered',
    perishableItemsLost: 8,
    coldChainFailure: false,
    customerCompensation: 2400.00,
    deliverySlotMissed: '2024-08-20 6:00 AM - 8:00 AM',
    urgencyLevel: 'urgent',
    organicItemsAffected: 6,
    refrigeratedItemsAffected: 4,
  },
];

// Updated Order status configurations with routes for Grocery
const orderStatusConfig = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Orders awaiting store response',
    color: 'warning',
    route: '/grocery/pending',
  },
  {
    key: 'accepted',
    label: 'Accepted',
    description: 'Orders accepted by store',
    color: 'primary',
    route: '/grocery/accepted',
  },
  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    description: 'Orders being prepared',
    color: 'info',
    route: '/grocery/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Orders delivered successfully',
    color: 'success',
    route: '/grocery/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Orders cancelled by customer',
    color: 'error',
    route: '/grocery/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    description: 'Orders rejected by store',
    color: 'error',
    route: '/grocery/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    description: 'Orders not responded in time',
    color: 'secondary',
    route: '/grocery/missed',
  },
];

// Main Missed Orders Component for Grocery
const MissedOrders = () => {
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
      setFilteredData(missedOrdersData);
    } else {
      const filtered = missedOrdersData.filter((item) =>
        item.customerName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderId.toLowerCase().includes(search.toLowerCase()) ||
        item.storeName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderType.toLowerCase().includes(search.toLowerCase())
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

  const getRecoveryStatusChip = (status) => {
    const colorMap = {
      'recovered': 'success',
      'escalated': 'error',
      'pending': 'warning',
      'abandoned': 'secondary'
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

  const getUrgencyChip = (urgency) => {
    const colorMap = {
      emergency: 'error',
      urgent: 'warning',
      standard: 'info'
    };
    return (
      <Chip 
        label={urgency?.toUpperCase() || 'STANDARD'} 
        size="small" 
        color={colorMap[urgency] || 'info'} 
        variant="filled" 
        icon={<IconAlertTriangle size={12} />}
      />
    );
  };

  const getColdChainFailureDisplay = (failed) => {
    if (!failed) return null;
    return (
      <Chip 
        label="COLD CHAIN FAILURE" 
        size="small" 
        color="error" 
        variant="filled" 
        icon={<IconSnowflake size={12} />}
      />
    );
  };

  const getTimeoutDisplay = (duration, priority) => {
    const color = priority === 'high' ? 'error.main' : priority === 'medium' ? 'warning.main' : 'info.main';
    return (
      <Typography variant="caption" color={color} fontWeight="600">
        {duration} timeout
      </Typography>
    );
  };

  const getPerishableImpactDisplay = (lost, refrigerated, organic) => {
    return (
      <Box>
        <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
          {lost} perishable items lost
        </Typography>
        <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
          {refrigerated} cold items affected
        </Typography>
        <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
          🌱 {organic} organic items affected
        </Typography>
      </Box>
    );
  };

  const getNotificationStats = (notified, attempts) => {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {notified} stores contacted
        </Typography>
        <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
          {attempts} emergency attempts
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
            <Typography variant="caption" color="secondary.main" sx={{ display: 'block' }}>
              Missed: {params.row.missedAt}
            </Typography>
            <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
              Compensation: ₹{params.row.customerCompensation}
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
            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
              Slot: {params.row.deliverySlotMissed?.substring(0, 25)}...
            </Typography>
          </Box>
        ),
      },
      {
        field: 'storeStatus',
        headerName: 'Store Network Status',
        flex: 1.2,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.storeImage}
                alt={params.row.storeName}
                sx={{ width: 36, height: 36, opacity: 0.3 }}
              />
              <Typography variant="body2" fontWeight="500" color="secondary.main">
                {params.row.storeName}
              </Typography>
            </Box>
            {getColdChainFailureDisplay(params.row.coldChainFailure)}
          </Box>
        ),
      },
      {
        field: 'perishableImpact',
        headerName: 'Perishable Impact',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items total
            </Typography>
            {getTimeoutDisplay(params.row.timeoutDuration, params.row.priority)}
            {getPerishableImpactDisplay(
              params.row.perishableItemsLost,
              params.row.refrigeratedItemsAffected,
              params.row.organicItemsAffected
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
        field: 'urgency',
        headerName: 'Urgency',
        width: 100,
        renderCell: (params) => getUrgencyChip(params.row.urgencyLevel),
      },
      {
        field: 'notificationStats',
        headerName: 'Emergency Response',
        width: 140,
        renderCell: (params) => getNotificationStats(
          params.row.storesNotified, 
          params.row.emergencyReassignmentAttempts
        ),
      },
      {
        field: 'recoveryStatus',
        headerName: 'Recovery Status',
        width: 130,
        renderCell: (params) => getRecoveryStatusChip(params.row.recoveryStatus),
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
              color="error"
              variant="contained"
              onClick={() => handleUpdateStatus(params.row)}
              disabled={loading}
              sx={{ minWidth: '32px', padding: '4px 6px' }}
              title="Emergency Recovery"
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
      title="Missed Orders - Grocery"
      description="Critical grocery order recovery with perishable item management and emergency customer compensation"
    >
      <Breadcrumb title="Missed Orders - Grocery" items={BCrumb} />
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
            <Typography variant="h6">Missed Orders - Grocery</Typography>
            <Typography variant="body2" color="text.secondary">
              Critical grocery orders requiring immediate emergency intervention and perishable item loss management ({filteredData.length} orders)
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
        <DialogTitle>Emergency Grocery Recovery</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Emergency Action*</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Emergency Action
                  </MenuItem>
                  <MenuItem value="emergency-store-network">Activate Emergency Store Network</MenuItem>
                  <MenuItem value="executive-customer-service">Executive Customer Service Intervention</MenuItem>
                  <MenuItem value="full-compensation">Process Full Order Compensation</MenuItem>
                  <MenuItem value="cold-chain-recovery">Emergency Cold Chain Recovery</MenuItem>
                  <MenuItem value="perishable-disposal">Coordinate Perishable Item Disposal</MenuItem>
                  <MenuItem value="priority-customer-status">Upgrade to Priority Customer Status</MenuItem>
                  <MenuItem value="immediate-alternative-sourcing">Immediate Alternative Sourcing</MenuItem>
                  <MenuItem value="loyalty-program-enrollment">Emergency Loyalty Program Enrollment</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Emergency Response Plan</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add emergency compensation details, cold chain recovery plan, perishable item disposal procedures, customer retention strategies, and alternative sourcing arrangements..."
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
            <Button type="submit" variant="contained" color="error">
              Execute Emergency Response
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default MissedOrders;
