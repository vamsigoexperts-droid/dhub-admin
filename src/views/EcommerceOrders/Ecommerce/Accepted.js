import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconShoppingBag, IconTruck, IconPackage, IconClock } from '@tabler/icons-react';
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
  { title: 'Accepted Orders - E-Commerce' }
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

// Mock Data for Accepted E-Commerce Orders
const acceptedOrdersData = [
  {
    _id: '1',
    orderId: 'ECOM-ORD-2024-003',
    customerName: 'Anita Krishnan',
    customerPhone: '+91 98765 43211',
    customerEmail: 'anita.krishnan@email.com',
    sellerName: 'ElectroWorld Megastore',
    sellerImage: '/images/sellers/electroworld.jpg',
    vendorManagerName: 'Rahul Agarwal',
    warehouseManagerName: 'Suresh Kumar',
    productName: 'Apple MacBook Pro 16-inch M3',
    productCategory: 'Electronics',
    productBrand: 'Apple',
    totalItems: 1,
    orderDate: '2024-08-18',
    orderTime: '1:00 PM',
    orderValue: 239900.00,
    location: 'JP Nagar, Bangalore',
    status: 'accepted',
    priority: 'high',
    acceptedAt: '2024-08-18 13:15',
    confirmedDeliveryDate: '2024-08-20 6:00 PM',
    warehouseLocation: 'Whitefield Warehouse',
    stockReserved: true,
    packingStatus: 'not_started',
    shippingMethod: 'Express Delivery',
    trackingGenerated: false,
    qualityCheckRequired: true,
    estimatedPackingTime: '2 hours',
    courierPartner: 'BlueDart Express',
  },
  {
    _id: '2',
    orderId: 'ECOM-ORD-2024-010',
    customerName: 'Vikram Singh',
    customerPhone: '+91 87654 32110',
    customerEmail: 'vikram.singh@email.com',
    sellerName: 'BookWorm Paradise',
    sellerImage: '/images/sellers/bookworm.jpg',
    vendorManagerName: 'Priya Sharma',
    warehouseManagerName: 'Rajesh Patel',
    productName: 'Complete Fiction Collection Set',
    productCategory: 'Books & Stationery',
    productBrand: 'Various Publishers',
    totalItems: 12,
    orderDate: '2024-08-18',
    orderTime: '7:30 PM',
    orderValue: 4500.00,
    location: 'Electronic City, Bangalore',
    status: 'accepted',
    priority: 'medium',
    acceptedAt: '2024-08-18 19:45',
    confirmedDeliveryDate: '2024-08-22 10:00 AM',
    warehouseLocation: 'Koramangala Warehouse',
    stockReserved: true,
    packingStatus: 'in_progress',
    shippingMethod: 'Standard Delivery',
    trackingGenerated: true,
    qualityCheckRequired: false,
    estimatedPackingTime: '45 minutes',
    courierPartner: 'Delhivery Standard',
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

// Main Accepted Orders Component for E-Commerce
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

  const getPackingStatusChip = (status) => {
    const colorMap = {
      'not_started': 'warning',
      'in_progress': 'info',
      'completed': 'success',
      'quality_check': 'secondary'
    };
    const labels = {
      'not_started': 'NOT STARTED',
      'in_progress': 'PACKING',
      'completed': 'PACKED',
      'quality_check': 'QC PENDING'
    };
    return (
      <Chip 
        label={labels[status] || 'NOT STARTED'} 
        size="small" 
        color={colorMap[status] || 'warning'} 
        variant="outlined" 
        icon={<IconPackage size={12} />}
      />
    );
  };

  const getStockReservedChip = (reserved) => {
    return (
      <Chip 
        label={reserved ? 'STOCK RESERVED' : 'STOCK PENDING'} 
        size="small" 
        color={reserved ? 'success' : 'warning'} 
        variant="outlined" 
      />
    );
  };

  const getTrackingChip = (generated) => {
    return (
      <Chip 
        label={generated ? 'TRACKING READY' : 'TRACKING PENDING'} 
        size="small" 
        color={generated ? 'success' : 'info'} 
        variant="outlined" 
        icon={<IconTruck size={12} />}
      />
    );
  };

  const getQualityCheckChip = (required) => {
    if (!required) return null;
    return (
      <Chip 
        label="QC REQUIRED" 
        size="small" 
        color="secondary" 
        variant="outlined" 
      />
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
              Accepted: {params.row.acceptedAt}
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
              Delivery: {params.row.confirmedDeliveryDate?.substring(0, 16)}
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
            <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
              📦 {params.row.warehouseLocation}
            </Typography>
            {getPackingStatusChip(params.row.packingStatus)}
          </Box>
        ),
      },
      {
        field: 'fulfillmentDetails',
        headerName: 'Fulfillment Status',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.productName?.substring(0, 25)}...
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.totalItems} items • {params.row.productCategory}
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ display: 'block', mb: 0.5 }}>
              📦 Pack time: {params.row.estimatedPackingTime}
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ display: 'block', mb: 0.5 }}>
              🚚 {params.row.courierPartner}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {getStockReservedChip(params.row.stockReserved)}
              {getTrackingChip(params.row.trackingGenerated)}
              {getQualityCheckChip(params.row.qualityCheckRequired)}
            </Box>
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
              title="Update Fulfillment"
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
      title="Accepted Orders - E-Commerce"
      description="Manage e-commerce orders accepted by sellers ready for processing and fulfillment"
    >
      <Breadcrumb title="Accepted Orders - E-Commerce" items={BCrumb} />
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
            <Typography variant="h6">Accepted Orders - E-Commerce</Typography>
            <Typography variant="body2" color="text.secondary">
              E-commerce orders accepted by sellers ready for warehouse processing and shipping coordination ({filteredData.length} orders)
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
        <DialogTitle>Update Fulfillment Status</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Fulfillment Action*</CustomFormLabel>
                <CustomSelect
                  id="status"
                  name="status"
                  value={formEdit.status}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Fulfillment Action
                  </MenuItem>
                  <MenuItem value="work-in-progress">Start Processing & Packing</MenuItem>
                  <MenuItem value="completed">Mark as Ready for Dispatch</MenuItem>
                  <MenuItem value="cancelled">Cancel Order</MenuItem>
                  <MenuItem value="inventory-reserve">Reserve Stock in Warehouse</MenuItem>
                  <MenuItem value="quality-check">Initiate Quality Check</MenuItem>
                  <MenuItem value="tracking-generate">Generate Tracking Number</MenuItem>
                  <MenuItem value="courier-assign">Assign Courier Partner</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Fulfillment Notes</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add warehouse processing notes, packing details, courier assignments, quality checks, or shipping arrangements..."
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
              Update Fulfillment
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default AcceptedOrders;
