import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingBag, IconAlertTriangle, IconClock, IconCreditCard, IconEmergencyBed, IconTruck } from '@tabler/icons-react';
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
  { title: 'Missed Orders - E-Commerce' }
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

// Mock Data for Missed E-Commerce Orders
const missedOrdersData = [
  {
    _id: '1',
    orderId: 'ECOM-ORD-2024-008',
    customerName: 'VIP Customer - Rajesh Enterprises',
    customerPhone: '+91 98765 43216',
    customerEmail: 'rajesh.enterprises@email.com',
    sellerName: 'No Seller Response Network-Wide',
    sellerImage: '/images/sellers/default.jpg',
    inventoryManagerName: 'System Timeout',
    productName: 'Bulk Office Equipment - 50 Units',
    productCategory: 'Business & Industrial',
    productBrand: 'Corporate Supplies',
    totalItems: 50,
    orderDate: '2024-08-20',
    orderTime: '9:00 AM',
    orderValue: 1250000.00,
    location: 'Whitefield, Bangalore',
    status: 'missed',
    priority: 'high',
    missedAt: '2024-08-20 12:00',
    timeoutDuration: '3 hours',
    missedReason: 'Network-wide seller capacity exhausted, bulk order exceeds available inventory across all partner sellers',
    sellersNotified: 15,
    emergencyReassignmentAttempts: 8,
    recoveryStatus: 'escalated',
    customerImpact: 'Critical - Business Operations Affected',
    businessEmergency: true,
    customerCompensation: 1500000.00,
    alternativeSourcesFound: 2,
    urgencyLevel: 'emergency',
    paymentProcessingIssue: false,
    inventoryNetworkFailure: true,
    customerType: 'enterprise',
  },
  {
    _id: '2',
    orderId: 'ECOM-ORD-2024-015',
    customerName: 'Festive Shopper - Meera Iyer',
    customerPhone: '+91 87654 32115',
    customerEmail: 'meera.iyer@email.com',
    sellerName: 'Multiple Timeout Failures',
    sellerImage: '/images/sellers/default.jpg',
    inventoryManagerName: 'Peak Season Overload',
    productName: 'Festival Gift Hamper Collection',
    productCategory: 'Gifts & Occasions',
    productBrand: 'Festive Delights',
    totalItems: 8,
    orderDate: '2024-08-19',
    orderTime: '6:00 PM',
    orderValue: 15999.00,
    location: 'Koramangala, Bangalore',
    status: 'missed',
    priority: 'medium',
    missedAt: '2024-08-20 02:00',
    timeoutDuration: '8 hours',
    missedReason: 'Peak festival season overload, all specialized gift sellers exceeded capacity during high-demand period',
    sellersNotified: 20,
    emergencyReassignmentAttempts: 12,
    recoveryStatus: 'recovered',
    customerImpact: 'High - Festival Deadline Critical',
    businessEmergency: false,
    customerCompensation: 25000.00,
    alternativeSourcesFound: 4,
    urgencyLevel: 'urgent',
    paymentProcessingIssue: false,
    inventoryNetworkFailure: false,
    customerType: 'premium',
  },
];

// Updated Order status configurations with routes for E-Commerce
const orderStatusConfig = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Orders awaiting seller confirmation',
    color: 'warning',
    route: '/e-commerce/pending',
  },
  {
    key: 'accepted',
    label: 'Accepted',
    description: 'Orders accepted by seller',
    color: 'primary',
    route: '/e-commerce/accepted',
  },
  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    description: 'Orders being processed & packed',
    color: 'info',
    route: '/e-commerce/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Orders delivered successfully',
    color: 'success',
    route: '/e-commerce/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Orders cancelled by customer',
    color: 'error',
    route: '/e-commerce/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    description: 'Orders rejected by seller',
    color: 'error',
    route: '/e-commerce/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    description: 'Orders not responded in time',
    color: 'secondary',
    route: '/e-commerce/missed',
  },
];

