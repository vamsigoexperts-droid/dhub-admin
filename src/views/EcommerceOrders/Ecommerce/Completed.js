import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingBag, IconStar, IconTruck, IconReceipt, IconGift } from '@tabler/icons-react';
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
  { title: 'Completed Orders - E-Commerce' }
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

// Mock Data for Completed E-Commerce Orders
const completedOrdersData = [
  {
    _id: '1',
    orderId: 'ECOM-ORD-2024-005',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43213',
    customerEmail: 'rahul.sharma@email.com',
    sellerName: 'TechZone Electronics',
    sellerImage: '/images/sellers/techzone.jpg',
    deliveryPartnerName: 'DHL Express (Vehicle: DHL-789)',
    productName: 'iPhone 15 Pro Max 256GB',
    productCategory: 'Electronics',
    productBrand: 'Apple',
    totalItems: 1,
    orderDate: '2024-08-15',
    orderTime: '2:00 PM',
    orderValue: 159900.00,
    location: 'Indiranagar, Bangalore',
    status: 'completed',
    priority: 'high',
    completedAt: '2024-08-17 18:30',
    deliveryDuration: '2 days 4.5 hours',
    customerRating: 4.8,
    productQualityRating: 5.0,
    deliveryRating: 4.5,
    customerReview: 'Excellent product quality! Fast delivery and perfect packaging. Highly recommend this seller.',
    paymentStatus: 'processed',
    deliveryMethod: 'Express Home Delivery',
    trackingNumber: 'DHL987654321',
    warrantyRegistered: true,
    returnWindowEnd: '2024-08-31',
    loyaltyPointsEarned: 1599,
    recommendedProducts: 3,
    repeatCustomer: false,
    customerType: 'premium',
  },
  {
    _id: '2',
    orderId: 'ECOM-ORD-2024-012',
    customerName: 'Kavya Reddy',
    customerPhone: '+91 87654 32112',
    customerEmail: 'kavya.reddy@email.com',
    sellerName: 'StyleHub Fashion',
    sellerImage: '/images/sellers/stylehub.jpg',
    deliveryPartnerName: 'Aramex Standard (Vehicle: ARX-456)',
    productName: 'Designer Saree Collection',
    productCategory: 'Fashion & Clothing',
    productBrand: 'EthnicWear Co.',
    totalItems: 4,
    orderDate: '2024-08-16',
    orderTime: '11:00 AM',
    orderValue: 8999.00,
    location: 'BTM Layout, Bangalore',
    status: 'completed',
    priority: 'medium',
    completedAt: '2024-08-19 16:45',
    deliveryDuration: '3 days 5.75 hours',
    customerRating: 4.9,
    productQualityRating: 4.7,
    deliveryRating: 5.0,
    customerReview: 'Beautiful sarees with excellent fabric quality. Fast delivery and careful packaging. Will order again!',
    paymentStatus: 'processed',
    deliveryMethod: 'Standard Home Delivery',
    trackingNumber: 'ARX456789123',
    warrantyRegistered: false,
    returnWindowEnd: '2024-09-02',
    loyaltyPointsEarned: 90,
    recommendedProducts: 5,
    repeatCustomer: true,
    customerType: 'regular',
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

// Main Completed Orders Component for E-Commerce
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

  const getCustomerTypeChip = (type, isRepeat) => {
    if (type === 'premium') {
      return (
        <Chip 
          label="⭐ PREMIUM" 
          size="small" 
          color="warning" 
          variant="filled" 
        />
      );
    }
    if (isRepeat) {
      return (
        <Chip 
          label="🔄 REPEAT" 
          size="small" 
          color="info" 
          variant="outlined" 
        />
      );
    }
    return (
      <Chip 
        label="🆕 NEW" 
        size="small" 
        color="secondary" 
        variant="outlined" 
      />
    );
  };

  const getWarrantyChip = (registered) => {
    return (
      <Chip 
        label={registered ? 'WARRANTY ACTIVE' : 'WARRANTY PENDING'} 
        size="small" 
        color={registered ? 'success' : 'warning'} 
        variant="outlined" 
      />
    );
  };

  const getDeliveryMethodChip = (method) => {
    const colorMap = {
      'Express Home Delivery': 'error',
      'Standard Home Delivery': 'primary',
      'Pickup Point Delivery': 'info',
      'Same Day Delivery': 'secondary'
    };
    return (
      <Chip 
        label={method || 'STANDARD'} 
        size="small" 
        color={colorMap[method] || 'primary'} 
        variant="outlined" 
        icon={<IconTruck size={12} />}
      />
    );
  };

  const getRatingDisplay = (overall, product, delivery) => {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
          <Rating value={overall} readOnly size="small" />
          <Typography variant="caption" color="success.main" fontWeight="600">
            ({overall})
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Product: {product} • Delivery: {delivery}
        </Typography>
      </Box>
    );
  };

  const getReturnWindowDisplay = (endDate) => {
    const today = new Date();
    const returnEnd = new Date(endDate);
    const daysLeft = Math.ceil((returnEnd - today) / (1000 * 60 * 60 * 24));
    const color = daysLeft > 7 ? 'success.main' : daysLeft > 3 ? 'warning.main' : 'error.main';
    
    return (
      <Typography variant="caption" color={color} sx={{ display: 'block' }}>
        Return: {daysLeft} days left
      </Typography>
    );
  };

  const getLoyaltyDisplay = (points, recommendations) => {
    return (
      <Box>
        <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
          🎯 {points} points earned
        </Typography>
        <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
          💡 {recommendations} recommendations
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
            <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
              Delivered: {params.row.completedAt?.substring(11, 19)}
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
              Duration: {params.row.deliveryDuration}
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
              📦 {params.row.trackingNumber}
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
            {getCustomerTypeChip(params.row.customerType, params.row.repeatCustomer)}
            {getRatingDisplay(
              params.row.customerRating,
              params.row.productQualityRating,
              params.row.deliveryRating
            )}
          </Box>
        ),
      },
      {
        field: 'sellerInfo',
        headerName: 'Seller & Delivery',
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
                  {params.row.deliveryPartnerName?.substring(0, 20)}...
                </Typography>
              </Box>
            </Box>
            {getDeliveryMethodChip(params.row.deliveryMethod)}
          </Box>
        ),
      },
      {
        field: 'productQuality',
        headerName: 'Product & Service',
        flex: 1.4,
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
            {getWarrantyChip(params.row.warrantyRegistered)}
            {getReturnWindowDisplay(params.row.returnWindowEnd)}
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
        field: 'loyaltyInfo',
        headerName: 'Loyalty',
        width: 120,
        renderCell: (params) => getLoyaltyDisplay(
          params.row.loyaltyPointsEarned,
          params.row.recommendedProducts
        ),
      },
      {
        field: 'customerReview',
        headerName: 'Customer Review',
        flex: 1.2,
        renderCell: (params) => (
          <Typography variant="caption" sx={{ py: 1 }}>
            {params.row.customerReview?.substring(0, 50)}...
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
      title="Completed Orders - E-Commerce"
      description="Manage successfully delivered e-commerce orders with customer satisfaction and after-sales service"
    >
      <Breadcrumb title="Completed Orders - E-Commerce" items={BCrumb} />
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
            <Typography variant="h6">Completed Orders - E-Commerce</Typography>
            <Typography variant="body2" color="text.secondary">
              Successfully delivered e-commerce orders with customer satisfaction tracking and after-sales service management ({filteredData.length} orders)
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
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Status Update Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Manage E-Commerce Order</DialogTitle>
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
                  <MenuItem value="warranty-registration">Process Warranty Registration</MenuItem>
                  <MenuItem value="generate-invoice">Generate Digital Invoice</MenuItem>
                  <MenuItem value="loyalty-points">Process Loyalty Points</MenuItem>
                  <MenuItem value="request-review">Request Product Review</MenuItem>
                  <MenuItem value="product-recommendations">Send Product Recommendations</MenuItem>
                  <MenuItem value="after-sales-support">Initiate After-Sales Support</MenuItem>
                  <MenuItem value="return-exchange">Process Return/Exchange Request</MenuItem>
                  <MenuItem value="customer-feedback">Collect Customer Feedback</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add warranty details, loyalty program updates, customer satisfaction notes, product recommendations, or after-sales service coordination..."
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
