import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze, IconPill, IconAlertTriangle, IconClock, IconEmergencyBed } from '@tabler/icons-react';
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
  { title: 'Missed Orders - Medicines' }
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

// Mock Data for Missed Medicine Orders
const missedOrdersData = [
  {
    _id: '1',
    orderId: 'MED-ORD-2024-008',
    customerName: 'Elderly Patient - Ramesh Iyer',
    customerPhone: '+91 98765 43216',
    customerEmail: 'ramesh.iyer@email.com',
    pharmacyName: 'No Pharmacy Response',
    pharmacyImage: '/images/pharmacies/default.jpg',
    pharmacistName: 'Timeout Expired',
    prescriptionId: 'RX-2024-008',
    medicineType: 'Critical Heart Medication',
    orderItems: 2,
    orderDate: '2024-08-20',
    orderTime: '9:00 AM',
    orderValue: 4200.00,
    location: 'Whitefield, Bangalore',
    status: 'missed',
    priority: 'high',
    missedAt: '2024-08-20 11:00',
    timeoutDuration: '2 hours',
    missedReason: 'All contacted pharmacies failed to respond within critical medication window',
    pharmaciesNotified: 8,
    emergencyReassignmentAttempts: 3,
    recoveryStatus: 'escalated',
    patientHealthImpact: 'Critical - Missed Dose Risk',
    medicalEmergency: true,
    patientAge: 72,
    chronicCondition: 'Cardiac Arrhythmia',
    urgencyLevel: 'emergency',
  },
  {
    _id: '2',
    orderId: 'MED-ORD-2024-015',
    customerName: 'Diabetic Patient - Sneha Reddy',
    customerPhone: '+91 87654 32115',
    customerEmail: 'sneha.reddy@email.com',
    pharmacyName: 'System Timeout',
    pharmacyImage: '/images/pharmacies/default.jpg',
    pharmacistName: 'Multiple Timeouts',
    prescriptionId: 'RX-2024-015',
    medicineType: 'Insulin & Diabetes Management',
    orderItems: 4,
    orderDate: '2024-08-19',
    orderTime: '4:00 PM',
    orderValue: 2800.00,
    location: 'Koramangala, Bangalore',
    status: 'missed',
    priority: 'high',
    missedAt: '2024-08-20 08:00',
    timeoutDuration: '16 hours',
    missedReason: 'Extended timeout due to insulin shortage across multiple pharmacy networks',
    pharmaciesNotified: 12,
    emergencyReassignmentAttempts: 4,
    recoveryStatus: 'recovered',
    patientHealthImpact: 'High - Blood Sugar Control Risk',
    medicalEmergency: false,
    patientAge: 34,
    chronicCondition: 'Type 1 Diabetes',
    urgencyLevel: 'urgent',
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

// Main Missed Orders Component for Medicines
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

  const getHealthImpactChip = (impact) => {
    const colorMap = {
      'Critical - Missed Dose Risk': 'error',
      'High - Blood Sugar Control Risk': 'warning',
      'Medium - Treatment Delay': 'info',
      'Low - Routine Medication': 'default'
    };
    const impactKey = impact?.split(' - ')[0] || 'Medium';
    return (
      <Chip 
        label={impactKey.toUpperCase()} 
        size="small" 
        color={colorMap[impact] || 'warning'} 
        variant="filled" 
        icon={<IconAlertTriangle size={12} />}
      />
    );
  };

  const getMedicalEmergencyDisplay = (isEmergency) => {
    if (!isEmergency) return null;
    return (
      <Chip 
        label="MEDICAL EMERGENCY" 
        size="small" 
        color="error" 
        variant="filled" 
        icon={<IconEmergencyBed size={12} />}
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

  const getPatientInfoDisplay = (age, condition) => {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Age: {age} years
        </Typography>
        <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
          Condition: {condition}
        </Typography>
      </Box>
    );
  };

  const getNotificationStats = (notified, attempts) => {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {notified} pharmacies contacted
        </Typography>
        <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
          {attempts} emergency attempts
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
              Missed: {params.row.missedAt}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {getMedicalEmergencyDisplay(params.row.medicalEmergency)}
            </Box>
          </Box>
        ),
      },
      {
        field: 'patientInfo',
        headerName: 'Patient Info',
        flex: 1.3,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.customerPhone}
            </Typography>
            {getPatientInfoDisplay(params.row.patientAge, params.row.chronicCondition)}
          </Box>
        ),
      },
      {
        field: 'pharmacyStatus',
        headerName: 'Pharmacy Status',
        flex: 1.2,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" gap={1} sx={{ py: 1 }}>
            <Avatar
              src={params.row.pharmacyImage}
              alt={params.row.pharmacyName}
              sx={{ width: 36, height: 36, opacity: 0.3 }}
            />
            <Typography variant="body2" fontWeight="500" color="secondary.main">
              {params.row.pharmacyName}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'medicineInfo',
        headerName: 'Critical Medicine',
        flex: 1.4,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
              {params.row.medicineType}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {params.row.orderItems} items • Rx: {params.row.prescriptionId}
            </Typography>
            {getTimeoutDisplay(params.row.timeoutDuration, params.row.priority)}
            <Box sx={{ mt: 0.5 }}>
              {getHealthImpactChip(params.row.patientHealthImpact)}
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
            ₹{params.row.orderValue?.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: 'notificationStats',
        headerName: 'Emergency Response',
        width: 140,
        renderCell: (params) => getNotificationStats(
          params.row.pharmaciesNotified, 
          params.row.emergencyReassignmentAttempts
        ),
      },
      {
        field: 'recoveryStatus',
        headerName: 'Recovery Status',
        width: 130,
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
              title="Emergency Recovery"
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
      title="Missed Orders - Medicines"
      description="Critical medicine order recovery with patient safety and medical emergency management"
    >
      <Breadcrumb title="Missed Orders - Medicines" items={BCrumb} />
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
            <Typography variant="h6">Missed Orders - Medicines</Typography>
            <Typography variant="body2" color="text.secondary">
              Critical medicine orders requiring immediate emergency intervention and patient safety management ({filteredData.length} orders)
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
        <DialogTitle>Emergency Medicine Recovery</DialogTitle>
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
                  <MenuItem value="emergency-hospital-pharmacy">Emergency Hospital Pharmacy Assignment</MenuItem>
                  <MenuItem value="medical-emergency-response">Activate Medical Emergency Response</MenuItem>
                  <MenuItem value="patient-safety-protocol">Execute Patient Safety Protocol</MenuItem>
                  <MenuItem value="alternative-medicine-urgent">Urgent Alternative Medicine Sourcing</MenuItem>
                  <MenuItem value="doctor-emergency-consultation">Emergency Doctor Consultation</MenuItem>
                  <MenuItem value="patient-hospitalization">Consider Patient Hospitalization</MenuItem>
                  <MenuItem value="regulatory-notification">Notify Healthcare Authorities</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Emergency Response Plan</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add critical patient safety measures, emergency sourcing plan, medical intervention details, and healthcare authority notifications..."
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
              Execute Emergency Response
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default MissedOrders;
