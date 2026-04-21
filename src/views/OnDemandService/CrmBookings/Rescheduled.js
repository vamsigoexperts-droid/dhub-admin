import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomFormLabel from '../../theme-elements/CustomFormLabel';
import { IconEye, IconAnalyze } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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
  Card,
  CircularProgress,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Reschedule Orders - Verified Partners' }];

// Styled Components
const CustomSelect = styled(Select)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
});

const RescheduledOrders = () => {
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
        URLS.GetVerifiedPartnersCrmBookingsByStatus,
        { status: 'rescheduleByProvider' },
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
          startedAt: booking.startedAt ? new Date(booking.startedAt).toLocaleString() : 'N/A',
          estimatedCompletion: booking.estimatedCompletion || 'To be determined',
          progressPercentage: booking.progressPercentage || 0,
          currentPhase: booking.currentPhase || 'Initial Phase',
          paymentStatus: booking.paymentStatus,
              rescheduleReason: booking.rescheduleReason, 
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
        toast.error('Failed to fetch Rescheduled orders data');
        setBookingsData([]);
      }
    } catch (error) {
      console.error('Error fetching Rescheduled orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch Rescheduled orders');
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
          item.currentPhase?.toLowerCase().includes(search.toLowerCase()),
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
      toast.success('Service progress updated successfully');
      handleCloseModal();
      fetchBookings();
    } catch (error) {
      console.error('Error updating service progress:', error);
      toast.error(error.response?.data?.message || 'Failed to update service progress');
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
        sx={{ fontSize: '0.65rem', height: '22px', minWidth: '50px' }}
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
        ? 'Standard'
        : level === 'Gold Verified'
        ? 'Gold'
        : level === 'Premium Verified'
        ? 'Premium'
        : 'Standard';
    return (
      <Chip
        label={shortLabel}
        size="small"
        color={colorMap[level] || 'info'}
        variant="outlined"
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

  const getProgressBar = (percentage) => {
    const color =
      percentage >= 75
        ? 'success.main'
        : percentage >= 50
        ? 'info.main'
        : percentage >= 25
        ? 'warning.main'
        : 'error.main';
    return (
      <Box sx={{ width: '100%', mt: 0.3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            Progress
          </Typography>
          <Typography variant="caption" color={color} fontWeight="600" sx={{ fontSize: '0.65rem' }}>
            {percentage}%
          </Typography>
        </Box>
        <Box
          sx={{
            height: 3,
            bgcolor: 'grey.200',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${percentage}%`,
              height: '100%',
              bgcolor: color,
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>
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
              sx={{ fontSize: '0.8rem', lineHeight: 1.3, mb: 0.5 }}
            >
              {params.row.orderId}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem', lineHeight: 1.2, mb: 0.2 }}
            >
              {params.row.orderDate}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.7rem', lineHeight: 1.2, mb: 0.2 }}
            >
              {params.row.orderTime}
            </Typography>
            <Typography
              variant="caption"
              color="info.main"
              sx={{ fontSize: '0.65rem', lineHeight: 1.2, fontWeight: 500 }}
            >
              Started: {params.row.startedAt}
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
                fontSize: '0.8rem',
                lineHeight: 1.3,
                mb: 0.5,
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
              sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}
            >
              {params.row.customerPhone}
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
            <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
              <Avatar
                src={params.row.partnerImage}
                alt={params.row.partnerName}
                sx={{ width: 22, height: 22, fontSize: '0.7rem' }}
              >
                {params.row.partnerName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '110px',
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
        headerName: 'Service Progress',
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
              width: '100%',
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{
                fontSize: '0.8rem',
                lineHeight: 1.3,
                mb: 0.5,
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
                fontSize: '0.7rem',
                lineHeight: 1.2,
                mb: 0.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {params.row.serviceCategory}
            </Typography>
            <Typography
              variant="caption"
              color="info.main"
              sx={{
                fontSize: '0.65rem',
                lineHeight: 1.2,
                fontWeight: 500,
                mb: 0.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={params.row.currentPhase}
            >
              Phase: {params.row.currentPhase}
            </Typography>
            {getProgressBar(params.row.progressPercentage)}
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
              sx={{ fontSize: '0.8rem', lineHeight: 1.3, mb: 0.3 }}
            >
              ₹{params.row.orderValue?.toFixed(0)}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}
            >
              {params.row.paymentStatus}
            </Typography>
          </Box>
        ),
      },


  {
  field: 'dateTime',
  headerName: 'Date & Time',
  flex: 1,
  renderCell: (params) => {
    const row = params.row;

    const rawDate = row.rescheduleDate || row.bookedDate;
    const rawTime = row.rescheduleTime || row.bookedTime;

    // Convert to dd/mm/yy
    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    };

    return (
      <Box>
        <Typography fontSize="0.75rem" fontWeight={600}>
          {formatDate(rawDate)}
        </Typography>

        <Typography fontSize="0.75rem" color="text.secondary">
          {rawTime || ''}
        </Typography>
      </Box>
    );
  },
}
,
{
  field: 'reason',
  headerName: 'Reason',
  flex: 1,
  headerAlign: 'center',
  align: 'center',
  renderCell: (params) => {
    const reason = params.row.rescheduleReason || '—';

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Typography fontSize="0.75rem" fontWeight={600}>
          {reason}
        </Typography>
      </Box>
    );
  },
}
,
    //   {
    //     field: 'timeline',
    //     headerName: 'Timeline',
    //     flex: 1,
    //     headerAlign: 'left',
    //     align: 'left',
    //     renderCell: (params) => (
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           justifyContent: 'center',
    //           height: '100%',
    //           py: 1,
    //           px: 0.5,
    //         }}
    //       >
    //         <Typography
    //           variant="caption"
    //           color="warning.main"
    //           sx={{
    //             fontSize: '0.65rem',
    //             lineHeight: 1.2,
    //             fontWeight: 500,
    //             mb: 0.3,
    //           }}
    //         >
    //           ETA: {params.row.estimatedCompletion}
    //         </Typography>
    //         <Typography
    //           variant="caption"
    //           color="text.secondary"
    //           sx={{
    //             fontSize: '0.65rem',
    //             lineHeight: 1.2,
    //           }}
    //           title={params.row.location || 'N/A'}
    //         >
    //           {params.row.location || 'N/A'}
    //         </Typography>
    //       </Box>
    //     ),
    //   },
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
            {' '}
            {rolesAndPermission.crm_bookings_list_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleUpdateStatus(params.row)}
                  disabled={loading}
                  sx={{
                    minWidth: '30px',
                    padding: '4px 6px',
                    '& .MuiButton-startIcon': { margin: 0 },
                  }}
                  title="Update Progress"
                >
                  <IconAnalyze stroke={1.5} size={14} />
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
              sx={{
                minWidth: '30px',
                padding: '4px 6px',
                '& .MuiButton-startIcon': { margin: 0 },
              }}
              title="View Order"
            >
              <IconEye size={14} />
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
      title="Rescheduled Orders - Verified Partners"
      description="Monitor and manage premium services currently being performed by verified partners"
    >
      <Breadcrumb title="Rescheduled Orders- Verified Partners" items={BCrumb} />
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
            <Typography variant="h6">Rescheduled Orders- Verified Partners</Typography>
            <Typography variant="body2" color="text.secondary">
              Premium services currently being performed by verified partners ({filteredData.length}{' '}
              orders)
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
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowHeight={120}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              loading={loading}
              density="compact"
              sx={{
                border: 'none',
                width: '100%',
                maxWidth: '100%',
                '& .MuiDataGrid-main': {
                  overflow: 'hidden',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  padding: '4px 8px',
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
                  fontSize: '0.8rem',
                  minHeight: '40px !important',
                  maxHeight: '40px !important',
                },
                '& .MuiDataGrid-columnHeader': {
                  padding: '4px 8px',
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'hidden auto',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: `1px solid ${theme.palette.divider}`,
                  minHeight: '45px',
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
        <DialogTitle>Update Service Progress</DialogTitle>
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
                  <MenuItem value="completed">Mark as Completed</MenuItem>
                  <MenuItem value="update-progress">Update Progress Phase</MenuItem>
                  <MenuItem value="extend-timeline">Extend Timeline</MenuItem>
                  <MenuItem value="cancelled">Cancel Service</MenuItem>
                  <MenuItem value="escalate">Escalate Issue</MenuItem>
                </CustomSelect>
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="comment">Progress Notes</CustomFormLabel>
                <CustomTextField
                  id="comment"
                  name="comment"
                  value={formEdit.comment}
                  onChange={handleEditInputChange}
                  placeholder="Add progress update, completion notes, or issue details..."
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
              {loading ? 'Updating...' : 'Update Progress'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default RescheduledOrders;

