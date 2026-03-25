import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingCart, IconStar, IconSnowflake, IconReceipt } from '@tabler/icons-react';
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
  { title: 'Completed Orders - Grocery' }
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

// Mock Data for Completed Grocery Orders
const completedOrdersData = [
  {
    _id: '1',
    orderId: 'GRO-ORD-2024-005',
    customerName: 'Divya Krishnan',
    customerPhone: '+91 98765 43213',
    customerEmail: 'divya.krishnan@email.com',
    storeName: 'FreshChoice Supermarket',
    storeImage: '/images/stores/freshchoice.jpg',
    deliveryPartnerName: 'Ravi Kumar',
    storeType: 'Premium Supermarket',
    orderType: 'Monthly Family Pack',
    totalItems: 25,
    orderDate: '2024-08-15',
    orderTime: '9:00 AM',
    orderValue: 4200.00,
    location: 'Indiranagar, Bangalore',
    status: 'completed',
    priority: 'high',
    completedAt: '2024-08-15 18:30',
    deliveryDuration: '9.5 hours',
    customerRating: 5.0,
    customerFeedback: 'Excellent quality fresh vegetables and fruits. Cold items were perfectly maintained.',
    paymentStatus: 'processed',
    deliveryMethod: 'Refrigerated Home Delivery',
    perishableItemsDelivered: 12,
    coldChainMaintained: true,
    receiptGenerated: true,
    organicItems: 8,
    substitutionsAccepted: 1,
    nextOrderSuggestion: '2024-09-15',
  },
  {
    _id: '2',
    orderId: 'GRO-ORD-2024-012',
    customerName: 'Rohit Agarwal',
    customerPhone: '+91 87654 32112',
    customerEmail: 'rohit.agarwal@email.com',
    storeName: 'QuickFresh Express',
    storeImage: '/images/stores/quickfresh.jpg',
    deliveryPartnerName: 'Priya Sharma',
    storeType: 'Express Grocery Store',
    orderType: 'Daily Essentials',
    totalItems: 15,
    orderDate: '2024-08-19',
    orderTime: '11:00 AM',
    orderValue: 1850.00,
    location: 'BTM Layout, Bangalore',
    status: 'completed',
    priority: 'medium',
    completedAt: '2024-08-19 16:45',
    deliveryDuration: '5.75 hours',
    customerRating: 4.7,
    customerFeedback: 'Fast delivery with good packaging. All items were fresh and properly packed.',
    paymentStatus: 'processed',
    deliveryMethod: 'Standard Home Delivery',
    perishableItemsDelivered: 6,
    coldChainMaintained: true,
    receiptGenerated: true,
    organicItems: 4,
    substitutionsAccepted: 0,
    nextOrderSuggestion: '2024-08-26',
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

// Main Completed Orders Component for Grocery
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
      'Refrigerated Home Delivery': 'info',
      'Standard Home Delivery': 'primary',
      'Express Delivery': 'secondary'
    };
    return (
      <Chip 
        label={method || 'STANDARD'} 
        size="small" 
        color={colorMap[method] || 'primary'} 
        variant="outlined" 
      />
    );
  };

  const getColdChainChip = (maintained) => {
    return (
      <Chip 
        label={maintained ? 'COLD CHAIN OK' : 'COLD CHAIN ISSUE'} 
        size="small" 
        color={maintained ? 'success' : 'error'} 
        variant="outlined" 
        icon={<IconSnowflake size={12} />}
      />
    );
  };

  const getRatingDisplay = (rating) => {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <Rating value={rating} readOnly size="small" />
        <Typography variant="caption" color="success.main" fontWeight="600">
          ({rating})
        </Typography>
      </Box>
    );
  };

  const getNextOrderDisplay = (nextDate) => {
    if (!nextDate) return null;
    return (
      <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
        Next order: {nextDate}
      </Typography>
    );
  };

  const getOrganicItemsDisplay = (count) => {
    if (count === 0) return null;
    return (
      <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
        🌱 {count} organic items
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
            <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
              Delivered: {params.row.completedAt}
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
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {params.row.customerPhone}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {getRatingDisplay(params.row.customerRating)}
            </Box>
          </Box>
        ),
      },
      {
        field: 'storeInfo',
        headerName: 'Store & Delivery',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.storeImage}
                alt={params.row.storeName}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography variant="body2" fontWeight="500" sx={{ lineHeight: 1.2 }}>
                  {params.row.storeName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  By: {params.row.deliveryPartnerName}
                </Typography>
              </Box>
            </Box>
            {getDeliveryMethodChip(params.row.deliveryMethod)}
          </Box>
        ),
      },
      {
        field: 'orderDetails',
        headerName: 'Order Quality',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • {params.row.perishableItemsDelivered} perishable
            </Typography>
            {params.row.substitutionsAccepted > 0 && (
              <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 0.5 }}>
                {params.row.substitutionsAccepted} substitutions
              </Typography>
            )}
            {getColdChainChip(params.row.coldChainMaintained)}
            {getOrganicItemsDisplay(params.row.organicItems)}
            {getNextOrderDisplay(params.row.nextOrderSuggestion)}
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
      title="Completed Orders - Grocery"
      description="Manage successfully delivered grocery orders with quality tracking and customer satisfaction"
    >
      <Breadcrumb title="Completed Orders - Grocery" items={BCrumb} />
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
            <Typography variant="h6">Completed Orders - Grocery</Typography>
            <Typography variant="body2" color="text.secondary">
              Successfully delivered grocery orders with quality assurance and customer satisfaction tracking ({filteredData.length} orders)
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
        <DialogTitle>Manage Grocery Order</DialogTitle>
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
                  <MenuItem value="schedule-next-order">Schedule Next Order Reminder</MenuItem>
                  <MenuItem value="request-feedback">Request Detailed Feedback</MenuItem>
                  <MenuItem value="loyalty-points">Process Loyalty Points</MenuItem>
                  <MenuItem value="quality-issue">Report Quality Issue</MenuItem>
                  <MenuItem value="refund-request">Process Refund Request</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add payment processing notes, receipt details, next order scheduling, quality feedback, or customer service notes..."
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