// Main Missed Orders Component for E-Commerce
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
        item.sellerName.toLowerCase().includes(search.toLowerCase()) ||
        item.productName.toLowerCase().includes(search.toLowerCase())
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

  const getCustomerTypeChip = (type) => {
    const colorMap = {
      'enterprise': 'error',
      'premium': 'warning',
      'regular': 'info'
    };
    const labels = {
      'enterprise': '🏢 ENTERPRISE',
      'premium': '⭐ PREMIUM',
      'regular': '👤 REGULAR'
    };
    return (
      <Chip 
        label={labels[type] || '👤 REGULAR'} 
        size="small" 
        color={colorMap[type] || 'info'} 
        variant="filled" 
      />
    );
  };

  const getBusinessEmergencyDisplay = (isEmergency) => {
    if (!isEmergency) return null;
    return (
      <Chip 
        label="BUSINESS EMERGENCY" 
        size="small" 
        color="error" 
        variant="filled" 
        icon={<IconEmergencyBed size={12} />}
      />
    );
  };

  const getInventoryNetworkFailureChip = (hasFailure) => {
    if (!hasFailure) return null;
    return (
      <Chip 
        label="INVENTORY NETWORK DOWN" 
        size="small" 
        color="error" 
        variant="filled" 
      />
    );
  };

  const getPaymentIssueChip = (hasIssue) => {
    if (!hasIssue) return null;
    return (
      <Chip 
        label="PAYMENT ISSUE" 
        size="small" 
        color="warning" 
        variant="filled" 
        icon={<IconCreditCard size={12} />}
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

  const getCustomerImpactDisplay = (impact, alternatives) => {
    const impactColor = impact?.includes('Critical') ? 'error.main' : impact?.includes('High') ? 'warning.main' : 'info.main';
    return (
      <Box>
        <Typography variant="caption" color={impactColor} sx={{ display: 'block' }}>
          Impact: {impact?.substring(0, 25)}...
        </Typography>
        <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
          🔍 {alternatives} sources found
        </Typography>
      </Box>
    );
  };

  const getNotificationStats = (notified, attempts, compensation) => {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {notified} sellers contacted
        </Typography>
        <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
          {attempts} emergency attempts
        </Typography>
        <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
          ₹{compensation?.toLocaleString('en-IN')} compensation
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
              Missed: {params.row.missedAt?.substring(11, 19)}
            </Typography>
            <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getBusinessEmergencyDisplay(params.row.businessEmergency)}
              {getCustomerTypeChip(params.row.customerType)}
            </Box>
          </Box>
        ),
      },
      {
        field: 'customerInfo',
        headerName: 'Customer Info',
        flex: 1.3,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.customerPhone}
            </Typography>
            {getCustomerImpactDisplay(params.row.customerImpact, params.row.alternativeSourcesFound)}
          </Box>
        ),
      },
      {
        field: 'sellerNetworkStatus',
        headerName: 'Seller Network',
        flex: 1.2,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.sellerImage}
                alt={params.row.sellerName}
                sx={{ width: 36, height: 36, opacity: 0.3 }}
              />
              <Typography variant="body2" fontWeight="500" color="secondary.main">
                {params.row.sellerName?.substring(0, 15)}...
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getInventoryNetworkFailureChip(params.row.inventoryNetworkFailure)}
              {getPaymentIssueChip(params.row.paymentProcessingIssue)}
            </Box>
          </Box>
        ),
      },
      {
        field: 'businessCrisis',
        headerName: 'Business Crisis',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.productName?.substring(0, 25)}...
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • {params.row.productCategory}
            </Typography>
            {getTimeoutDisplay(params.row.timeoutDuration, params.row.priority)}
            <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5 }}>
              Crisis: {params.row.missedReason?.substring(0, 40)}...
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
            ₹{params.row.orderValue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
        field: 'emergencyResponse',
        headerName: 'Emergency Response',
        width: 160,
        renderCell: (params) => getNotificationStats(
          params.row.sellersNotified,
          params.row.emergencyReassignmentAttempts,
          params.row.customerCompensation
        ),
      },
      {
        field: 'recoveryStatus',
        headerName: 'Recovery',
        width: 120,
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
              title="Emergency Business Recovery"
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
      title="Missed Orders - E-Commerce"
      description="Critical e-commerce order recovery with emergency seller networks and business continuity management"
    >
      <Breadcrumb title="Missed Orders - E-Commerce" items={BCrumb} />
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
            <Typography variant="h6">Missed Orders - E-Commerce</Typography>
            <Typography variant="body2" color="text.secondary">
              Critical e-commerce orders requiring immediate emergency seller network activation and business continuity management ({filteredData.length} orders)
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
        <DialogTitle>Emergency Business Recovery</DialogTitle>
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
                  <MenuItem value="emergency-seller-network">Activate Emergency Seller Network</MenuItem>
                  <MenuItem value="enterprise-account-management">Executive Enterprise Account Management</MenuItem>
                  <MenuItem value="premium-compensation">Process Premium Business Compensation</MenuItem>
                  <MenuItem value="alternative-sourcing-network">Emergency Alternative Sourcing Network</MenuItem>
                  <MenuItem value="inventory-system-recovery">Inventory System Emergency Recovery</MenuItem>
                  <MenuItem value="payment-gateway-escalation">Payment Gateway Emergency Escalation</MenuItem>
                  <MenuItem value="business-continuity-plan">Execute Business Continuity Plan</MenuItem>
                  <MenuItem value="vip-customer-retention">VIP Customer Retention Program</MenuItem>
                  <MenuItem value="bulk-procurement-emergency">Emergency Bulk Procurement from Manufacturers</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Emergency Business Plan</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add emergency seller network activation details, enterprise customer management procedures, premium compensation amounts, alternative sourcing strategies, and business continuity protocols..."
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
              Execute Emergency Business Response
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default MissedOrders;
