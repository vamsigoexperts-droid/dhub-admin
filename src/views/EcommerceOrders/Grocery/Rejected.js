 import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingCart, IconAlertTriangle, IconRefresh, IconTruck } from '@tabler/icons-react';
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
  { title: 'Rejected Orders - Grocery' }
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

// Mock Data for Rejected Grocery Orders
const rejectedOrdersData = [
  {
    _id: '1',
    orderId: 'GRO-ORD-2024-007',
    customerName: 'Lakshmi Iyer',
    customerPhone: '+91 98765 43215',
    customerEmail: 'lakshmi.iyer@email.com',
    storeName: 'FreshMart Supermarket',
    storeImage: '/images/stores/freshmart.jpg',
    storeManagerName: 'Suresh Kumar',
    storeType: 'Premium Supermarket',
    orderType: 'Exotic Fruits & Vegetables',
    totalItems: 12,
    orderDate: '2024-08-20',
    orderTime: '10:00 AM',
    orderValue: 3200.00,
    location: 'Bellandur, Bangalore',
    status: 'rejected',
    priority: 'high',
    rejectedAt: '2024-08-20 11:15',
    rejectionReason: 'Exotic produce unavailable due to seasonal supply shortage and import delays',
    alternativeStoresAvailable: 3,
    reassignmentStatus: 'in-progress',
    itemsOutOfStock: 8,
    perishableItemsAffected: 10,
    organicAlternativesAvailable: true,
    supplierIssue: true,
    customerRetentionOffer: 'Priority access + 20% off next order',
    urgencyLevel: 'urgent',
    deliverySlotImpacted: '2024-08-20 4:00 PM - 6:00 PM',
  },
  {
    _id: '2',
    orderId: 'GRO-ORD-2024-014',
    customerName: 'Anand Krishnan',
    customerPhone: '+91 87654 32114',
    customerEmail: 'anand.krishnan@email.com',
    storeName: 'QuickMart Express',
    storeImage: '/images/stores/quickmart.jpg',
    storeManagerName: 'Priya Nair',
    storeType: 'Express Grocery Store',
    orderType: 'Bulk Family Pack',
    totalItems: 25,
    orderDate: '2024-08-19',
    orderTime: '2:00 PM',
    orderValue: 4500.00,
    location: 'Sarjapur, Bangalore',
    status: 'rejected',
    priority: 'medium',
    rejectedAt: '2024-08-19 14:45',
    rejectionReason: 'Bulk order exceeds current inventory capacity, multiple key items insufficient stock',
    alternativeStoresAvailable: 5,
    reassignmentStatus: 'completed',
    itemsOutOfStock: 15,
    perishableItemsAffected: 6,
    organicAlternativesAvailable: false,
    supplierIssue: false,
    customerRetentionOffer: 'Split delivery option + free delivery',
    urgencyLevel: 'standard',
    deliverySlotImpacted: '2024-08-20 10:00 AM - 12:00 PM',
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

// Main Rejected Orders Component for Grocery
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
        icon={<IconAlertTriangle size={12} />}
      />
    );
  };

  const getSupplierIssueChip = (hasIssue) => {
    if (!hasIssue) return null;
    return (
      <Chip 
        label="SUPPLIER ISSUE" 
        size="small" 
        color="error" 
        variant="filled" 
        icon={<IconTruck size={12} />}
      />
    );
  };

  const getOrganicAlternativeChip = (available) => {
    return (
      <Chip 
        label={available ? 'ORGANIC ALT AVAILABLE' : 'NO ORGANIC ALT'} 
        size="small" 
        color={available ? 'success' : 'warning'} 
        variant="outlined" 
      />
    );
  };

  const getAlternativeStoresDisplay = (count) => {
    const color = count > 3 ? 'success.main' : count > 0 ? 'warning.main' : 'error.main';
    return (
      <Typography variant="caption" color={color} fontWeight="600">
        {count} stores available
      </Typography>
    );
  };

  const getStockIssueDisplay = (outOfStock, total, perishable) => {
    return (
      <Box>
        <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
          {outOfStock}/{total} items out of stock
        </Typography>
        <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
          {perishable} perishables affected
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
              Rejected: {params.row.rejectedAt}
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
              Slot: {params.row.deliverySlotImpacted?.substring(0, 20)}...
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
            <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
              Offer: {params.row.customerRetentionOffer?.substring(0, 25)}...
            </Typography>
          </Box>
        ),
      },
      {
        field: 'storeInfo',
        headerName: 'Rejected By',
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
                <Typography variant="body2" fontWeight="500" color="error.main" sx={{ lineHeight: 1.2 }}>
                  {params.row.storeName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {params.row.storeManagerName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getSupplierIssueChip(params.row.supplierIssue)}
              {getOrganicAlternativeChip(params.row.organicAlternativesAvailable)}
            </Box>
          </Box>
        ),
      },
      {
        field: 'orderDetails',
        headerName: 'Stock Issues',
        flex: 1.5,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.orderType}
            </Typography>
            {getStockIssueDisplay(
              params.row.itemsOutOfStock,
              params.row.totalItems,
              params.row.perishableItemsAffected
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
        field: 'alternativeStores',
        headerName: 'Alternatives',
        width: 120,
        renderCell: (params) => getAlternativeStoresDisplay(params.row.alternativeStoresAvailable),
      },
      {
        field: 'reassignmentStatus',
        headerName: 'Reassignment',
        width: 130,
        renderCell: (params) => getReassignmentStatusChip(params.row.reassignmentStatus),
      },
      {
        field: 'urgency',
        headerName: 'Urgency',
        width: 100,
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
              title="Reassign Grocery Order"
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
      title="Rejected Orders - Grocery"
      description="Manage grocery orders rejected by stores with inventory solutions and customer retention"
    >
      <Breadcrumb title="Rejected Orders - Grocery" items={BCrumb} />
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
            <Typography variant="h6">Rejected Orders - Grocery</Typography>
            <Typography variant="body2" color="text.secondary">
              Grocery orders rejected by stores requiring immediate reassignment and inventory solutions ({filteredData.length} orders)
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
        <DialogTitle>Reassign Grocery Order</DialogTitle>
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
                  <MenuItem value="reassign-alternative-store">Reassign to Alternative Store</MenuItem>
                  <MenuItem value="partial-fulfillment">Process Partial Order Fulfillment</MenuItem>
                  <MenuItem value="substitute-items">Offer Item Substitutions</MenuItem>
                  <MenuItem value="split-delivery">Split Delivery Across Stores</MenuItem>
                  <MenuItem value="customer-retention-offer">Activate Customer Retention Offer</MenuItem>
                  <MenuItem value="supplier-escalation">Escalate to Supplier Network</MenuItem>
                  <MenuItem value="cancel-refund">Cancel with Full Refund</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Notes</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add reassignment details, inventory solutions, item substitutions, customer retention offers, or supply chain escalation notes..."
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
              Execute Action
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default RejectedOrders;
