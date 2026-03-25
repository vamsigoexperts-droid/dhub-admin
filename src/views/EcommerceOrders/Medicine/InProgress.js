import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconPill, IconClock, IconCheck } from '@tabler/icons-react';
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
  { title: 'Work In Progress - Medicines' }
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

// Mock Data for Work In Progress Medicine Orders
const workInProgressOrdersData = [
  {
    _id: '1',
    orderId: 'MED-ORD-2024-004',
    customerName: 'Ramesh Gupta',
    customerPhone: '+91 98765 43212',
    customerEmail: 'ramesh.gupta@email.com',
    pharmacyName: '1mg Pharmacy',
    pharmacyImage: '/images/pharmacies/1mg.jpg',
    pharmacistName: 'Dr. Meera Patel',
    prescriptionId: 'RX-2024-004',
    medicineType: 'Diabetes Management Kit',
    orderItems: 5,
    orderDate: '2024-08-17',
    orderTime: '11:00 AM',
    orderValue: 2200.00,
    location: 'Hebbal, Bangalore',
    status: 'workInProgress',
    priority: 'high',
    startedAt: '2024-08-20 10:30',
    estimatedCompletion: '2024-08-20 12:00',
    progressPercentage: 75,
    currentStage: 'Quality Check & Packaging',
    qualityVerified: true,
    batchTracking: 'BTH-2024-08-001',
    urgencyLevel: 'urgent',
  },
  {
    _id: '2',
    orderId: 'MED-ORD-2024-011',
    customerName: 'Deepika Sharma',
    customerPhone: '+91 87654 32111',
    customerEmail: 'deepika.sharma@email.com',
    pharmacyName: 'PharmEasy Store',
    pharmacyImage: '/images/pharmacies/pharmeasy.jpg',
    pharmacistName: 'Dr. Arvind Kumar',
    prescriptionId: 'RX-2024-011',
    medicineType: 'Pediatric Medicine Kit',
    orderItems: 3,
    orderDate: '2024-08-17',
    orderTime: '2:00 PM',
    orderValue: 890.00,
    location: 'Marathahalli, Bangalore',
    status: 'workInProgress',
    priority: 'medium',
    startedAt: '2024-08-20 14:15',
    estimatedCompletion: '2024-08-20 15:30',
    progressPercentage: 40,
    currentStage: 'Medicine Assembly & Verification',
    qualityVerified: false,
    batchTracking: 'BTH-2024-08-002',
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

// Main Work In Progress Component for Medicines
const WorkInProgress = () => {
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
      setFilteredData(workInProgressOrdersData);
    } else {
      const filtered = workInProgressOrdersData.filter((item) =>
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
        icon={<IconClock size={12} />}
      />
    );
  };

  const getQualityStatusChip = (verified) => {
    return (
      <Chip 
        label={verified ? 'QC PASSED' : 'QC PENDING'} 
        size="small" 
        color={verified ? 'success' : 'warning'} 
        variant="outlined" 
        icon={<IconCheck size={12} />}
      />
    );
  };

  const getProgressBar = (percentage) => {
    const color = percentage >= 75 ? 'success.main' : percentage >= 50 ? 'info.main' : percentage >= 25 ? 'warning.main' : 'error.main';
    return (
      <Box sx={{ width: '100%', mt: 0.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Progress
          </Typography>
          <Typography variant="caption" color={color} fontWeight="600">
            {percentage}%
          </Typography>
        </Box>
        <Box sx={{ 
          height: 4, 
          bgcolor: 'grey.200', 
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            width: `${percentage}%`, 
            height: '100%', 
            bgcolor: color,
            transition: 'width 0.3s ease'
          }} />
        </Box>
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
            <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
              Started: {params.row.startedAt}
            </Typography>
            <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
              ETA: {params.row.estimatedCompletion}
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
            {getQualityStatusChip(params.row.qualityVerified)}
          </Box>
        ),
      },
      {
        field: 'medicineProgress',
        headerName: 'Preparation Progress',
        flex: 1.5,
        renderCell: (params) => (
          <Box sx={{ py: 1, width: '100%' }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.medicineType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.orderItems} items • Batch: {params.row.batchTracking}
            </Typography>
            <Typography variant="caption" color="info.main" sx={{ display: 'block', mb: 0.5 }}>
              Stage: {params.row.currentStage}
            </Typography>
            {getProgressBar(params.row.progressPercentage)}
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
        width: 110,
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
              title="Update Progress"
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
      title="Work In Progress - Medicines"
      description="Monitor and manage ongoing medicine preparation and quality control processes"
    >
      <Breadcrumb title="Work In Progress - Medicines" items={BCrumb} />
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
            <Typography variant="h6">Work In Progress - Medicines</Typography>
            <Typography variant="body2" color="text.secondary">
              Medicine orders currently under preparation with quality control tracking ({filteredData.length} orders)
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
        <DialogTitle>Update Medicine Preparation Progress</DialogTitle>
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
                  <MenuItem value="completed">Mark as Ready for Delivery</MenuItem>
                  <MenuItem value="quality-check">Perform Quality Check</MenuItem>
                  <MenuItem value="update-progress">Update Preparation Stage</MenuItem>
                  <MenuItem value="extend-timeline">Extend Preparation Time</MenuItem>
                  <MenuItem value="cancelled">Cancel Due to Issues</MenuItem>
                  <MenuItem value="pharmacist-consultation">Require Pharmacist Consultation</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Progress Notes</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add preparation progress details, quality control notes, or any issues encountered..."
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
              Update Progress
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default WorkInProgress;
