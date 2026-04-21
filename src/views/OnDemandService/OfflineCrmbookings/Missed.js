import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze } from '@tabler/icons-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { URLS } from '../../../Url';
import CrmNav from './CrmNav';
import axios from 'axios';
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
  CircularProgress,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Missed Orders - Verified Partners' }];

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const orderStatusConfig = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Orders awaiting response',
    color: 'warning',
    route: '/ondemandservice/verified-partners-crm/pending',
  },
  {
    key: 'accepted',
    label: 'Accepted',
    description: 'Orders accepted by partners',
    color: 'primary',
    route: '/ondemandservice/verified-partners-crm/accepted',
  },
  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    description: 'Services being performed',
    color: 'info',
    route: '/ondemandservice/verified-partners-crm/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Services completed successfully',
    color: 'success',
    route: '/ondemandservice/verified-partners-crm/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Orders cancelled by customer',
    color: 'error',
    route: '/ondemandservice/verified-partners-crm/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    description: 'Orders rejected by partner',
    color: 'error',
    route: '/ondemandservice/verified-partners-crm/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    description: 'Orders not responded in time',
    color: 'secondary',
    route: '/ondemandservice/verified-partners-crm/missed',
  },
];

// Main Missed Orders Component for Verified Partners
const MissedOrders = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formEdit, setFormEdit] = useState({
    _id: '',
    status: '',
    comment: '',
  });

  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];
  const token = authData?.token;

  // Fetch bookings data from API
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        URLS.GetVerifiedPartnersCrmbookingByStatusOffline,
        { status: 'missed' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success && response.data.bookings) {
        const transformedData = response.data.bookings.map((booking) => ({
          _id: booking._id,
          orderId: booking.orderId,
          customerName: booking.userName,
          customerPhone: booking.userPhone,
          customerEmail: booking.userEmail || 'N/A',
          partnerName: booking.providerName || 'No Response',
          partnerImage: booking.providerImage || '/images/profile/default-avatar.jpg',
          partnerVerificationLevel: booking.providerVerificationLevel || 'Standard Verified',
          partnerRating: booking.providerRating || 4.0,
          serviceName: booking.serviceName,
          serviceCategory: booking.serviceCategory || 'Professional Service',
          orderDate: booking.date,
          orderTime: booking.time,
          bookedDate: booking.bookedDate,
          bookedTime: booking.bookedTime,
          orderValue: booking.amount,
          location: `${booking.addressArea || ''}, ${booking.addressCityName || ''}, ${
            booking.addressStateName || ''
          }`.replace(/^,\s*|,\s*$/g, ''),
          status: booking.status,
          priority: booking.priority || 'medium',
          missedAt: booking.missedAt ? new Date(booking.missedAt).toLocaleString() : 'N/A',
          timeoutDuration: booking.timeoutDuration || '2 hours',
          missedReason: booking.missedReason || 'No response within SLA window',
          verifiedPartnersNotified: booking.verifiedPartnersNotified || 0,
          emergencyReassignmentAttempts: booking.emergencyReassignmentAttempts || 0,
          recoveryStatus: booking.recoveryStatus || 'pending',
          customerCompensation: booking.customerCompensation || 0,
          slaViolation: booking.slaViolation !== false,
          qualityImpactScore: booking.qualityImpactScore || 'High',
          paymentStatus: booking.paymentStatus,
          paymentMethod: booking.paymentMethod,
          ratecards: booking.ratecards || [],
          addressDetails: {
            addressLineOne: booking.addressLineOne,
            addressFlat: booking.addressFlat,
            addressArea: booking.addressArea,
            addressCityName: booking.addressCityName,
            addressStateName: booking.addressStateName,
            addressLatitude: booking.addressLatitude,
            addressLongitude: booking.addressLongitude,
          },
        }));
        setBookingsData(transformedData);
      } else {
        toast.error('Failed to fetch missed orders data');
        setBookingsData([]);
      }
    } catch (error) {
      console.error('Error fetching missed orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch missed orders');
      setBookingsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search
  useEffect(() => {
    if (search === '') {
      setFilteredData(bookingsData);
    } else {
      const filtered = bookingsData.filter(
        (item) =>
          item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          item.orderId?.toLowerCase().includes(search.toLowerCase()) ||
          item.partnerName?.toLowerCase().includes(search.toLowerCase()) ||
          item.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
          item.location?.toLowerCase().includes(search.toLowerCase()) ||
          item.missedReason?.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [search, bookingsData]);

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchBookings();
    } else {
      toast.error('Authentication token not found');
    }
  }, [token]);

  const handleViewOrder = (orderData) => {
    toast.info(`Viewing order ${orderData.orderId}`);
    localStorage.setItem('orderId', orderData._id);
    navigate(`/verified-partners-crm/view-order/${orderData._id}`);
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
    setLoading(true);

    try {
      toast.success('Emergency recovery action initiated successfully');
      handleCloseModal();
      fetchBookings();
    } catch (error) {
      console.error('Error executing recovery action:', error);
      toast.error(error.response?.data?.message || 'Failed to execute recovery action');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityChip = (priority) => {
    const colorMap = {
      high: 'error',
      medium: 'warning',
      low: 'info',
    };
    return (
      <Chip
        label={priority?.toUpperCase() || 'MED'}
        size="small"
        color={colorMap[priority] || 'info'}
        variant="filled"
        sx={{ fontSize: '0.6rem', height: '18px', minWidth: '40px' }}
      />
    );
  };

  const getVerificationChip = (level) => {
    const colorMap = {
      'Gold Verified': 'warning',
      'Premium Verified': 'success',
      'Standard Verified': 'info',
    };
    const shortLabel =
      level === 'Standard Verified'
        ? 'Std'
        : level === 'Gold Verified'
        ? 'Gold'
        : level === 'Premium Verified'
        ? 'Prem'
        : 'Std';
    return (
      <Chip
        label={shortLabel}
        size="small"
        color={colorMap[level] || 'info'}
        variant="outlined"
        sx={{ fontSize: '0.55rem', height: '16px', opacity: 0.7 }}
      />
    );
  };

  const getRecoveryStatusChip = (status) => {
    const colorMap = {
      recovered: 'success',
      escalated: 'error',
      pending: 'warning',
      abandoned: 'secondary',
    };
    const shortLabel =
      status === 'escalated'
        ? 'ESC'
        : status === 'recovered'
        ? 'REC'
        : status === 'abandoned'
        ? 'ABD'
        : 'PEND';
    return (
      <Chip
        label={shortLabel}
        size="small"
        color={colorMap[status] || 'warning'}
        variant="outlined"
        sx={{ fontSize: '0.55rem', height: '16px' }}
      />
    );
  };

  const getQualityImpactChip = (impact) => {
    const colorMap = {
      High: 'error',
      Medium: 'warning',
      Low: 'info',
    };
    return (
      <Chip
        label={impact?.charAt(0) || 'H'}
        size="small"
        color={colorMap[impact] || 'error'}
        variant="filled"
        sx={{ fontSize: '0.55rem', height: '16px', minWidth: '20px' }}
      />
    );
  };

  const getSLAViolationDisplay = (violation) => {
    return violation ? (
      <Typography
        variant="caption"
        color="error.main"
        fontWeight="600"
        sx={{ fontSize: '0.55rem' }}
      >
        BREACH
      </Typography>
    ) : (
      <Typography
        variant="caption"
        color="success.main"
        fontWeight="600"
        sx={{ fontSize: '0.55rem' }}
      >
        OK
      </Typography>
    );
  };

  const getTimeoutDisplay = (duration, priority) => {
    const color =
      priority === 'high' ? 'error.main' : priority === 'medium' ? 'warning.main' : 'info.main';
    return (
      <Typography variant="caption" color={color} fontWeight="600" sx={{ fontSize: '0.6rem' }}>
        {duration}
      </Typography>
    );
  };

  const getNotificationStats = (notified, attempts) => {
    return (
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.6rem', lineHeight: 1.1, display: 'block' }}
        >
          {notified} not.
        </Typography>
        <Typography
          variant="caption"
          color="error.main"
          sx={{ fontSize: '0.55rem', lineHeight: 1.1, display: 'block' }}
        >
          {attempts} att.
        </Typography>
      </Box>
    );
  };

  const getRatingDisplay = (rating) => {
    return (
      <Typography
        variant="caption"
        color="success.main"
        fontWeight="600"
        sx={{ fontSize: '0.55rem', opacity: 0.7 }}
      >
        ★ {rating?.toFixed(1) || '4.0'}
      </Typography>
    );
  };

  const columns = useMemo(
    () => [
      {
        field: 'sno',
        headerName: 'S.No',
        flex: 1,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.75rem' }}>
            {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
          </Typography>
        ),
      },
      {
        field: 'orderInfo',
        headerName: 'Order Info',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box sx={{ py: 0.5 }}>
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ fontSize: '0.7rem', lineHeight: 1.2, mb: 0.3 }}
            >
              {params.row.orderId}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.6rem', lineHeight: 1.1, mb: 0.2 }}
            >
              {params.row.orderDate}
            </Typography>
            <Typography
              variant="caption"
              color="secondary.main"
              sx={{ fontSize: '0.55rem', lineHeight: 1.1, fontWeight: 500, mb: 0.1 }}
            >
              Missed: {params.row.missedAt?.split(' ')[0]}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'customerInfo',
        headerName: 'Customer',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box sx={{ py: 0.5 }}>
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{
                fontSize: '0.7rem',
                lineHeight: 1.2,
                mb: 0.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={params.row.customerName}
            >
              {params.row.customerName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.6rem', lineHeight: 1.1 }}
            >
              {params.row.customerPhone}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'partnerInfo',
        headerName: 'Partner Status',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box sx={{ py: 0.5 }}>
            <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.3 }}>
              <Avatar
                src={params.row.partnerImage}
                alt={params.row.partnerName}
                sx={{ width: 18, height: 18, fontSize: '0.6rem', opacity: 0.5 }}
              >
                {params.row.partnerName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  color="secondary.main"
                  sx={{
                    fontSize: '0.65rem',
                    lineHeight: 1.1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '80px',
                  }}
                  title={params.row.partnerName}
                >
                  {params.row.partnerName}
                </Typography>
              </Box>
            </Box>
          </Box>
        ),
      },

      {
        field: 'orderValue',
        headerName: 'Amount',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="600" color="primary" sx={{ fontSize: '0.7rem' }}>
            ₹{(params.row.orderValue / 1000).toFixed(0)}K
          </Typography>
        ),
      },
      {
        field: 'slaStatus',
        headerName: 'SLA',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => getSLAViolationDisplay(params.row.slaViolation),
      },
      {
        field: 'notificationStats',
        headerName: 'Notifications',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) =>
          getNotificationStats(
            params.row.verifiedPartnersNotified,
            params.row.emergencyReassignmentAttempts,
          ),
      },
      {
        field: 'recoveryStatus',
        headerName: 'Recovery',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => getRecoveryStatusChip(params.row.recoveryStatus),
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.65rem',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxHeight: '2.4em',
            }}
            title={params.row.location || 'N/A'}
          >
            {params.row.location || 'N/A'}
          </Typography>
        ),
      },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {rolesAndPermission.crm_bookings_list_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleUpdateStatus(params.row)}
                  disabled={loading}
                  sx={{ minWidth: '26px', padding: '2px 4px' }}
                  title="Emergency Recovery"
                >
                  <IconAnalyze stroke={1.5} size={12} />
                </Button>{' '}
              </>
            ) : (
              <></>
            )}
            <Button
              size="small"
              color="info"
              variant="contained"
              onClick={() => handleViewOrder(params.row)}
              disabled={loading}
              sx={{ minWidth: '26px', padding: '2px 4px' }}
              title="View Order"
            >
              <IconEye size={12} />
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
      title="Missed Orders - Verified Partners"
      description="Critical premium order recovery with SLA breach management and customer compensation"
    >
      <Breadcrumb title="Missed Orders - Verified Partners" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      <CrmNav />

      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[2],
          overflow: 'hidden',
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
            <Typography variant="h6">Missed Orders - Verified Partners</Typography>
            <Typography variant="body2" color="text.secondary">
              Critical premium service timeouts requiring immediate intervention and SLA breach
              management ({filteredData.length} orders)
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search orders..."
              value={search}
              onChange={handleSearch}
              sx={{ minWidth: { xs: 150, sm: 250 }, bgcolor: 'background.paper' }}
            />
            <Button
              variant="outlined"
              onClick={fetchBookings}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Data Grid */}
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowHeight={100}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              loading={loading}
              density="compact"
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Status Update Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Emergency Premium Recovery</DialogTitle>
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
                  <MenuItem value="emergency-premium-assignment">
                    Emergency Premium Partner Assignment
                  </MenuItem>
                  <MenuItem value="executive-intervention">Executive Team Intervention</MenuItem>
                  <MenuItem value="premium-compensation">Process Premium Compensation</MenuItem>
                  <MenuItem value="sla-breach-escalation">SLA Breach Escalation</MenuItem>
                  <MenuItem value="customer-relationship-recovery">
                    Customer Relationship Recovery
                  </MenuItem>
                  <MenuItem value="partner-performance-review">Partner Performance Review</MenuItem>
                  <MenuItem value="service-guarantee-activation">
                    Activate Service Guarantee
                  </MenuItem>
                  <MenuItem value="emergency-refund">Emergency Full Refund</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Recovery Strategy</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add emergency recovery strategy, customer compensation details, and SLA breach resolution plan..."
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseModal} variant="outlined" disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Processing...' : 'Execute Emergency Recovery'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default MissedOrders;

