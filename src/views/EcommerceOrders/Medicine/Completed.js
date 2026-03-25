import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconPill, IconCheck, IconStar } from '@tabler/icons-react';
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
  { title: 'Completed Orders - Medicines' }
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

// Mock Data for Completed Medicine Orders
const completedOrdersData = [
  {
    _id: '1',
    orderId: 'MED-ORD-2024-005',
    customerName: 'Lakshmi Iyer',
    customerPhone: '+91 98765 43213',
    customerEmail: 'lakshmi.iyer@email.com',
    pharmacyName: 'Medplus Pharmacy',
    pharmacyImage: '/images/pharmacies/medplus.jpg',
    pharmacistName: 'Dr. Rajesh Khurana',
    prescriptionId: 'RX-2024-005',
    medicineType: 'Hypertension Treatment Kit',
    orderItems: 4,
    orderDate: '2024-08-15',
    orderTime: '9:00 AM',
    orderValue: 1850.00,
    location: 'Indiranagar, Bangalore',
    status: 'completed',
    priority: 'high',
    completedAt: '2024-08-18 17:30',
    deliveryDuration: '3 days, 8.5 hours',
    customerRating: 5.0,
    customerFeedback: 'Excellent service, medicines delivered on time with proper counseling',
    paymentStatus: 'processed',
    deliveryMethod: 'Home Delivery',
    batchTracking: 'BTH-2024-08-005',
    refillReminder: '2024-09-15',
    urgencyLevel: 'urgent',
  },
  {
    _id: '2',
    orderId: 'MED-ORD-2024-012',
    customerName: 'Suresh Babu',
    customerPhone: '+91 87654 32112',
    customerEmail: 'suresh.babu@email.com',
    pharmacyName: 'Guardian Pharmacy',
    pharmacyImage: '/images/pharmacies/guardian.jpg',
    pharmacistName: 'Dr. Priya Nair',
    prescriptionId: 'RX-2024-012',
    medicineType: 'Antibiotic Course',
    orderItems: 2,
    orderDate: '2024-08-19',
    orderTime: '11:00 AM',
    orderValue: 450.00,
    location: 'BTM Layout, Bangalore',
    status: 'completed',
    priority: 'medium',
    completedAt: '2024-08-19 16:45',
    deliveryDuration: '5.75 hours',
    customerRating: 4.8,
    customerFeedback: 'Quick delivery with proper medication instructions',
    paymentStatus: 'processed',
    deliveryMethod: 'Express Delivery',
    batchTracking: 'BTH-2024-08-012',
    refillReminder: null,
    urgencyLevel: 'standard',
  },
];

// Updated Order status configurations with routes for Medicines
const orderStatusConfig = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Orders awaiting pharmacy response',
    color: 'warning',
    route: '/medicines/pending',
  },
  {
    key: 'accepted',
    label: 'Accepted',
    description: 'Orders accepted by pharmacy',
    color: 'primary',
    route: '/medicines/accepted',
  },
  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    description: 'Medicine preparation in progress',
    color: 'info',
    route: '/medicines/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Medicines delivered successfully',
    color: 'success',
    route: '/medicines/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Orders cancelled by customer',
    color: 'error',
    route: '/medicines/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    description: 'Orders rejected by pharmacy',
    color: 'error',
    route: '/medicines/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    description: 'Orders not responded in time',
    color: 'secondary',
    route: '/medicines/missed',
  },
];

// Main Completed Orders Component for Medicines
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
        item.pharmacyName.toLowerCase().includes(search.toLowerCase()) ||
        item.medicineType.toLowerCase().includes(search.toLowerCase())
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
      'Home Delivery': 'primary',
      'Express Delivery': 'info',
      'Store Pickup': 'secondary'
    };
    return (
      <Chip 
        label={method || 'HOME DELIVERY'} 
        size="small" 
        color={colorMap[method] || 'primary'} 
        variant="outlined" 
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

  const getRefillReminderDisplay = (refillDate) => {
    if (!refillDate) return null;
    return (
      <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
        Refill: {refillDate}
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
        field: 'pharmacyInfo',
        headerName: 'Pharmacy Info',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.pharmacyImage}
                alt={params.row.pharmacyName}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography variant="body2" fontWeight="500" sx={{ lineHeight: 1.2 }}>
                  {params.row.pharmacyName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {params.row.pharmacistName}
                </Typography>
              </Box>
            </Box>
            {getDeliveryMethodChip(params.row.deliveryMethod)}
          </Box>
        ),
      },
      {
        field: 'medicineInfo',
        headerName: 'Medicine Info',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.medicineType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.orderItems} items • Batch: {params.row.batchTracking}
            </Typography>
            {getRefillReminderDisplay(params.row.refillReminder)}
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
      title="Completed Orders - Medicines"
      description="Manage successfully delivered medicine orders and patient satisfaction"
    >
      <Breadcrumb title="Completed Orders - Medicines" items={BCrumb} />
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
            <Typography variant="h6">Completed Orders - Medicines</Typography>
            <Typography variant="body2" color="text.secondary">
              Successfully delivered medicine orders with patient satisfaction tracking ({filteredData.length} orders)
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
        <DialogTitle>Manage Medicine Order</DialogTitle>
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
                  <MenuItem value="schedule-refill">Schedule Refill Reminder</MenuItem>
                  <MenuItem value="patient-followup">Schedule Patient Follow-up</MenuItem>
                  <MenuItem value="feedback-request">Request Customer Feedback</MenuItem>
                  <MenuItem value="prescription-renewal">Prescription Renewal Alert</MenuItem>
                  <MenuItem value="adverse-reaction">Report Adverse Reaction</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add payment details, patient care notes, refill schedule, or follow-up requirements..."
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
