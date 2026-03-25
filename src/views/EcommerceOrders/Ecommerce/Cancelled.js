import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingBag, IconAlertTriangle, IconRefresh, IconCreditCard, IconPackage } from '@tabler/icons-react';
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
  { title: 'Cancelled Orders - E-Commerce' }
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

// Mock Data for Cancelled E-Commerce Orders
const cancelledOrdersData = [
  {
    _id: '1',
    orderId: 'ECOM-ORD-2024-006',
    customerName: 'Sneha Kapoor',
    customerPhone: '+91 98765 43214',
    customerEmail: 'sneha.kapoor@email.com',
    sellerName: 'GadgetWorld Electronics',
    sellerImage: '/images/sellers/gadgetworld.jpg',
    warehouseManagerName: 'Rajesh Kumar',
    productName: 'Gaming Laptop ASUS ROG Strix',
    productCategory: 'Electronics',
    productBrand: 'ASUS',
    totalItems: 1,
    orderDate: '2024-08-19',
    orderTime: '3:00 PM',
    orderValue: 145999.00,
    location: 'HSR Layout, Bangalore',
    status: 'cancelled',
    priority: 'high',
    cancelledAt: '2024-08-19 14:30',
    cancelledBy: 'customer',
    cancellationReason: 'Found better deal elsewhere, need to cancel immediately before processing starts',
    refundStatus: 'processed',
    refundAmount: 145999.00,
    restockRequired: true,
    paymentMethod: 'Credit Card',
    processingStage: 'payment_confirmed',
    warehouseImpact: 'Low',
    customerRetentionOffer: 'Price match guarantee + free accessories worth ₹5000',
    sellerCompensation: 500.00,
    inventoryReleased: true,
  },
  {
    _id: '2',
    orderId: 'ECOM-ORD-2024-013',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 87654 32113',
    customerEmail: 'vikram.malhotra@email.com',
    sellerName: 'HomeDecor Paradise',
    sellerImage: '/images/sellers/homedecor.jpg',
    warehouseManagerName: 'Priya Singh',
    productName: 'Luxury Furniture Set - Sofa & Table',
    productCategory: 'Home & Furniture',
    productBrand: 'LuxuryLiving',
    totalItems: 3,
    orderDate: '2024-08-18',
    orderTime: '6:00 PM',
    orderValue: 65000.00,
    location: 'Jayanagar, Bangalore',
    status: 'cancelled',
    priority: 'medium',
    cancelledAt: '2024-08-19 10:45',
    cancelledBy: 'seller',
    cancellationReason: 'Manufacturing defect discovered in quality check, unable to deliver damaged furniture',
    refundStatus: 'processed',
    refundAmount: 65000.00,
    restockRequired: false,
    paymentMethod: 'UPI',
    processingStage: 'ready_for_dispatch',
    warehouseImpact: 'High',
    customerRetentionOffer: 'Premium replacement + 15% discount + priority delivery',
    sellerCompensation: 0.00,
    inventoryReleased: false,
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

// Main Cancelled Orders Component for E-Commerce
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
        icon={<IconCreditCard size={12} />}
      />
    );
  };

  const getCancelledByChip = (cancelledBy) => {
    const colorMap = {
      customer: 'info',
      seller: 'secondary',
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

  const getWarehouseImpactChip = (impact) => {
    const colorMap = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'info',
      'None': 'success'
    };
    return (
      <Chip 
        label={`${impact} IMPACT`} 
        size="small" 
        color={colorMap[impact] || 'info'} 
        variant="outlined" 
        icon={<IconPackage size={12} />}
      />
    );
  };

  const getProcessingStageChip = (stage) => {
    const colorMap = {
      'payment_confirmed': 'info',
      'processing': 'warning',
      'ready_for_dispatch': 'error',
      'dispatched': 'secondary'
    };
    const labels = {
      'payment_confirmed': 'PAYMENT STAGE',
      'processing': 'PROCESSING',
      'ready_for_dispatch': 'DISPATCH READY',
      'dispatched': 'DISPATCHED'
    };
    return (
      <Chip 
        label={labels[stage] || 'UNKNOWN'} 
        size="small" 
        color={colorMap[stage] || 'info'} 
        variant="outlined" 
      />
    );
  };

  const getInventoryChip = (released, restockRequired) => {
    if (released) {
      return (
        <Chip 
          label="INVENTORY RELEASED" 
          size="small" 
          color="success" 
          variant="outlined" 
        />
      );
    }
    if (restockRequired) {
      return (
        <Chip 
          label="RESTOCK REQUIRED" 
          size="small" 
          color="warning" 
          variant="outlined" 
        />
      );
    }
    return (
      <Chip 
        label="INVENTORY HELD" 
        size="small" 
        color="info" 
        variant="outlined" 
      />
    );
  };

  const getRetentionOfferDisplay = (offer) => {
    return (
      <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
        🎁 {offer?.substring(0, 35)}...
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
            <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
              Payment: {params.row.paymentMethod}
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
            {getRetentionOfferDisplay(params.row.customerRetentionOffer)}
          </Box>
        ),
      },
      {
        field: 'sellerInfo',
        headerName: 'Seller & Warehouse',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.sellerImage}
                alt={params.row.sellerName}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography variant="body2" fontWeight="500" sx={{ lineHeight: 1.2 }}>
                  {params.row.sellerName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {params.row.warehouseManagerName}
                </Typography>
              </Box>
            </Box>
            {getWarehouseImpactChip(params.row.warehouseImpact)}
          </Box>
        ),
      },
      {
        field: 'orderImpact',
        headerName: 'Order Impact',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.productName?.substring(0, 25)}...
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • {params.row.productCategory}
            </Typography>
            {getProcessingStageChip(params.row.processingStage)}
            {getInventoryChip(params.row.inventoryReleased, params.row.restockRequired)}
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
              ₹{params.row.orderValue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
              Refund: ₹{params.row.refundAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Typography>
            {params.row.sellerCompensation > 0 && (
              <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                Seller Fee: ₹{params.row.sellerCompensation?.toFixed(2)}
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
      title="Cancelled Orders - E-Commerce"
      description="Manage cancelled e-commerce orders with inventory management and customer retention strategies"
    >
      <Breadcrumb title="Cancelled Orders - E-Commerce" items={BCrumb} />
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
            <Typography variant="h6">Cancelled Orders - E-Commerce</Typography>
            <Typography variant="body2" color="text.secondary">
              E-commerce order cancellations requiring inventory management and customer retention strategies ({filteredData.length} orders)
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
        <DialogTitle>Manage E-Commerce Cancellation</DialogTitle>
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
                  <MenuItem value="refund-processed">Process Payment Refund</MenuItem>
                  <MenuItem value="inventory-restock">Release & Restock Inventory</MenuItem>
                  <MenuItem value="customer-retention-offer">Activate Customer Retention Offer</MenuItem>
                  <MenuItem value="seller-compensation">Process Seller Compensation</MenuItem>
                  <MenuItem value="warehouse-operations">Optimize Warehouse Operations</MenuItem>
                  <MenuItem value="payment-gateway-sync">Sync with Payment Gateway</MenuItem>
                  <MenuItem value="alternative-product-offer">Offer Alternative Products</MenuItem>
                  <MenuItem value="loyalty-compensation">Process Loyalty Points Compensation</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add refund processing details, inventory management notes, customer retention offers, seller compensation details, or warehouse optimization plans..."
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
