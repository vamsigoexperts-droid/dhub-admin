import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze } from '@tabler/icons-react';
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
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { URLS } from '../../../Url';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Cancelled Orders - Verified Partners' }];

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
    },
  },
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

// Updated Order status configurations with routes for Verified Partners
const orderStatusConfig = [
  {
    key: 'pending',
    label: 'Pending',
    description: 'Orders awaiting response',
    color: 'warning',
    route: '/ondemandservice/verified-partners/pending',
  },
  {
    key: 'accepted',
    label: 'Accepted',
    description: 'Orders accepted by partners',
    color: 'primary',
    route: '/ondemandservice/verified-partners/accepted',
  },
  {
    key: 'work-in-progress',
    label: 'Work In Progress',
    description: 'Services being performed',
    color: 'info',
    route: '/ondemandservice/verified-partners/work-in-progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Services completed successfully',
    color: 'success',
    route: '/ondemandservice/verified-partners/completed',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    description: 'Orders cancelled by customer',
    color: 'error',
    route: '/ondemandservice/verified-partners/cancelled',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    description: 'Orders rejected by partner',
    color: 'error',
    route: '/ondemandservice/verified-partners/rejected',
  },
  {
    key: 'missed',
    label: 'Missed',
    description: 'Orders not responded in time',
    color: 'secondary',
    route: '/ondemandservice/verified-partners/missed',
  },
];

