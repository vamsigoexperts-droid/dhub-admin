import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconPill, IconAlertTriangle } from '@tabler/icons-react';
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
  { title: 'Cancelled Orders - Medicines' }
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

// Mock Data for Cancelled Medicine Orders
const cancelledOrdersData = [
  {
    _id: '1',
    orderId: 'MED-ORD-2024-006',
    customerName: 'Kavitha Reddy',
    customerPhone: '+91 98765 43214',
    customerEmail: 'kavitha.reddy@email.com',
    pharmacyName: 'LifeCare Pharmacy',
    pharmacyImage: '/images/pharmacies/lifecare.jpg',
    pharmacistName: 'Dr. Amit Sharma',
    prescriptionId: 'RX-2024-006',
    medicineType: 'Cardiac Medications',
    orderItems: 3,
    orderDate: '2024-08-19',
    orderTime: '3:00 PM',
    orderValue: 2100.00,
    location: 'HSR Layout, Bangalore',
    status: 'cancelled',
    priority: 'high',
    cancelledAt: '2024-08-19 14:30',
    cancelledBy: 'customer',
    cancellationReason: 'Doctor changed prescription, different medicines required',
    refundStatus: 'processed',
    refundAmount: 2100.00,
    medicineReturnRequired: false,
    prescriptionStatus: 'retained',
    alternativeMedicineOffered: true,
    urgencyLevel: 'urgent',
  },
  {
    _id: '2',
    orderId: 'MED-ORD-2024-013',
    customerName: 'Rohit Malhotra',
    customerPhone: '+91 87654 32113',
    customerEmail: 'rohit.malhotra@email.com',
    pharmacyName: 'WellnessMart Pharmacy',
    pharmacyImage: '/images/pharmacies/wellnessmart.jpg',
    pharmacistName: 'Dr. Seema Joshi',
    prescriptionId: 'RX-2024-013',
    medicineType: 'Pain Management Kit',
    orderItems: 4,
    orderDate: '2024-08-18',
    orderTime: '8:00 AM',
    orderValue: 1650.00,
    location: 'Jayanagar, Bangalore',
    status: 'cancelled',
    priority: 'medium',
    cancelledAt: '2024-08-18 19:45',
    cancelledBy: 'pharmacy',
    cancellationReason: 'Medicine out of stock, alternative brands not suitable for patient condition',
    refundStatus: 'processed',
    refundAmount: 1650.00,
    medicineReturnRequired: false,
    prescriptionStatus: 'returned',
    alternativeMedicineOffered: false,
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

// Main Cancelled Orders Component for Medicines
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
      />
    );
  };

  const getCancelledByChip = (cancelledBy) => {
    const colorMap = {
      customer: 'info',
      pharmacy: 'secondary',
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

  const getPrescriptionStatusChip = (status) => {
    const colorMap = {
      retained: 'info',
      returned: 'secondary',
      transferred: 'primary'
    };
    return (
      <Chip 
        label={status?.toUpperCase() || 'RETAINED'} 
        size="small" 
        color={colorMap[status] || 'info'} 
        variant="outlined" 
        icon={<IconPill size={12} />}
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
              Cancelled: {params.row.cancelledAt}
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
              Alternative: {params.row.alternativeMedicineOffered ? 'Offered' : 'Not Available'}
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
            {getPrescriptionStatusChip(params.row.prescriptionStatus)}
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
              {params.row.orderItems} items • Rx: {params.row.prescriptionId}
            </Typography>
            <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
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
              ₹{params.row.orderValue?.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
              Refund: ₹{params.row.refundAmount?.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
              Return: {params.row.medicineReturnRequired ? 'Required' : 'Not Required'}
            </Typography>
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
      title="Cancelled Orders - Medicines"
      description="Manage cancelled medicine orders with prescription handling and patient care continuity"
    >
      <Breadcrumb title="Cancelled Orders - Medicines" items={BCrumb} />
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
            <Typography variant="h6">Cancelled Orders - Medicines</Typography>
            <Typography variant="body2" color="text.secondary">
              Medicine order cancellations requiring prescription handling and patient care continuity ({filteredData.length} orders)
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
        <DialogTitle>Manage Medicine Cancellation</DialogTitle>
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
                  <MenuItem value="refund-processed">Process Medicine Refund</MenuItem>
                  <MenuItem value="prescription-transfer">Transfer Prescription to Another Pharmacy</MenuItem>
                  <MenuItem value="alternative-medicine">Offer Alternative Medicine</MenuItem>
                  <MenuItem value="doctor-consultation">Schedule Doctor Consultation</MenuItem>
                  <MenuItem value="medicine-disposal">Arrange Medicine Disposal</MenuItem>
                  <MenuItem value="patient-followup">Schedule Patient Follow-up</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add refund details, prescription transfer notes, alternative medicine suggestions, or patient care instructions..."
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
