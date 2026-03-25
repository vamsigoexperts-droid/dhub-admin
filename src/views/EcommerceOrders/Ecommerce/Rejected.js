 import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingBag, IconAlertTriangle, IconRefresh, IconTruck, IconPackage, IconCreditCard } from '@tabler/icons-react';
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
  { title: 'Rejected Orders - E-Commerce' }
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

// Mock Data for Rejected E-Commerce Orders
const rejectedOrdersData = [
  {
    _id: '1',
    orderId: 'ECOM-ORD-2024-007',
    customerName: 'Aditi Sharma',
    customerPhone: '+91 98765 43215',
    customerEmail: 'aditi.sharma@email.com',
    sellerName: 'Premium Mobile Store',
    sellerImage: '/images/sellers/premiummobile.jpg',
    inventoryManagerName: 'Suresh Kumar',
    productName: 'iPhone 15 Pro Max 1TB Natural Titanium',
    productCategory: 'Electronics',
    productBrand: 'Apple',
    totalItems: 2,
    orderDate: '2024-08-20',
    orderTime: '11:00 AM',
    orderValue: 319800.00,
    location: 'Bellandur, Bangalore',
    status: 'rejected',
    priority: 'high',
    rejectedAt: '2024-08-20 11:45',
    rejectionReason: 'High-value variant out of stock, supplier delivery delayed by 2 weeks, cannot fulfill premium color specification',
    alternativeSellersAvailable: 3,
    reassignmentStatus: 'in-progress',
    stockShortage: 'Critical',
    priceDiscrepancy: false,
    customerRetentionOffer: 'Alternative color + ₹10,000 discount + priority delivery when restocked',
    sellerPenalty: 1500.00,
    inventorySystemIssue: true,
    paymentRefundStatus: 'processed',
    alternativeProducts: 5,
    urgencyLevel: 'urgent',
  },
  {
    _id: '2',
    orderId: 'ECOM-ORD-2024-014',
    customerName: 'Rohan Gupta',
    customerPhone: '+91 87654 32114',
    customerEmail: 'rohan.gupta@email.com',
    sellerName: 'Fashion Central',
    sellerImage: '/images/sellers/fashioncentral.jpg',
    inventoryManagerName: 'Priya Nair',
    productName: 'Designer Wedding Collection - Sherwani Set',
    productCategory: 'Fashion & Clothing',
    productBrand: 'Royal Couture',
    totalItems: 1,
    orderDate: '2024-08-19',
    orderTime: '2:00 PM',
    orderValue: 45000.00,
    location: 'Sarjapur, Bangalore',
    status: 'rejected',
    priority: 'medium',
    rejectedAt: '2024-08-19 14:30',
    rejectionReason: 'Custom size not available in premium fabric, specialized tailoring required beyond seller capability',
    alternativeSellersAvailable: 7,
    reassignmentStatus: 'completed',
    stockShortage: 'Moderate',
    priceDiscrepancy: false,
    customerRetentionOffer: 'Custom tailoring service + 20% discount + premium packaging',
    sellerPenalty: 0.00,
    inventorySystemIssue: false,
    paymentRefundStatus: 'processed',
    alternativeProducts: 12,
    urgencyLevel: 'standard',
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

// Main Rejected Orders Component for E-Commerce
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

  const getStockShortageChip = (shortage) => {
    const colorMap = {
      'Critical': 'error',
      'High': 'error',
      'Moderate': 'warning',
      'Low': 'info'
    };
    return (
      <Chip 
        label={`${shortage} SHORTAGE`} 
        size="small" 
        color={colorMap[shortage] || 'warning'} 
        variant="filled" 
        icon={<IconPackage size={12} />}
      />
    );
  };

  const getInventoryIssueChip = (hasIssue) => {
    if (!hasIssue) return null;
    return (
      <Chip 
        label="SYSTEM ISSUE" 
        size="small" 
        color="error" 
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
        icon={<IconAlertTriangle size={12} />}
      />
    );
  };

  const getPriceDiscrepancyChip = (hasDiscrepancy) => {
    if (!hasDiscrepancy) return null;
    return (
      <Chip 
        label="PRICE ISSUE" 
        size="small" 
        color="warning" 
        variant="filled" 
        icon={<IconCreditCard size={12} />}
      />
    );
  };

  const getAlternativeSellersDisplay = (count) => {
    const color = count > 5 ? 'success.main' : count > 2 ? 'warning.main' : 'error.main';
    return (
      <Typography variant="caption" color={color} fontWeight="600">
        {count} sellers available
      </Typography>
    );
  };

  const getAlternativeProductsDisplay = (count) => {
    return (
      <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
        💡 {count} alternatives found
      </Typography>
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
              Rejected: {params.row.rejectedAt?.substring(11, 19)}
            </Typography>
            {params.row.sellerPenalty > 0 && (
              <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                Penalty: ₹{params.row.sellerPenalty}
              </Typography>
            )}
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
            {getAlternativeProductsDisplay(params.row.alternativeProducts)}
          </Box>
        ),
      },
      {
        field: 'sellerInfo',
        headerName: 'Rejected By',
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
                <Typography variant="body2" fontWeight="500" color="error.main" sx={{ lineHeight: 1.2 }}>
                  {params.row.sellerName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {params.row.inventoryManagerName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getStockShortageChip(params.row.stockShortage)}
              {getInventoryIssueChip(params.row.inventorySystemIssue)}
              {getPriceDiscrepancyChip(params.row.priceDiscrepancy)}
            </Box>
          </Box>
        ),
      },
      {
        field: 'inventoryIssues',
        headerName: 'Inventory Issues',
        flex: 1.5,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.productName?.substring(0, 25)}...
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • {params.row.productCategory}
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ display: 'block', mb: 0.5 }}>
              Brand: {params.row.productBrand}
            </Typography>
            <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5 }}>
              Issue: {params.row.rejectionReason?.substring(0, 40)}...
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
        field: 'alternativeSellers',
        headerName: 'Alternatives',
        width: 130,
        renderCell: (params) => getAlternativeSellersDisplay(params.row.alternativeSellersAvailable),
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
              title="Reassign E-Commerce Order"
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
      title="Rejected Orders - E-Commerce"
      description="Manage e-commerce orders rejected by sellers with inventory solutions and customer retention"
    >
      <Breadcrumb title="Rejected Orders - E-Commerce" items={BCrumb} />
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
            <Typography variant="h6">Rejected Orders - E-Commerce</Typography>
            <Typography variant="body2" color="text.secondary">
              E-commerce orders rejected by sellers requiring immediate inventory solutions and customer retention ({filteredData.length} orders)
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
        <DialogTitle>Reassign E-Commerce Order</DialogTitle>
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
                  <MenuItem value="reassign-alternative-seller">Reassign to Alternative Seller</MenuItem>
                  <MenuItem value="inventory-escalation">Escalate Inventory Issue to Supplier</MenuItem>
                  <MenuItem value="alternative-product-offer">Offer Alternative Products</MenuItem>
                  <MenuItem value="price-match-solution">Implement Price Match Solution</MenuItem>
                  <MenuItem value="customer-retention-premium">Activate Premium Retention Package</MenuItem>
                  <MenuItem value="seller-penalty-process">Process Seller Performance Penalty</MenuItem>
                  <MenuItem value="inventory-system-fix">Fix Inventory System Integration</MenuItem>
                  <MenuItem value="bulk-procurement-request">Request Bulk Procurement from Brand</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Solution Details</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add seller reassignment details, inventory escalation plans, alternative product suggestions, price matching solutions, or customer retention strategies..."
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
              Execute Solution
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default RejectedOrders;