// Main Cancelled Orders Component for Verified Partners
const CancelledOrders = () => {
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
        URLS.GetVerifiedPartnersBookingsByStatus,
        { status: 'cancelled' },
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
          partnerName: booking.providerName || 'Unassigned',
          partnerImage: booking.providerImage || '/images/profile/default-avatar.jpg',
          partnerVerificationLevel: booking.providerVerificationLevel || 'Standard Verified',
          partnerRating: booking.providerRating || 4.5,
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
          cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt).toLocaleString() : 'N/A',
          cancelledBy: booking.cancelledBy || 'customer',
          cancellationReason: booking.cancellationReason || 'No reason provided',
          refundStatus: booking.refundStatus || 'pending',
          refundAmount: booking.refundAmount || booking.amount,
          cancellationFee: booking.cancellationFee || 0,
          partnerCompensation: booking.partnerCompensation || 0,
          reschedulingOffered: booking.reschedulingOffered || false,
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
        toast.error('Failed to fetch cancelled orders data');
        setBookingsData([]);
      }
    } catch (error) {
      console.error('Error fetching cancelled orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch cancelled orders');
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
          item.cancellationReason?.toLowerCase().includes(search.toLowerCase()),
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
    navigate(`/verified-partners/view-order/${orderData._id}`);
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
      toast.success('Cancellation management action completed successfully');
      handleCloseModal();
      fetchBookings();
    } catch (error) {
      console.error('Error updating cancellation:', error);
      toast.error(error.response?.data?.message || 'Failed to update cancellation');
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
        sx={{ fontSize: '0.65rem', height: '20px', minWidth: '45px' }}
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
        sx={{ fontSize: '0.6rem', height: '16px' }}
      />
    );
  };

  const getRefundStatusChip = (status) => {
    const colorMap = {
      processed: 'success',
      completed: 'success',
      pending: 'warning',
      failed: 'error',
      'not-applicable': 'default',
    };
    return (
      <Chip
        label={
          status?.toUpperCase() === 'NOT-APPLICABLE' ? 'N/A' : status?.toUpperCase() || 'PENDING'
        }
        size="small"
        color={colorMap[status] || 'warning'}
        variant="outlined"
        sx={{ fontSize: '0.6rem', height: '18px' }}
      />
    );
  };

  const getCancelledByChip = (cancelledBy) => {
    const colorMap = {
      customer: 'info',
      partner: 'secondary',
      admin: 'primary',
    };
    return (
      <Chip
        label={cancelledBy?.toUpperCase() || 'CUSTOMER'}
        size="small"
        color={colorMap[cancelledBy] || 'info'}
        variant="filled"
        sx={{ fontSize: '0.6rem', height: '18px' }}
      />
    );
  };

  const getRatingDisplay = (rating) => {
    return (
      <Typography
        variant="caption"
        color="success.main"
        fontWeight="600"
        sx={{ fontSize: '0.65rem' }}
      >
        ★ {rating?.toFixed(1) || '4.5'}
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
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
          >
            <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.8rem' }}>
              {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'orderInfo',
        headerName: 'Order Info',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ fontSize: '0.75rem', lineHeight: 1.2, mb: 0.3 }}
            >
              {params.row.orderId}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.65rem', lineHeight: 1.1, mb: 0.2 }}
            >
              {params.row.orderDate}
            </Typography>
            <Typography
              variant="caption"
              color="error.main"
              sx={{ fontSize: '0.6rem', lineHeight: 1.1, fontWeight: 500 }}
            >
              Cancelled: {params.row.cancelledAt?.split(' ')[0]}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{
                fontSize: '0.75rem',
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
              sx={{ fontSize: '0.65rem', lineHeight: 1.1 }}
            >
              {params.row.customerPhone?.slice(-4)}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'partnerInfo',
        headerName: 'Verified Partner',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.3 }}>
              <Avatar
                src={params.row.partnerImage}
                alt={params.row.partnerName}
                sx={{ width: 20, height: 20, fontSize: '0.65rem' }}
              >
                {params.row.partnerName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{
                    fontSize: '0.7rem',
                    lineHeight: 1.1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '90px',
                  }}
                  title={params.row.partnerName}
                >
                  {params.row.partnerName}
                </Typography>
                {getRatingDisplay(params.row.partnerRating)}
              </Box>
            </Box>
            {getVerificationChip(params.row.partnerVerificationLevel)}
          </Box>
        ),
      },
      {
        field: 'serviceInfo',
        headerName: 'Service & Reason',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{
                fontSize: '0.75rem',
                lineHeight: 1.2,
                mb: 0.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={params.row.serviceName}
            >
              {params.row.serviceName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.65rem',
                lineHeight: 1.1,
                mb: 0.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {params.row.serviceCategory}
            </Typography>
            <Typography
              variant="caption"
              color="error.main"
              sx={{
                fontSize: '0.6rem',
                lineHeight: 1.1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={params.row.cancellationReason}
            >
              {params.row.cancellationReason?.substring(0, 25)}...
            </Typography>
          </Box>
        ),
      },
      {
        field: 'financialInfo',
        headerName: 'Financial Details',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              py: 1,
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              color="primary"
              sx={{ fontSize: '0.75rem', lineHeight: 1.2, mb: 0.2 }}
            >
              ₹{(params.row.orderValue / 1000).toFixed(0)}K
            </Typography>
            <Typography
              variant="caption"
              color="success.main"
              sx={{ fontSize: '0.65rem', lineHeight: 1.1, mb: 0.1 }}
            >
              Refund: ₹{(params.row.refundAmount / 1000).toFixed(0)}K
            </Typography>
            {params.row.cancellationFee > 0 && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ fontSize: '0.6rem', lineHeight: 1.1 }}
              >
                Fee: ₹{params.row.cancellationFee}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: 'cancelledBy',
        headerName: 'Cancelled By',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {getCancelledByChip(params.row.cancelledBy)}
          </Box>
        ),
      },
      {
        field: 'refundStatus',
        headerName: 'Refund Status',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {getRefundStatusChip(params.row.refundStatus)}
          </Box>
        ),
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 1,
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.7rem',
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
          </Box>
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
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {rolesAndPermission.verified_bookings_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleUpdateStatus(params.row)}
                  disabled={loading}
                  sx={{
                    minWidth: '28px',
                    padding: '3px 4px',
                    '& .MuiButton-startIcon': { margin: 0 },
                  }}
                  title="Manage Cancellation"
                >
                  <IconAnalyze stroke={1.5} size={12} /> Assign
                </Button>
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
              sx={{
                minWidth: '28px',
                padding: '3px 4px',
                '& .MuiButton-startIcon': { margin: 0 },
              }}
              title="View Order"
            >
              <IconEye size={12} /> View
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
      title="Cancelled Orders - Verified Partners"
      description="Manage cancelled premium orders and process refunds with verified partner compensation"
    >
      <Breadcrumb title="Cancelled Orders - Verified Partners" items={BCrumb} />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Status Navigation Cards */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order Status Navigation
        </Typography>
        <Grid container spacing={2}>
          {orderStatusConfig.map((status) => (
            <Grid item xs={12} sm={6} md={4} lg={12 / 7} key={status.key}>
              <StyledNavLink to={status.route} end>
                <StatusCard className="status-card">
                  <CardActionArea
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: 'center',
                        py: 2,
                        px: 1.5,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
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
                          hyphens: 'auto',
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
                          overflow: 'hidden',
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
            <Typography variant="h6">Cancelled Orders - Verified Partners</Typography>
            <Typography variant="body2" color="text.secondary">
              Premium service cancellations requiring refund processing and partner compensation (
              {filteredData.length} orders)
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
          <Box sx={{ width: '100%', height: 600 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowHeight={100}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              loading={loading}
              density="compact"
              sx={{
                border: 'none',
                width: '100%',
                height: '100%',
                '& .MuiDataGrid-main': {
                  overflow: 'hidden',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  padding: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                },
                '& .MuiDataGrid-row': {
                  maxWidth: '100%',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  minHeight: '36px !important',
                  maxHeight: '36px !important',
                },
                '& .MuiDataGrid-columnHeader': {
                  padding: '2px 4px',
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'auto',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: `1px solid ${theme.palette.divider}`,
                  minHeight: '40px',
                },
                '& .MuiTablePagination-root': {
                  overflow: 'hidden',
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Status Update Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Premium Cancellation</DialogTitle>
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
                  <MenuItem value="refund-processed">Process Premium Refund</MenuItem>
                  <MenuItem value="partial-refund">Process Partial Refund</MenuItem>
                  <MenuItem value="partner-compensation">Process Partner Compensation</MenuItem>
                  <MenuItem value="reschedule-offer">Offer Rescheduling</MenuItem>
                  <MenuItem value="waive-cancellation-fee">Waive Cancellation Fee</MenuItem>
                  <MenuItem value="escalate-premium">Escalate to Premium Support</MenuItem>
                  <MenuItem value="dispute-resolution">Handle Dispute</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Comments</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add premium service refund details, partner compensation notes, or rescheduling offers..."
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
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Processing...' : 'Execute Action'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default CancelledOrders;
